using MediatR;
using SanadPlatform.API.Features.Patients.Repository;

namespace SanadPlatform.API.Features.Patients.Commands;

/// <summary>
/// Command to delete a family member from the authenticated patient's circle.
/// </summary>
public record DeleteFamilyMemberCommand(Guid UserId, Guid MemberId) : IRequest<bool>;

/// <summary>
/// Handler for DeleteFamilyMemberCommand.
/// </summary>
public class DeleteFamilyMemberHandler : IRequestHandler<DeleteFamilyMemberCommand, bool>
{
    private readonly IPatientRepository _patientRepository;
    private readonly ILogger<DeleteFamilyMemberHandler> _logger;

    public DeleteFamilyMemberHandler(IPatientRepository patientRepository, ILogger<DeleteFamilyMemberHandler> logger)
    {
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<bool> Handle(DeleteFamilyMemberCommand command, CancellationToken cancellationToken)
    {
        // DeleteFamilyMemberAsync filters by f.Patient.UserId == userId internally via ExecuteDeleteAsync.
        // If the patient doesn't exist or the member doesn't belong to them, rowsAffected will be 0.
        // No separate PatientExistsByUserIdAsync check needed — eliminates TOCTOU and saves one DB roundtrip.
        var deleted = await _patientRepository.DeleteFamilyMemberAsync(command.UserId, command.MemberId, cancellationToken);

        if (!deleted)
        {
            _logger.LogWarning("Delete family member failed: member {MemberId} not found for User {UserId}", command.MemberId, command.UserId);
            // Security: use KeyNotFoundException even for ownership mismatches to avoid leaking resource existence.
            throw new KeyNotFoundException("Family member not found in your circle.");
        }

        return true;
    }
}
