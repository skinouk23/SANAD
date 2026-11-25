import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Plus, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useLanguage } from '@/shared/lib/i18n/language-context';
import {
  useCreateEquipment,
  useEquipmentCategories,
  useUpdateEquipment,
  useUploadAndAttachEquipmentMainImage,
} from '@/features/equipment/hooks';
import type {
  EquipmentAdminFormValues,
  EquipmentFeatureRow,
  EquipmentSpecificationRow,
} from '@/features/equipment/schema';
import { EquipmentAdminFormSchema, toCreateEquipmentData } from '@/features/equipment/schema';
import { getUploadAcceptAttribute } from '@/features/files';
import { FormActions, FormField, FormStatusMessage } from '@/shared/ui/composites/form-field';
import { Button } from '@/shared/ui/primitives/button';
import { Card } from '@/shared/ui/primitives/card';
import { FieldGroup } from '@/shared/ui/primitives/field';
import { Input } from '@/shared/ui/primitives/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/primitives/select';
import { Spinner } from '@/shared/ui/primitives/spinner';
import { Textarea } from '@/shared/ui/primitives/textarea';

// ============================================
// TYPES
// ============================================

export interface EquipmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editData?: {
    id: string;
    name: string;
    description?: string;
    categoryCode: string;
    brand?: string;
    model?: string;
    pricePerDay: number;
    pricePerWeek: number;
    pricePerMonth: number;
    deposit: number;
    specifications?: Record<string, string>;
    features?: string[];
    imageUrl?: string;
  };
}

// ============================================
// HELPERS
// ============================================

const EMPTY_EQUIPMENT_CATEGORY_VALUE = '__empty_equipment_category__';
const EQUIPMENT_IMAGE_ACCEPT = getUploadAcceptAttribute('ServicePhoto');
const PARTIAL_SUCCESS_IMAGE_ERROR =
  'Les details de l equipement ont ete enregistres, mais l image n a pas pu etre televersee. Vous pouvez reessayer sans recreer l equipement.';

function specsToRows(specs?: Record<string, string>): EquipmentSpecificationRow[] {
  if (!specs) {
    return [];
  }

  return Object.entries(specs).map(([key, value]) => ({ key, value }));
}

function featuresToRows(features?: string[]): EquipmentFeatureRow[] {
  return (features ?? []).map((value) => ({ value }));
}

function getDefaultValues(editData?: EquipmentFormProps['editData']): EquipmentAdminFormValues {
  if (!editData) {
    return {
      name: '',
      description: '',
      categoryCode: '',
      brand: '',
      model: '',
      pricePerDay: '',
      pricePerWeek: '',
      pricePerMonth: '',
      deposit: '',
      specifications: [],
      features: [],
    };
  }

  return {
    name: editData.name,
    description: editData.description ?? '',
    categoryCode: editData.categoryCode,
    brand: editData.brand ?? '',
    model: editData.model ?? '',
    pricePerDay: String(editData.pricePerDay),
    pricePerWeek: String(editData.pricePerWeek),
    pricePerMonth: String(editData.pricePerMonth),
    deposit: String(editData.deposit),
    specifications: specsToRows(editData.specifications),
    features: featuresToRows(editData.features),
  };
}

// ============================================
// COMPONENT
// ============================================

export function EquipmentForm({ onSuccess, onCancel, editData }: EquipmentFormProps) {
  const { t } = useLanguage();
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useEquipmentCategories();
  const createMutation = useCreateEquipment();
  const updateMutation = useUpdateEquipment();
  const uploadImageMutation = useUploadAndAttachEquipmentMainImage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [savedServiceIdForImageRetry, setSavedServiceIdForImageRetry] = useState<string | null>(
    null,
  );

  const isEditMode = !!editData;
  const isSaving = createMutation.loading || updateMutation.loading || uploadImageMutation.loading;
  const defaultValues = useMemo(() => getDefaultValues(editData), [editData]);

  const form = useForm<EquipmentAdminFormValues>({
    resolver: zodResolver(EquipmentAdminFormSchema),
    defaultValues,
  });

  const specificationFields = useFieldArray({
    control: form.control,
    name: 'specifications',
  });
  const featureFields = useFieldArray({
    control: form.control,
    name: 'features',
  });

  const clearSelectedImage = useCallback(() => {
    setSelectedImageFile(null);
    setImagePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      previewUrlRef.current = null;
      return null;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const uploadSelectedImage = async (serviceId: string, file: File) => {
    await uploadImageMutation.mutateAsync({
      serviceId,
      file,
    });
    clearSelectedImage();
    setSavedServiceIdForImageRetry(null);
  };

  useEffect(() => {
    form.reset(defaultValues);
    setSubmitError(null);
    setSavedServiceIdForImageRetry(null);
    clearSelectedImage();
  }, [clearSelectedImage, defaultValues, form]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedImageFile(file);
    setSubmitError(null);

    setImagePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      if (!file) {
        previewUrlRef.current = null;
        return null;
      }

      const nextUrl = URL.createObjectURL(file);
      previewUrlRef.current = nextUrl;
      return nextUrl;
    });
  };

  const openImagePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleRetryImageUpload = async () => {
    if (!selectedImageFile || !savedServiceIdForImageRetry) {
      return;
    }

    setSubmitError(null);

    try {
      await uploadSelectedImage(savedServiceIdForImageRetry, selectedImageFile);
      onSuccess();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? `${PARTIAL_SUCCESS_IMAGE_ERROR} ${error.message}`
          : PARTIAL_SUCCESS_IMAGE_ERROR,
      );
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const payload = toCreateEquipmentData(values);
      let serviceId = editData?.id;

      if (isEditMode) {
        const updatedService = await updateMutation.mutateAsync({ id: editData.id, data: payload });
        serviceId = updatedService.id;
      } else if (savedServiceIdForImageRetry) {
        serviceId = savedServiceIdForImageRetry;
      } else {
        const createdService = await createMutation.mutateAsync(payload);
        serviceId = createdService.id;
      }

      if (selectedImageFile) {
        try {
          await uploadSelectedImage(serviceId, selectedImageFile);
        } catch (error) {
          setSavedServiceIdForImageRetry(serviceId);
          setSubmitError(
            error instanceof Error
              ? `${PARTIAL_SUCCESS_IMAGE_ERROR} ${error.message}`
              : PARTIAL_SUCCESS_IMAGE_ERROR,
          );
          return;
        }
      }

      setSavedServiceIdForImageRetry(null);
      onSuccess();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  });

  return (
    <Card>
      <h3 className="mb-6 text-xl font-bold text-foreground">
        {isEditMode ? t.common.edit : t.common.add} {t.equipment.title}
      </h3>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            error={form.formState.errors.name?.message}
            htmlFor="equipment-name"
            label={t.equipment.searchPlaceholder?.replace('...', '') || 'Name'}
            required
          >
            <Input
              id="equipment-name"
              placeholder="Ex: Fauteuil Roulant Manuel"
              {...form.register('name')}
            />
          </FormField>

          <FormField
            error={form.formState.errors.categoryCode?.message}
            htmlFor="equipment-category"
            label={t.equipment.categories}
            required
          >
            <Controller
              control={form.control}
              name="categoryCode"
              render={({ field }) => {
                const placeholder = categoriesLoading
                  ? t.common.loading
                  : categoriesError
                    ? t.common.loadingError
                    : t.equipment.categories;

                return (
                  <Select
                    name={field.name}
                    onValueChange={(value) => {
                      field.onChange(value === EMPTY_EQUIPMENT_CATEGORY_VALUE ? '' : value);
                    }}
                    value={field.value || EMPTY_EQUIPMENT_CATEGORY_VALUE}
                  >
                    <SelectTrigger
                      aria-invalid={form.formState.errors.categoryCode ? true : undefined}
                      className="w-full"
                      disabled={categoriesLoading || !!categoriesError || isSaving}
                      id="equipment-category"
                      onBlur={field.onBlur}
                      ref={field.ref}
                    >
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={EMPTY_EQUIPMENT_CATEGORY_VALUE}>{placeholder}</SelectItem>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.code}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                );
              }}
            />
          </FormField>
        </FieldGroup>

        {categoriesLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner />
            <span>{t.common.loading}</span>
          </div>
        ) : null}

        {categoriesError ? (
          <FormStatusMessage>
            <div className="flex items-center justify-between gap-3">
              <span>Impossible de charger les categories d equipement.</span>
              <Button
                onClick={() => {
                  void refetchCategories();
                }}
                size="sm"
                type="button"
                variant="outline"
              >
                {t.common.retry}
              </Button>
            </div>
          </FormStatusMessage>
        ) : null}

        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            error={form.formState.errors.brand?.message}
            htmlFor="equipment-brand"
            label="Marque"
          >
            <Input id="equipment-brand" placeholder="Ex: Invacare" {...form.register('brand')} />
          </FormField>

          <FormField
            error={form.formState.errors.model?.message}
            htmlFor="equipment-model"
            label="Modele"
          >
            <Input id="equipment-model" placeholder="Ex: Action 1" {...form.register('model')} />
          </FormField>
        </FieldGroup>

        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FormField
            error={form.formState.errors.pricePerDay?.message}
            htmlFor="equipment-price-day"
            label={t.common.pricePerDay}
            required
          >
            <Input
              id="equipment-price-day"
              min="0"
              step="0.01"
              type="number"
              {...form.register('pricePerDay')}
            />
          </FormField>

          <FormField
            error={form.formState.errors.pricePerWeek?.message}
            htmlFor="equipment-price-week"
            label="Prix/semaine"
          >
            <Input
              id="equipment-price-week"
              min="0"
              step="0.01"
              type="number"
              {...form.register('pricePerWeek')}
            />
          </FormField>

          <FormField
            error={form.formState.errors.pricePerMonth?.message}
            htmlFor="equipment-price-month"
            label="Prix/mois"
          >
            <Input
              id="equipment-price-month"
              min="0"
              step="0.01"
              type="number"
              {...form.register('pricePerMonth')}
            />
          </FormField>

          <FormField
            error={form.formState.errors.deposit?.message}
            htmlFor="equipment-deposit"
            label="Depot garantie"
            required
          >
            <Input
              id="equipment-deposit"
              min="0"
              step="0.01"
              type="number"
              {...form.register('deposit')}
            />
          </FormField>
        </FieldGroup>

        <FormField
          error={form.formState.errors.description?.message}
          htmlFor="equipment-description"
          label="Description"
        >
          <Textarea
            id="equipment-description"
            placeholder="Description detaillee de l equipement..."
            rows={3}
            {...form.register('description')}
          />
        </FormField>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Caracteristiques techniques</p>
              <p className="text-xs text-muted-foreground">
                Ajoutez des paires cle/valeur si necessaire.
              </p>
            </div>
            <Button
              onClick={() => specificationFields.append({ key: '', value: '' })}
              size="sm"
              type="button"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>

          {specificationFields.fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune caracteristique ajoutee.</p>
          ) : null}

          <div className="flex flex-col gap-2">
            {specificationFields.fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
              >
                <Input
                  placeholder="Cle (ex: Poids)"
                  {...form.register(`specifications.${index}.key`)}
                />
                <Input
                  placeholder="Valeur (ex: 15kg)"
                  {...form.register(`specifications.${index}.value`)}
                />
                <Button
                  aria-label="Supprimer la caracteristique"
                  onClick={() => specificationFields.remove(index)}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Fonctionnalites</p>
              <p className="text-xs text-muted-foreground">
                Ajoutez les avantages visibles pour le patient.
              </p>
            </div>
            <Button
              onClick={() => featureFields.append({ value: '' })}
              size="sm"
              type="button"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>

          {featureFields.fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune fonctionnalite ajoutee.</p>
          ) : null}

          <FieldGroup className="gap-2">
            {featureFields.fields.map((field, index) => (
              <FormField
                key={field.id}
                error={form.formState.errors.features?.[index]?.value?.message}
                htmlFor={`equipment-feature-${field.id}`}
                label={`Fonctionnalite ${index + 1}`}
              >
                <div className="flex items-center gap-2">
                  <Input
                    id={`equipment-feature-${field.id}`}
                    placeholder="Ex: Livraison gratuite"
                    {...form.register(`features.${index}.value`)}
                  />
                  <Button
                    aria-label="Supprimer la fonctionnalite"
                    onClick={() => featureFields.remove(index)}
                    size="icon"
                    type="button"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </FormField>
            ))}
          </FieldGroup>
        </section>

        <FormField
          htmlFor="equipment-main-image"
          hint="Formats acceptes: JPG, PNG ou WebP. Taille maximale: 10 MB."
          label="Image principale"
        >
          <input
            ref={fileInputRef}
            accept={EQUIPMENT_IMAGE_ACCEPT}
            className="sr-only"
            id="equipment-main-image"
            onChange={handleImageFileChange}
            type="file"
          />
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-background sm:w-36">
                {imagePreviewUrl ? (
                  <img
                    alt="Apercu de l image principale"
                    className="h-full w-full object-cover"
                    src={imagePreviewUrl}
                  />
                ) : editData?.imageUrl ? (
                  <img
                    alt="Image principale actuelle"
                    className="h-full w-full object-cover"
                    src={editData.imageUrl}
                  />
                ) : (
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {selectedImageFile?.name ?? 'Selectionnez une image depuis votre appareil.'}
                  </p>
                  {selectedImageFile ? (
                    <p className="text-xs text-muted-foreground">
                      L image sera envoyee apres l enregistrement des details.
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    disabled={isSaving}
                    onClick={openImagePicker}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    Choisir une image
                  </Button>
                  {selectedImageFile ? (
                    <Button
                      disabled={isSaving}
                      onClick={clearSelectedImage}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <X className="h-4 w-4" />
                      Retirer
                    </Button>
                  ) : null}
                  {selectedImageFile && savedServiceIdForImageRetry ? (
                    <Button
                      disabled={isSaving}
                      onClick={() => {
                        void handleRetryImageUpload();
                      }}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      Reessayer l image
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </FormField>

        {submitError ? <FormStatusMessage>{submitError}</FormStatusMessage> : null}

        <FormActions className="border-t border-border pt-4">
          <Button disabled={isSaving} type="button" variant="outline" onClick={onCancel}>
            {t.common.cancel}
          </Button>
          <Button disabled={isSaving} type="submit">
            {isSaving ? (
              <>
                <Spinner data-icon="inline-start" />
                {t.common.loading}
              </>
            ) : isEditMode ? (
              t.common.save
            ) : (
              t.common.add
            )}
          </Button>
        </FormActions>
      </form>
    </Card>
  );
}
