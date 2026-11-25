using MediatR;
using AutoMapper;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Patients.Repository;

namespace SanadPlatform.API.Features.Patients.Commands;

/// <summary>
/// Command to update the authenticated patient's preferences.
/// </summary>
public record UpdatePatientPreferencesCommand(
    Guid UserId,
    bool? EmailNotifications = null,
    bool? SmsNotifications = null,
    bool? PushNotifications = null,
    bool? MarketingEmails = null,
    bool? AutoValidationEnabled = null,
    int? ValidationReminderHours = null,
    bool? ShareWithFamily = null,
    bool? AllowProviderMessages = null
) : IRequest<PatientPreferencesResponse>;

/// <summary>
/// Handler for UpdatePatientPreferencesCommand.
/// </summary>
public class UpdatePatientPreferencesHandler : IRequestHandler<UpdatePatientPreferencesCommand, PatientPreferencesResponse>
{
    private readonly IPatientRepository _patientRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<UpdatePatientPreferencesHandler> _logger;

    public UpdatePatientPreferencesHandler(
        IPatientRepository patientRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<UpdatePatientPreferencesHandler> logger)
    {
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<PatientPreferencesResponse> Handle(UpdatePatientPreferencesCommand command, CancellationToken cancellationToken)
    {
        // Single tracked read — returns null if the patient doesn't exist OR has no preferences record.
        // This eliminates a TOCTOU race between a separate PatientExistsByUserIdAsync check and the fetch,
        // and saves one DB roundtrip.
        var existingPreferences = await _patientRepository.GetPreferencesByUserIdForUpdateAsync(command.UserId, cancellationToken);

        if (existingPreferences == null)
        {
            _logger.LogWarning("Update preferences failed: Patient or preferences record not found for User ID {UserId}", command.UserId);
            throw new KeyNotFoundException($"Patient preferences not found for user ID {command.UserId}");
        }

        _mapper.Map(command, existingPreferences);

        var updatedPreferences = await _patientRepository.UpdatePreferencesAsync(existingPreferences, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Patient preferences updated. PatientId: {PatientId}, UserId: {UserId}",
            updatedPreferences.Id,
            command.UserId);

        return _mapper.Map<PatientPreferencesResponse>(updatedPreferences);
    }
}
