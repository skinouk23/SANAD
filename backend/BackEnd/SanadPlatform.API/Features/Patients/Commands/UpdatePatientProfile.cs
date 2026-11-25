using MediatR;
using AutoMapper;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Patients.Commands;

/// <summary>
/// Command to update the authenticated patient's profile.
/// </summary>
public record UpdatePatientProfileCommand(
    Guid UserId,
    string? FirstName = null,
    string? LastName = null,
    DateOnly? DateOfBirth = null,
    string? Gender = null,
    string? Address = null,
    string? City = null,
    string? PostalCode = null,
    decimal? Latitude = null,
    decimal? Longitude = null,
    string? EmergencyContactName = null,
    string? EmergencyContactPhone = null,
    string? EmergencyContactRelationship = null,
    string? MedicalHistory = null,
    string? Allergies = null,
    string? CurrentMedications = null,
    string? InsuranceProvider = null,
    string? InsuranceNumber = null
) : IRequest<MyPatientProfileResponse>, ISensitiveRequest;

/// <summary>
/// Handler for UpdatePatientProfileCommand.
/// </summary>
public class UpdatePatientProfileHandler : IRequestHandler<UpdatePatientProfileCommand, MyPatientProfileResponse>
{
    private readonly IPatientRepository _patientRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<UpdatePatientProfileHandler> _logger;

    public UpdatePatientProfileHandler(
        IPatientRepository patientRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<UpdatePatientProfileHandler> logger)
    {
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<MyPatientProfileResponse> Handle(UpdatePatientProfileCommand command, CancellationToken cancellationToken)
    {
        // 1. Get the tracked entity
        var patient = await _patientRepository.GetByUserIdForUpdateAsync(command.UserId, cancellationToken);
        
        if (patient == null)
        {
            _logger.LogWarning("Profile update failed: Patient not found for User ID {UserId}", command.UserId);
            throw new KeyNotFoundException($"Patient profile not found for user ID {command.UserId}");
        }

        // 2. Map updates (Condition in Profile handles nulls)
        _mapper.Map(command, patient);
        
        // 3. Stage and save
        await _patientRepository.UpdateAsync(patient, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Patient profile updated for User ID {UserId}", command.UserId);

        // 4. Return the full updated profile
        return _mapper.Map<MyPatientProfileResponse>(patient);
    }
}
