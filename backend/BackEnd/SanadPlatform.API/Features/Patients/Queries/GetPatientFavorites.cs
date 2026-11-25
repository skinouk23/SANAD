using MediatR;
using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Repository;

namespace SanadPlatform.API.Features.Patients.Queries;

/// <summary>
/// Query to get the authenticated patient's favorite providers.
/// </summary>
public record GetPatientFavoritesQuery(Guid UserId) : IRequest<IReadOnlyList<PatientFavoriteResponse>>;

/// <summary>
/// Handler for GetPatientFavoritesQuery.
/// Checks patient existence first via <see cref="IPatientRepository.ExistsByUserIdAsync"/>
/// to distinguish "patient not found" (404) from "patient has no favorites" (empty list).
/// </summary>
public class GetPatientFavoritesHandler : IRequestHandler<GetPatientFavoritesQuery, IReadOnlyList<PatientFavoriteResponse>>
{
    private readonly IPatientRepository _patientRepository;
    private readonly ILogger<GetPatientFavoritesHandler> _logger;

    public GetPatientFavoritesHandler(IPatientRepository patientRepository, ILogger<GetPatientFavoritesHandler> logger)
    {
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IReadOnlyList<PatientFavoriteResponse>> Handle(GetPatientFavoritesQuery request, CancellationToken cancellationToken)
    {
        var exists = await _patientRepository.ExistsByUserIdAsync(request.UserId, cancellationToken);
        if (!exists)
        {
            _logger.LogWarning("Favorites requested for non-existent patient user ID: {UserId}", request.UserId);
            throw new KeyNotFoundException("Patient profile not found");
        }

        return await _patientRepository.GetFavoritesByUserIdAsync(request.UserId, cancellationToken);
    }
}
