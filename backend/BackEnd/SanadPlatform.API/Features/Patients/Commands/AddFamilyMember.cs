using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Patients.Repository;

namespace SanadPlatform.API.Features.Patients.Commands;

/// <summary>
/// Command to add a family member to the authenticated patient's circle.
/// </summary>
public record AddFamilyMemberCommand(
    Guid UserId,
    string FirstName,
    string LastName,
    string Relationship,
    DateOnly? DateOfBirth,
    string? Gender,
    string? Email,
    string? MedicalHistory,
    string? Allergies,
    string? CurrentMedications) : IRequest<FamilyMemberResponse>;


/// <summary>
/// Handler for AddFamilyMemberCommand.
/// </summary>
public class AddFamilyMemberHandler : IRequestHandler<AddFamilyMemberCommand, FamilyMemberResponse>
{
    private readonly IPatientRepository _patientRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<AddFamilyMemberHandler> _logger;

    public AddFamilyMemberHandler(IPatientRepository patientRepository, IUnitOfWork unitOfWork, IMapper mapper, ILogger<AddFamilyMemberHandler> logger)
    {
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<FamilyMemberResponse> Handle(AddFamilyMemberCommand command, CancellationToken cancellationToken)
    {
        var patient = await _patientRepository.GetByUserIdAsync(command.UserId, cancellationToken);
        if (patient == null)
        {
            throw new KeyNotFoundException("Patient profile not found. Please create a profile first.");
        }

        var member = _mapper.Map<FamilyMember>(command);
        member.PatientId = patient.Id;
        member.Email = NormalizeOptional(command.Email);

        try
        {
            var createdMember = await _patientRepository.CreateFamilyMemberAsync(member, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<FamilyMemberResponse>(createdMember);
        }
        catch (DbUpdateException ex) when (ex.InnerException is Npgsql.PostgresException pgEx)
        {
            switch (pgEx.SqlState)
            {
                case Npgsql.PostgresErrorCodes.ForeignKeyViolation:
                    _logger.LogWarning("Patient {PatientId} not found when adding family member", patient.Id);
                    throw new KeyNotFoundException("Patient profile not found");

                case Npgsql.PostgresErrorCodes.UniqueViolation:
                    _logger.LogInformation("Family member {FirstName} {LastName} already in family circle for patient {PatientId}",
                        command.FirstName, command.LastName, patient.Id);
                    throw new InvalidOperationException("Family member is already in your family circle");

                default:
                    throw; // Re-throw unexpected DB errors
            }
        }
    }

    private static string? NormalizeOptional(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
