using MediatR;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.Services;
using SanadPlatform.API.Features.Pharmacy.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Pharmacy.Queries;

// ==================== Query ====================

/// <summary>
/// Retrieves prescription file content for a provider-owned pharmacy order.
/// </summary>
public record GetProviderPharmacyOrderPrescriptionContentQuery(
    Guid CallerUserId,
    Guid OrderId,
    string? IpAddress,
    string? UserAgent,
    string? CorrelationId) : IRequest<FileContentResultData>;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="GetProviderPharmacyOrderPrescriptionContentQuery"/> by domain-authorizing the order first.
/// </summary>
public class GetProviderPharmacyOrderPrescriptionContentHandler : IRequestHandler<GetProviderPharmacyOrderPrescriptionContentQuery, FileContentResultData>
{
    private readonly IPharmacyOrderRepository _pharmacyRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IFileContentService _fileContentService;
    private readonly ILogger<GetProviderPharmacyOrderPrescriptionContentHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetProviderPharmacyOrderPrescriptionContentHandler"/> class.
    /// </summary>
    public GetProviderPharmacyOrderPrescriptionContentHandler(
        IPharmacyOrderRepository pharmacyRepository,
        IProviderRepository providerRepository,
        IFileContentService fileContentService,
        ILogger<GetProviderPharmacyOrderPrescriptionContentHandler> logger)
    {
        _pharmacyRepository = pharmacyRepository ?? throw new ArgumentNullException(nameof(pharmacyRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _fileContentService = fileContentService ?? throw new ArgumentNullException(nameof(fileContentService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Resolves the provider identity, verifies order ownership, and streams prescription content.
    /// </summary>
    public async Task<FileContentResultData> Handle(
        GetProviderPharmacyOrderPrescriptionContentQuery query,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.CallerUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Provider profile not found for the authenticated user.");

        var prescriptionFileId = await _pharmacyRepository.GetProviderOrderPrescriptionFileIdAsync(
            providerId,
            query.OrderId,
            cancellationToken);

        if (!prescriptionFileId.HasValue)
        {
            var orderExists = await _pharmacyRepository.ProviderOrderExistsAsync(providerId, query.OrderId, cancellationToken);
            if (!orderExists)
            {
                throw new KeyNotFoundException("Provider pharmacy order was not found.");
            }

            throw new KeyNotFoundException("Provider pharmacy order does not have a prescription file.");
        }

        _logger.LogDebug(
            "Streaming prescription file {PrescriptionFileId} for pharmacy order {OrderId} owned by provider {ProviderId}",
            prescriptionFileId.Value,
            query.OrderId,
            providerId);

        return await _fileContentService.GetDomainAuthorizedContentAsync(
            prescriptionFileId.Value,
            FileUseCase.Prescription,
            query.CallerUserId,
            "provider",
            query.IpAddress,
            query.UserAgent,
            query.CorrelationId,
            cancellationToken);
    }
}
