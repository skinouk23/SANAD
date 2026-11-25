using MediatR;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Repository;

namespace SanadPlatform.API.Features.Services.Queries;

/// <summary>
/// Returns the patient-facing detail for a single service.
/// </summary>
public record GetServiceDetailQuery(Guid ServiceId) : IRequest<PatientServiceDetailResponse>;

/// <summary>
/// Handles <see cref="GetServiceDetailQuery"/> by fetching the service detail
/// from the repository. Throws <see cref="KeyNotFoundException"/> if not found.
/// </summary>
public class GetServiceDetailHandler
    : IRequestHandler<GetServiceDetailQuery, PatientServiceDetailResponse>
{
    private readonly IServiceRepository _repository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetServiceDetailHandler"/> class.
    /// </summary>
    public GetServiceDetailHandler(IServiceRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    /// <summary>
    /// Fetches patient-facing service detail. Throws 404 if not found.
    /// </summary>
    public async Task<PatientServiceDetailResponse> Handle(
        GetServiceDetailQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _repository.GetServiceDetailAsync(query.ServiceId, cancellationToken);

        if (result is null)
        {
            throw new KeyNotFoundException("Service not found.");
        }

        return result;
    }
}
