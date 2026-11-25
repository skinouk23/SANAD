using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Common.Utilities;
using SanadPlatform.API.Features.Bookings.Entities;

namespace SanadPlatform.API.Features.Bookings.Specifications;

/// <summary>
/// Shared provider-scoped booking selection logic for dashboard and self-service endpoints.
/// </summary>
public class ProviderScopedBookingSelectionSpecification : BaseSpecification<Booking>
{
    public ProviderScopedBookingSelectionSpecification(
        Guid providerId,
        DateOnly overlapStartDate,
        DateOnly overlapEndDate,
        IReadOnlyCollection<BookingStatus> statuses,
        bool orderByDailyStartTimeAscending = false,
        bool orderByStartDateAscending = false)
    {
        var criteria = PredicateBuilder.True<Booking>()
            .And(b => b.ProviderId == providerId)
            .And(b => b.StartDate <= overlapEndDate)
            .And(b => b.EndDate >= overlapStartDate);

        if (statuses.Count > 0)
        {
            criteria = criteria.And(b => statuses.Contains(b.Status));
        }

        Criteria = criteria;

        if (orderByStartDateAscending)
        {
            AddOrderBy(b => b.StartDate);
        }
        else if (orderByDailyStartTimeAscending)
        {
            AddOrderBy(b => b.DailyStartTime);
        }
    }
}
