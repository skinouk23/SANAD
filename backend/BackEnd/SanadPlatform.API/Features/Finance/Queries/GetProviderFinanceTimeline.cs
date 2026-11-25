using MediatR;
using SanadPlatform.API.Features.Finance.DTOs;
using SanadPlatform.API.Features.Finance.Repository;

namespace SanadPlatform.API.Features.Finance.Queries;

/// <summary>
/// Returns the finance timeline for a provider.
/// </summary>
public record GetProviderFinanceTimelineQuery(
    Guid ProviderId,
    Guid? BookingId,
    string? Type,
    string? Status,
    DateTime? DateFrom,
    DateTime? DateTo,
    int Page,
    int Limit,
    string? Sort) : IRequest<FinanceTimelineResponse>;

/// <summary>
/// Handles <see cref="GetProviderFinanceTimelineQuery"/>.
/// </summary>
public class GetProviderFinanceTimelineHandler : IRequestHandler<GetProviderFinanceTimelineQuery, FinanceTimelineResponse>
{
    private readonly IFinanceTimelineRepository _financeTimelineRepository;

    public GetProviderFinanceTimelineHandler(IFinanceTimelineRepository financeTimelineRepository)
    {
        _financeTimelineRepository = financeTimelineRepository ?? throw new ArgumentNullException(nameof(financeTimelineRepository));
    }

    public async Task<FinanceTimelineResponse> Handle(
        GetProviderFinanceTimelineQuery query,
        CancellationToken cancellationToken)
    {
        var spec = new FinanceTimelineQuerySpec(
            ProviderId: query.ProviderId,
            BookingId: query.BookingId,
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
