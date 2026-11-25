using MediatR;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Repository;

namespace SanadPlatform.API.Features.Patients.Queries;

/// <summary>
/// Query to get the authenticated patient's family circle members.
/// </summary>
public record GetFamilyCircleQuery(Guid UserId) : IRequest<IReadOnlyList<FamilyMemberResponse>>;

/// <summary>
/// Handler for GetFamilyCircleQuery.
/// Checks patient existence first via <see cref="IPatientRepository.ExistsByUserIdAsync"/>
/// to distinguish "patient not found" (404) from "patient has no members" (empty list).
/// </summary>
public class GetFamilyCircleHandler : IRequestHandler<GetFamilyCircleQuery, IReadOnlyList<FamilyMemberResponse>>
{
    private readonly IPatientRepository _patientRepository;
    private readonly ILogger<GetFamilyCircleHandler> _logger;

    public GetFamilyCircleHandler(IPatientRepository patientRepository, ILogger<GetFamilyCircleHandler> logger)
    {
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IReadOnlyList<FamilyMemberResponse>> Handle(GetFamilyCircleQuery request, CancellationToken cancellationToken)
    {
        var exists = await _patientRepository.ExistsByUserIdAsync(request.UserId, cancellationToken);
        if (!exists)
        {
            _logger.LogWarning("Family circle requested for non-existent patient user ID: {UserId}", request.UserId);
            throw new KeyNotFoundException("Patient profile not found");
        }

        return await _patientRepository.GetFamilyMembersByUserIdAsync(request.UserId, cancellationToken);
    }
}
