using MediatR;
using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Repository;

namespace SanadPlatform.API.Features.Patients.Queries;

/// <summary>
/// Query to get patient engagement statistics.
/// </summary>
public record GetPatientStatsQuery(Guid UserId) : IRequest<PatientStatsResponse>;

/// <summary>
/// Handler for GetPatientStatsQuery.
/// Uses the PatientRepository to fetch aggregated statistics in a single query.
/// Avoids a separate existence-check roundtrip by treating a null result as "not found".
/// </summary>
public class GetPatientStatsHandler : IRequestHandler<GetPatientStatsQuery, PatientStatsResponse>
{
    private readonly IPatientRepository _patientRepository;
    private readonly ILogger<GetPatientStatsHandler> _logger;

    public GetPatientStatsHandler(IPatientRepository patientRepository, ILogger<GetPatientStatsHandler> logger)
    {
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<PatientStatsResponse> Handle(GetPatientStatsQuery request, CancellationToken cancellationToken)
    {
        // GetStatsByUserIdAsync returns null when no patient row exists for this userId.
        // This single-roundtrip approach eliminates the TOCTOU window of a separate
        // PatientExistsByUserIdAsync check followed by GetStatsByUserIdAsync.
        var stats = await _patientRepository.GetStatsByUserIdAsync(request.UserId, cancellationToken);

        if (stats == null)
        {
            _logger.LogWarning("Stats requested for non-existent patient user ID: {UserId}", request.UserId);
            throw new KeyNotFoundException("Patient profile not found");
        }

        return stats;
    }
}
