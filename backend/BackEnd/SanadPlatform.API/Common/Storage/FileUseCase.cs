namespace SanadPlatform.API.Common.Storage;

/// <summary>
/// Canonical file use cases supported by the backend-owned file pipeline.
/// </summary>
public enum FileUseCase
{
    Avatar,
    ProviderAvatar,
    Prescription,
    ProviderCredential,
    ProviderSignupDocument,
    ServicePhoto,
    MedicalDocument,
    BookingAttachment,
    Invoice,
    GdprExport
}
