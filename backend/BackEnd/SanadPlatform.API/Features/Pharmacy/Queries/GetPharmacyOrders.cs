using MediatR;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Pharmacy.DTOs;
using SanadPlatform.API.Features.Pharmacy.Repository;

namespace SanadPlatform.API.Features.Pharmacy.Queries;

// ==================== Query ====================

/// <summary>
/// Retrieves pharmacy orders for the authenticated patient, optionally filtered.
/// </summary>
public record GetPharmacyOrdersQuery(
    Guid CallerUserId,
    string? Filter) : IRequest<IReadOnlyList<PharmacyOrderResponse>>;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="GetPharmacyOrdersQuery"/> by resolving the patient ID
/// from the caller's user ID and delegating to the repository.
/// </summary>
public class GetPharmacyOrdersHandler : IRequestHandler<GetPharmacyOrdersQuery, IReadOnlyList<PharmacyOrderResponse>>
{
    private readonly IPharmacyOrderRepository _pharmacyRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly ILogger<GetPharmacyOrdersHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPharmacyOrdersHandler"/> class.
    /// </summary>
    public GetPharmacyOrdersHandler(
        IPharmacyOrderRepository pharmacyRepository,
        IPatientRepository patientRepository,
        ILogger<GetPharmacyOrdersHandler> logger)
    {
        _pharmacyRepository = pharmacyRepository ?? throw new ArgumentNullException(nameof(pharmacyRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Resolves the patient identity and returns filtered pharmacy orders.
    /// </summary>
    public async Task<IReadOnlyList<PharmacyOrderResponse>> Handle(
        GetPharmacyOrdersQuery query,
        CancellationToken cancellationToken)
    {
        var patientId = await _patientRepository.GetPatientIdByUserIdAsync(query.CallerUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Patient profile not found for the authenticated user.");

        _logger.LogDebug(
            "Fetching pharmacy orders for patient {PatientId} (user {UserId}), filter={Filter}",
            patientId, query.CallerUserId, query.Filter);

        return await _pharmacyRepository.GetPatientOrdersAsync(patientId, query.Filter, cancellationToken);
    }
}
