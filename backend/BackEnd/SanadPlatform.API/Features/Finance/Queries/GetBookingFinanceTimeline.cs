using MediatR;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Finance.DTOs;
using SanadPlatform.API.Features.Finance.Repository;

namespace SanadPlatform.API.Features.Finance.Queries;

/// <summary>
/// Returns the finance timeline for a booking.
/// </summary>
public record GetBookingFinanceTimelineQuery(
    Guid BookingId,
    Guid UserId,
    bool IsAdmin,
    string? Type,
    string? Status,
    DateTime? DateFrom,
    DateTime? DateTo,
    int Page,
    int Limit,
    string? Sort) : IRequest<FinanceTimelineResponse>;

/// <summary>
/// Handles <see cref="GetBookingFinanceTimelineQuery"/>.
/// </summary>
public class GetBookingFinanceTimelineHandler : IRequestHandler<GetBookingFinanceTimelineQuery, FinanceTimelineResponse>
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IFinanceTimelineRepository _financeTimelineRepository;

    public GetBookingFinanceTimelineHandler(
        IBookingRepository bookingRepository,
        IFinanceTimelineRepository financeTimelineRepository)
    {
        _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
        _financeTimelineRepository = financeTimelineRepository ?? throw new ArgumentNullException(nameof(financeTimelineRepository));
    }

    public async Task<FinanceTimelineResponse> Handle(
        GetBookingFinanceTimelineQuery query,
        CancellationToken cancellationToken)
    {
        var ownership = await _bookingRepository.GetBookingOwnershipAsync(query.BookingId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking {query.BookingId} was not found.");

        if (!query.IsAdmin
            && ownership.PatientUserId != query.UserId
            && ownership.ProviderUserId != query.UserId)
        {
            throw new UnauthorizedAccessException("You do not have permission to view this booking finance timeline.");
        }

        var spec = new FinanceTimelineQuerySpec(
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
