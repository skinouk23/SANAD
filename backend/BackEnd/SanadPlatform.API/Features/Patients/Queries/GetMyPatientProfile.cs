using MediatR;
using AutoMapper;
using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Repository;

namespace SanadPlatform.API.Features.Patients.Queries;

/// <summary>
/// Query to retrieve the full profile of the authenticated patient.
/// </summary>
public record GetMyPatientProfileQuery(Guid UserId) : IRequest<MyPatientProfileResponse>;

/// <summary>
/// Handler for GetMyPatientProfileQuery.
/// </summary>
public class GetMyPatientProfileHandler : IRequestHandler<GetMyPatientProfileQuery, MyPatientProfileResponse>
{
    private readonly IPatientRepository _patientRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetMyPatientProfileHandler> _logger;

    public GetMyPatientProfileHandler(
        IPatientRepository patientRepository,
        IMapper mapper,
        ILogger<GetMyPatientProfileHandler> logger)
    {
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<MyPatientProfileResponse> Handle(GetMyPatientProfileQuery request, CancellationToken cancellationToken)
    {
        var patient = await _patientRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        
        if (patient == null)
        {
            _logger.LogWarning("Profile request failed: Patient not found for User ID {UserId}", request.UserId);
            throw new KeyNotFoundException("Patient profile not found");
        }

        return _mapper.Map<MyPatientProfileResponse>(patient);
    }
}
