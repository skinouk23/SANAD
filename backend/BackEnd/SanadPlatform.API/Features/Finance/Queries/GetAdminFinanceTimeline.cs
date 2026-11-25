using MediatR;
using SanadPlatform.API.Features.Finance.DTOs;
using SanadPlatform.API.Features.Finance.Repository;

namespace SanadPlatform.API.Features.Finance.Queries;

/// <summary>
/// Returns the admin finance timeline view.
/// </summary>
public record GetAdminFinanceTimelineQuery(
    Guid? ProviderId,
    Guid? BookingId,
    string? Type,
    string? Status,
    DateTime? DateFrom,
    DateTime? DateTo,
    int Page,
    int Limit,
    string? Sort) : IRequest<FinanceTimelineResponse>;

/// <summary>
/// Handles <see cref="GetAdminFinanceTimelineQuery"/>.
/// </summary>
public class GetAdminFinanceTimelineHandler : IRequestHandler<GetAdminFinanceTimelineQuery, FinanceTimelineResponse>
{
    private readonly IFinanceTimelineRepository _financeTimelineRepository;

    public GetAdminFinanceTimelineHandler(IFinanceTimelineRepository financeTimelineRepository)
    {
        _financeTimelineRepository = financeTimelineRepository ?? throw new ArgumentNullException(nameof(financeTimelineRepository));
    }

    public async Task<FinanceTimelineResponse> Handle(
        GetAdminFinanceTimelineQuery query,
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
