# Equipment Image Upload Design

Date: 2026-05-06
Status: Superseded by the 2026-05-13 backend-owned file-handling migration
Scope: Create/edit equipment main image upload, frontend and backend

Superseded note: the active frontend behavior no longer uses upload intents, presigned PUT URLs, `assetId`, or direct MinIO browser access. Equipment images now upload through `POST /api/v1/files` as multipart form data and attach the returned `fileId` to the provider-service photo endpoint. The historical design below describes the former behavior and must not be used for new implementation work.

## Context

The workspace has two sibling applications:

- `CareAtHomeFinal/`: React, TypeScript, Vite frontend.
- `Sanad CareAtHome Backend/`: ASP.NET Core 8 backend.

Equipment items are represented as provider services in the backend. The equipment form in `CareAtHomeFinal/src/features/equipment/public/EquipmentForm.tsx` currently accepts an `imageUrl` string. The equipment frontend schemas already expose `EquipmentResponse.imageUrl` and `EquipmentDetailResponse.images`, but backend equipment queries currently return empty image values.

The backend already has most of the upload infrastructure:

- `Features/Uploads` creates upload intents, returns presigned PUT URLs, validates completed uploads, and creates `Asset` or `Document` records.
- `UploadUseCase.ServicePhoto` stores public service photos in MinIO.
- `Features/Assets/Commands/AttachServicePhoto.cs` attaches an uploaded asset to a provider service and can mark it as the main photo.
- `Features/Services/Entities/Service.cs` already has `MainImageAssetId` and `Photos`.

The frontend already uses the same pattern elsewhere:

- Avatars upload an `Avatar` asset, persist the returned asset ID, then render a backend-provided avatar URL.
- Prescriptions upload a `Prescription` document and submit the returned document ID with the booking.
- Provider service photos use `useUploadAndAttachServicePhoto()`, which uploads a `ServicePhoto` asset and attaches it to an existing service.

## Goal

Support one optional main image for provider-created equipment items, end to end.

The provider can create or edit equipment with or without an image. If an image is selected, the frontend saves the equipment details, uploads the image through the existing upload-intent flow, attaches the resulting asset as the service's main photo, and refreshes the relevant equipment/provider-service caches. Public catalog and detail screens render backend-provided image URLs.

## Non-Goals

This design does not include:

- Multiple image galleries.
- Drag-and-drop reordering.
- Image cropping, compression, or derivative generation.
- Rental pickup or return condition photos.
- A new equipment-specific upload use case.
- A new storage bucket or table.
- Raw external image URL support for equipment authoring.

## Approved Decisions

- Image upload targets create/edit equipment first, not rental condition photos.
- Equipment images are optional initially.
- The first version supports one main image only.
- Equipment catalog and detail endpoints return backend-generated image URLs.
- Create flow uses save-then-upload: save equipment first, then upload and attach the selected image.
- If equipment save succeeds but image upload or attach fails, keep the equipment item and show a retry path.

## Approach Comparison

### Recommended: Reuse `ServicePhoto` Uploads

The frontend uploads the selected file as `UploadUseCase.ServicePhoto`, passes the equipment service ID as `relatedServiceId`, completes the upload intent, then attaches the returned asset as `isMain: true`.

This approach fits the current domain model because equipment is already a provider service. It reuses existing storage policy, MinIO validation, asset records, and the provider service photo attachment endpoint.

### Alternative: Store Raw Image URLs

The frontend could keep the current `imageUrl` string field and store arbitrary URLs in service metadata.

This does not solve upload. It bypasses MinIO validation, allows untrusted external URLs, and conflicts with existing avatar, prescription, and service-photo patterns.

### Alternative: Add `EquipmentImage` Upload Use Case

The backend could add an equipment-specific use case and endpoint.

This is more explicit, but duplicates `ServicePhoto` behavior. It adds backend API surface without a current need, because the first version only needs one optional main image for a service-backed equipment item.

## Architecture

The design keeps uploads and equipment authoring as separate responsibilities.

- `features/uploads` remains the generic file-transfer boundary. It validates client-side policy, creates intents, uploads to presigned PUT URLs, completes intents, and returns storage IDs.
- `features/providers` remains the service-photo attachment boundary. It links an uploaded asset to a service and marks it as the main photo.
- `features/equipment` owns equipment form behavior and equipment-specific DTO mapping.
- Backend `Features/Equipment` owns equipment catalog/detail read models and enriches those read models with image URLs.

No component writes directly to MinIO except through the existing presigned upload helper. No frontend component stores MinIO object keys, buckets, or storage internals.

## Frontend Design

### Equipment Form

Replace the raw `imageUrl` text field with one optional file input for the main image.

The form should keep these local states:

- selected image file.
- preview URL for the selected file.
- upload-in-progress state.
- image upload error, if the image phase fails after equipment details are saved.

The form should continue to use React Hook Form and Zod for equipment details. Frontend file validation should match the existing `ServicePhoto` upload policy:

- MIME type `image/jpeg`, `image/png`, or `image/webp`.
- Maximum 10 MiB.

Backend validation remains authoritative for file extension, declared metadata, object metadata, and byte signature.

### Create Flow

On submit:

1. Build the equipment details payload without an `imageUrl` field.
2. Call `createEquipmentService()`.
3. If no image file was selected, finish successfully.
4. If an image file was selected, upload it with `useCase: 'ServicePhoto'` and `relatedServiceId` equal to the provider service ID returned by create.
5. Require the upload result to be `{ kind: 'asset' }`.
6. Attach that asset with `isMain: true` and `sortOrder: 0`.
7. Invalidate equipment catalog/detail and provider service caches.

### Edit Flow

On submit:

1. Save changed equipment details with `updateEquipmentService()`.
2. If no new image file was selected, finish successfully.
3. If a new image file was selected, upload it as `ServicePhoto` with the existing provider service ID.
4. Attach the returned asset as `isMain: true` and `sortOrder: 0`.
5. Invalidate equipment and provider-service caches.

The first version does not delete old main image objects. Existing `AttachServicePhotoCommand` clears the previous main flag and updates `Service.MainImageAssetId`. Storage cleanup is deferred to a separate maintenance task.

### Frontend Boundaries

Reuse `useUploadAndAttachServicePhoto()` only if it can be called with `serviceId`, `file`, and an optional `AbortSignal` without importing provider UI or form state. Otherwise, add a small equipment-owned helper or hook that calls the existing upload API and `attachServicePhoto()` service function.

The helper should expose one operation:

- `uploadAndAttachEquipmentMainImage(serviceId, file, signal?)`.

The `serviceId` argument is the provider service ID used by `/providers/me/services/{id}/photos`; do not introduce a separate equipment-specific ID unless it is the same value. The operation should return the service-photo attachment response and throw normal frontend API errors. It should not know about equipment form fields other than the service ID and file.

## Backend Design

### Keep Existing Upload Writes

Do not add new upload endpoints for this work. Continue to use:

- `POST /api/v1/uploads/intents` with `useCase: ServicePhoto`.
- Presigned PUT upload to MinIO.
- `POST /api/v1/uploads/intents/{id}/complete`.
- `POST /api/v1/providers/me/services/{id}/photos` with `isMain: true`.

`CreateUploadIntentHandler` already validates that `ServicePhoto` uploads belong to the authenticated provider and require a related service.

### Enrich Equipment Catalog Images

Update `EquipmentRepository.GetCatalogAsync()` so each equipment item can include its main image URL.

The query should project `Service.MainImageAssetId`. After materializing the paginated service rows, the repository should:

1. Collect non-null main image asset IDs.
2. Batch-load ready assets from `Assets` with `AsNoTracking()`.
3. Generate a download URL for each asset through `IMinioStorageService.GeneratePresignedDownloadUrlAsync()`.
4. Set `EquipmentResponse.ImageUrl` to the generated URL or `string.Empty` when unavailable.

The repository must not perform extra per-row database queries. It may generate MinIO URLs sequentially after one asset query.

### Enrich Equipment Detail Images

Update `EquipmentRepository.GetByIdAsync()` to project `Service.MainImageAssetId` and return:

- `Images = [mainImageUrl]` when the main image exists and URL generation succeeds.
- `Images = []` when no main image exists or URL generation fails.

This preserves the current frontend `images: string[]` shape.

### URL Resolution Failure

If URL generation fails for a ready asset, the backend should log a warning with structured properties and return an empty image value. The catalog and detail endpoints should not fail only because an image URL could not be generated.

### API Contract

The display contract remains:

- Catalog: `EquipmentResponse.ImageUrl` is a string. It is empty when no image is available.
- Detail: `EquipmentDetailResponse.Images` is a list of strings. It is empty when no image is available.

No new asset ID field is required in the equipment catalog/detail response for the first version.

## Data Flow

### Create With Image

1. Provider selects an image file in the equipment form.
2. Provider submits the form.
3. Frontend creates the equipment service.
4. Backend returns the created provider service ID.
5. Frontend creates a `ServicePhoto` upload intent for that provider service ID.
6. Backend returns a presigned PUT URL.
7. Frontend uploads the file directly to MinIO.
8. Frontend completes the upload intent.
9. Backend verifies object existence, size, content type, and file signature.
10. Backend creates an `Asset` record and returns `assetId`.
11. Frontend attaches `assetId` to the service as the main photo.
12. Backend sets `Service.MainImageAssetId` and records a `ServicePhoto` row.
13. Frontend invalidates equipment and provider service caches.
14. Catalog/detail reads return backend-generated image URLs.

### Create Without Image

1. Provider submits equipment details without a selected file.
2. Frontend creates the equipment service.
3. No upload intent is created.
4. Catalog/detail reads return empty image values, and UI uses existing placeholders.

### Replace Image On Edit

1. Provider selects a new image in edit mode.
2. Frontend saves equipment details.
3. Frontend uploads the selected file as `ServicePhoto` for the existing provider service ID.
4. Frontend attaches the new asset as `isMain: true`.
5. Backend clears previous main photo flags and updates `Service.MainImageAssetId`.
6. Future catalog/detail reads return the new image URL.

## Error Handling

### File Validation

The frontend validates selected files before upload through the existing `ServicePhoto` policy: MIME type `image/jpeg`, `image/png`, or `image/webp`, and size up to 10 MiB. Invalid type or size errors appear beside the image field and prevent upload.

The backend remains the source of truth. It validates declared metadata when creating an intent and validates stored object bytes on completion.

### Upload Failure

If upload intent creation, presigned PUT, completion, or attach fails after equipment details save:

- Keep the created or updated equipment item.
- Show a clear message: equipment details were saved, but image upload failed.
- Keep the user on the edit form when possible and preserve the selected `File` object in memory for retry.
- If the user leaves the form, show a message that the equipment was saved and the image must be reselected to retry.
- Do not roll back or delete the equipment item.

The existing upload helper already aborts an upload intent when PUT fails and the request was not cancelled.

### Cancelled Upload

If the user leaves or cancels while the image upload is in progress, the frontend should avoid claiming image success. The equipment upload helper accepts an optional `AbortSignal` and passes it to upload intent creation, presigned PUT upload, completion, and attach calls where those APIs support cancellation. If attach does not support cancellation, it may complete normally.

### Missing Image

Missing image is a valid state. Public equipment cards and detail pages should render the existing placeholder or fallback visual.

## Security And Access

- Providers can upload service photos only for services they own.
- The backend validates `relatedServiceId` against the authenticated provider before issuing the upload URL.
- The frontend does not send bucket names, object keys, or storage paths.
- The backend validates file extension, declared content type, object metadata, and byte signature.
- Public equipment image URLs are generated by the backend from ready assets only.

## Cache And Expiry

Presigned image URLs expire. Equipment queries should be treated as data that can be refetched to obtain fresh URLs.

The frontend should invalidate:

- `equipmentKeys.all` after create, update, or successful image attach.
- `providerKeys.myServices()` after create, update, or successful image attach.
- `providerKeys.myServiceDetail(serviceId)` if the form is editing an existing service and that detail query is used.

If image URLs expire while a page is open, the first version may rely on normal query refetch or user navigation. Automatic image URL refresh is out of scope.

## Testing And Verification

No new tests are required by default under current project rules, but the implementation should be verified manually and with existing checks.

Frontend checks:

- `npm run lint` from `CareAtHomeFinal/`.
- `npm run type-check` from `CareAtHomeFinal/`.

Backend check:

- `dotnet build "Sanad Platform Official.sln"` from `Sanad CareAtHome Backend/`.

Manual scenarios:

- Create equipment without image; catalog and detail show fallback image treatment.
- Create equipment with valid image; catalog card and detail hero show the uploaded image.
- Edit equipment without changing image; existing image remains.
- Edit equipment and select a new valid image; catalog/detail show the new main image.
- Select an invalid file type; upload is blocked with a field error.
- Select an oversized file; upload is blocked with a field error.
- Simulate upload failure after equipment save; equipment remains saved and UI shows a retry path.

## Implementation Notes

Likely frontend touch points:

- `src/features/equipment/public/EquipmentForm.tsx`.
- `src/features/equipment/schema.ts`.
- `src/features/equipment/admin-service.ts`.
- `src/features/equipment/hooks/useEquipmentMutations.ts` or a small new equipment upload helper.
- Existing upload helpers in `src/features/uploads` should be reused, not duplicated.
- Existing `attachServicePhoto()` in `src/features/providers/service.ts` can be reused directly from an equipment helper. If that import creates an unclear provider/equipment boundary, re-export it from a neutral service-photo helper without changing endpoint behavior.

Likely backend touch points:

- `Features/Equipment/Repository/EquipmentRepository.cs`.
- `Features/Equipment/DTOs` only if backend DTO nullability needs clarification.
- Dependency registration only if `EquipmentRepository` constructor changes require registered dependencies already available in DI.

Avoid broad refactors. Keep changes limited to equipment image upload and equipment image read enrichment.

## Open Follow-Ups

These are intentionally out of scope for the first version:

- Delete or garbage-collect superseded service-photo assets.
- Add gallery support.
- Generate thumbnails or responsive derivatives.
- Add automatic refresh for expired presigned image URLs.
- Add rental pickup and return condition photo uploads.
