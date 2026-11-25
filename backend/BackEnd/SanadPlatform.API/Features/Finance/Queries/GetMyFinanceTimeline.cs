using MediatR;
using SanadPlatform.API.Features.Finance.DTOs;
using SanadPlatform.API.Features.Finance.Repository;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Finance.Queries;

/// <summary>
/// Returns the authenticated caller's finance timeline.
/// </summary>
public record GetMyFinanceTimelineQuery(
    Guid UserId,
    bool IsProvider,
    bool IsPatient,
    bool IsAdmin,
    string? Type,
    string? Status,
    DateTime? DateFrom,
    DateTime? DateTo,
    int Page,
    int Limit,
    string? Sort) : IRequest<FinanceTimelineResponse>;

/// <summary>
/// Handles <see cref="GetMyFinanceTimelineQuery"/>.
/// </summary>
public class GetMyFinanceTimelineHandler : IRequestHandler<GetMyFinanceTimelineQuery, FinanceTimelineResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IFinanceTimelineRepository _financeTimelineRepository;

    public GetMyFinanceTimelineHandler(
        IProviderRepository providerRepository,
        IPatientRepository patientRepository,
        IFinanceTimelineRepository financeTimelineRepository)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _financeTimelineRepository = financeTimelineRepository ?? throw new ArgumentNullException(nameof(financeTimelineRepository));
    }

    public async Task<FinanceTimelineResponse> Handle(
        GetMyFinanceTimelineQuery query,
        CancellationToken cancellationToken)
    {
        Guid? providerId = null;
        Guid? patientId = null;

        if (query.IsAdmin)
        {
            providerId = null;
            patientId = null;
        }
        else if (query.IsProvider)
        {
            providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.UserId, cancellationToken)
                ?? throw new KeyNotFoundException($"Provider profile not found for user {query.UserId}.");
        }
        else if (query.IsPatient)
        {
            patientId = await _patientRepository.GetPatientIdByUserIdAsync(query.UserId, cancellationToken)
                ?? throw new KeyNotFoundException($"Patient profile not found for user {query.UserId}.");
        }
        else
        {
            throw new UnauthorizedAccessException("No supported finance timeline scope is available for the authenticated user.");
        }

        var spec = new FinanceTimelineQuerySpec(
            ProviderId: providerId,
            PatientId: patientId,
            Type: query.Type,
            Status: query.Status,
            DateFrom: query.DateFrom,
            DateTo: query.DateTo,
            Page: query.Page,
            Limit: query.Limit,
            Sort: FinanceTimelineSortOptions.Parse(query.Sort)).Normalize();

        var (items, totalCount) = await _financeTimelineRepository.GetTimelineAsync(spec, cancellationToken);
        return FinanceTimelineResponseMapper.ToResponse(items, totalCount, spec.Page, spec.Limit);
    }
}
