using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Storage;

namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Upload policy for a canonical file use case.
/// </summary>
public sealed record FilePolicy(
    FileUseCase UseCase,
    FileCategory Category,
    FileVisibility Visibility,
    IReadOnlySet<string> AllowedContentTypes,
    IReadOnlySet<string> AllowedExtensions,
    long MaxBytes,
    bool RequiresRelatedPatient,
    bool RequiresRelatedProvider,
    bool RequiresRelatedService,
    bool RequiresRelatedBooking,
    bool RequiresRelatedApplication,
    RetentionPolicy RetentionPolicy);

/// <summary>
/// Resolves file use cases to backend-owned validation policies.
/// </summary>
public interface IFilePolicyResolver
{
    FilePolicy Resolve(FileUseCase useCase);
}

/// <summary>
/// Static policy resolver for the first backend-owned file migration.
/// </summary>
public class FilePolicyResolver : IFilePolicyResolver
{
    private static readonly HashSet<string> ImageContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/png",
        "image/webp"
    };

    private static readonly HashSet<string> DocumentContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "application/pdf",
        "image/jpeg",
        "image/png"
    };

    private static readonly HashSet<string> ExportContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "application/zip"
    };

    private static readonly HashSet<string> ImageExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    };

    private static readonly HashSet<string> DocumentExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png"
    };

    private static readonly HashSet<string> ExportExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".zip"
    };

    /// <inheritdoc />
    public FilePolicy Resolve(FileUseCase useCase)
    {
        return useCase switch
        {
            FileUseCase.Avatar => new FilePolicy(
                useCase,
                FileCategory.Image,
                FileVisibility.Private,
                ImageContentTypes,
                ImageExtensions,
                5 * 1024 * 1024,
                RequiresRelatedPatient: false,
                RequiresRelatedProvider: false,
                RequiresRelatedService: false,
                RequiresRelatedBooking: false,
                RequiresRelatedApplication: false,
                RetentionPolicy.Standard1Year),

            FileUseCase.ProviderAvatar => new FilePolicy(
                useCase,
                FileCategory.Image,
                FileVisibility.Public,
                ImageContentTypes,
                ImageExtensions,
                5 * 1024 * 1024,
                RequiresRelatedPatient: false,
                RequiresRelatedProvider: false,
                RequiresRelatedService: false,
                RequiresRelatedBooking: false,
                RequiresRelatedApplication: false,
                RetentionPolicy.Standard1Year),

            FileUseCase.Prescription => new FilePolicy(
                useCase,
                FileCategory.Document,
                FileVisibility.Private,
                DocumentContentTypes,
                DocumentExtensions,
                20 * 1024 * 1024,
                RequiresRelatedPatient: true,
                RequiresRelatedProvider: false,
                RequiresRelatedService: false,
                RequiresRelatedBooking: false,
                RequiresRelatedApplication: false,
                RetentionPolicy.Medical7Years),

            FileUseCase.ProviderCredential => new FilePolicy(
                useCase,
                FileCategory.Document,
                FileVisibility.Private,
                DocumentContentTypes,
                DocumentExtensions,
                25 * 1024 * 1024,
                RequiresRelatedPatient: false,
                RequiresRelatedProvider: true,
                RequiresRelatedService: false,
                RequiresRelatedBooking: false,
                RequiresRelatedApplication: false,
                RetentionPolicy.Standard1Year),

            FileUseCase.ProviderSignupDocument => new FilePolicy(
                useCase,
                FileCategory.Document,
                FileVisibility.Private,
                DocumentContentTypes,
                DocumentExtensions,
                25 * 1024 * 1024,
                RequiresRelatedPatient: false,
                RequiresRelatedProvider: false,
                RequiresRelatedService: false,
                RequiresRelatedBooking: false,
                RequiresRelatedApplication: true,
                RetentionPolicy.Standard1Year),

            FileUseCase.ServicePhoto => new FilePolicy(
                useCase,
                FileCategory.Image,
                FileVisibility.Public,
                ImageContentTypes,
                ImageExtensions,
                10 * 1024 * 1024,
                RequiresRelatedPatient: false,
                RequiresRelatedProvider: true,
                RequiresRelatedService: true,
                RequiresRelatedBooking: false,
                RequiresRelatedApplication: false,
                RetentionPolicy.Standard1Year),

            FileUseCase.MedicalDocument => new FilePolicy(
                useCase,
                FileCategory.Document,
                FileVisibility.Private,
                DocumentContentTypes,
                DocumentExtensions,
                25 * 1024 * 1024,
                RequiresRelatedPatient: true,
                RequiresRelatedProvider: false,
                RequiresRelatedService: false,
                RequiresRelatedBooking: false,
                RequiresRelatedApplication: false,
                RetentionPolicy.Medical7Years),

            FileUseCase.BookingAttachment => new FilePolicy(
                useCase,
                FileCategory.Attachment,
                FileVisibility.Restricted,
                DocumentContentTypes,
                DocumentExtensions,
                25 * 1024 * 1024,
                RequiresRelatedPatient: false,
                RequiresRelatedProvider: false,
                RequiresRelatedService: false,
                RequiresRelatedBooking: true,
                RequiresRelatedApplication: false,
                RetentionPolicy.Standard1Year),

            FileUseCase.Invoice => new FilePolicy(
                useCase,
                FileCategory.Document,
                FileVisibility.Private,
                DocumentContentTypes,
                DocumentExtensions,
                10 * 1024 * 1024,
                RequiresRelatedPatient: false,
                RequiresRelatedProvider: false,
                RequiresRelatedService: false,
                RequiresRelatedBooking: false,
                RequiresRelatedApplication: false,
                RetentionPolicy.Standard1Year),

            FileUseCase.GdprExport => new FilePolicy(
                useCase,
                FileCategory.Export,
                FileVisibility.Private,
                ExportContentTypes,
                ExportExtensions,
                500 * 1024 * 1024,
                RequiresRelatedPatient: false,
                RequiresRelatedProvider: false,
                RequiresRelatedService: false,
                RequiresRelatedBooking: false,
                RequiresRelatedApplication: false,
                RetentionPolicy.Temporary30Days),

            _ => throw new InvalidOperationException($"Unsupported file use case '{useCase}'.")
        };
    }
}
