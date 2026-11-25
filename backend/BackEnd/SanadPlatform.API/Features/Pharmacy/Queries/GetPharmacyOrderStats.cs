using MediatR;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Pharmacy.DTOs;
using SanadPlatform.API.Features.Pharmacy.Repository;

namespace SanadPlatform.API.Features.Pharmacy.Queries;

// ==================== Query ====================

/// <summary>
/// Retrieves pharmacy order statistics for the authenticated patient.
/// </summary>
public record GetPharmacyOrderStatsQuery(
    Guid CallerUserId) : IRequest<PharmacyOrderStatsResponse>;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="GetPharmacyOrderStatsQuery"/> by resolving the patient ID
/// from the caller's user ID and delegating to the repository.
/// </summary>
public class GetPharmacyOrderStatsHandler : IRequestHandler<GetPharmacyOrderStatsQuery, PharmacyOrderStatsResponse>
{
    private readonly IPharmacyOrderRepository _pharmacyRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly ILogger<GetPharmacyOrderStatsHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPharmacyOrderStatsHandler"/> class.
    /// </summary>
    public GetPharmacyOrderStatsHandler(
        IPharmacyOrderRepository pharmacyRepository,
        IPatientRepository patientRepository,
        ILogger<GetPharmacyOrderStatsHandler> logger)
    {
        _pharmacyRepository = pharmacyRepository ?? throw new ArgumentNullException(nameof(pharmacyRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Resolves the patient identity and returns pharmacy order statistics.
    /// </summary>
    public async Task<PharmacyOrderStatsResponse> Handle(
        GetPharmacyOrderStatsQuery query,
        CancellationToken cancellationToken)
    {
        var patientId = await _patientRepository.GetPatientIdByUserIdAsync(query.CallerUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Patient profile not found for the authenticated user.");

        _logger.LogDebug(
            "Fetching pharmacy order stats for patient {PatientId} (user {UserId})",
            patientId, query.CallerUserId);

        return await _pharmacyRepository.GetPatientOrderStatsAsync(patientId, cancellationToken);
    }
}
