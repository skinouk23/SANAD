using MediatR;
using SanadPlatform.API.Features.Patients.Repository;

namespace SanadPlatform.API.Features.Patients.Commands;

/// <summary>
/// Command to remove a provider from a patient's favorites.
/// </summary>
public record DeleteProviderFromFavoritesCommand(Guid UserId, Guid ProviderId) : IRequest<bool>;

/// <summary>
/// Handler for RemoveProviderFromFavoritesCommand.
/// </summary>
public class DeleteProviderFromFavoritesHandler : IRequestHandler<DeleteProviderFromFavoritesCommand, bool>
{
    private readonly IPatientRepository _patientRepository;
    private readonly ILogger<DeleteProviderFromFavoritesHandler> _logger;

    public DeleteProviderFromFavoritesHandler(
        IPatientRepository patientRepository,
        ILogger<DeleteProviderFromFavoritesHandler> logger)
    {
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<bool> Handle(DeleteProviderFromFavoritesCommand command, CancellationToken cancellationToken)
    {
        // DeleteFavoriteAsync filters by f.Patient.UserId == userId internally via ExecuteDeleteAsync.
        // If the patient doesn't exist or the favorite doesn't belong to them, rowsAffected will be 0.
        // No separate PatientExistsByUserIdAsync check needed — eliminates TOCTOU and saves one DB roundtrip.
        var deleted = await _patientRepository.DeleteFavoriteAsync(command.UserId, command.ProviderId, cancellationToken);

        if (!deleted)
        {
            _logger.LogWarning("Delete favorite failed: Provider {ProviderId} not found in favorites for User {UserId}",
                command.ProviderId, command.UserId);
            throw new KeyNotFoundException("Provider not found in favorites");
        }

        return true;
    }
}
