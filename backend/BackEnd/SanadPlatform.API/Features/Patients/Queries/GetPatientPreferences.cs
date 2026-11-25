using MediatR;
using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Repository;

namespace SanadPlatform.API.Features.Patients.Queries;

/// <summary>
/// Query to retrieve a patient's notification and privacy preferences.
/// </summary>
public record GetPatientPreferencesQuery(Guid UserId) : IRequest<PatientPreferencesResponse>;

/// <summary>
/// Handler for GetPatientPreferencesQuery.
/// Avoids a separate existence-check roundtrip: a null result from
/// <see cref="IPatientRepository.GetPreferencesByUserIdAsync"/> means "not found".
/// </summary>
public class GetPatientPreferencesHandler : IRequestHandler<GetPatientPreferencesQuery, PatientPreferencesResponse>
{
    private readonly IPatientRepository _patientRepository;
    private readonly ILogger<GetPatientPreferencesHandler> _logger;

    public GetPatientPreferencesHandler(
        IPatientRepository patientRepository,
        ILogger<GetPatientPreferencesHandler> logger)
    {
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<PatientPreferencesResponse> Handle(GetPatientPreferencesQuery request, CancellationToken cancellationToken)
    {
        // GetPreferencesByUserIdAsync returns null when no preferences record exists
        // (which covers both "patient not found" and "patient has no preferences row").
        // A single roundtrip avoids the TOCTOU window of a separate existence check.
        var preferences = await _patientRepository.GetPreferencesByUserIdAsync(request.UserId, cancellationToken);

        if (preferences == null)
        {
            _logger.LogWarning("Preferences not found for patient user ID: {UserId}", request.UserId);
            throw new KeyNotFoundException("Patient preferences not found");
        }

        return preferences;
    }
}
