using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Common.Utilities;
using SanadPlatform.API.Common.Enums;

namespace SanadPlatform.API.Features.Bookings.Repository;

/// <summary>
/// Specification for listing bookings with advanced filtering.
/// Supports filtering by status, date range, patient, provider, service, and search.
/// Supports pagination and sorting.
/// Designed for use with <c>ProjectTo&lt;T&gt;()</c> — AutoMapper generates its own SQL
/// JOINs from the mapping profile, so no eager-load includes are configured.
/// </summary>
public class GetBookingsSpecification : BaseSpecification<Booking>
{
    public GetBookingsSpecification(
        int page,
        int limit,
        string? status = null,
        DateOnly? startDateFrom = null,
        DateOnly? startDateTo = null,
        Guid? patientId = null,
        Guid? providerId = null,
        Guid? serviceId = null,
        string? serviceCategory = null,
        string? searchQuery = null,
        string sortBy = "startDate",
        bool sortDesc = false)
    {
        // ==================== Build Filter Criteria ====================
        var criteria = PredicateBuilder.True<Booking>();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<BookingStatus>(status, true, out var statusEnum))
        {
            criteria = criteria.And(b => b.Status == statusEnum);
        }

        if (startDateFrom.HasValue)
        {
            criteria = criteria.And(b => b.StartDate >= startDateFrom.Value);
        }

        if (startDateTo.HasValue)
        {
            criteria = criteria.And(b => b.StartDate <= startDateTo.Value);
        }

        if (patientId.HasValue)
        {
            criteria = criteria.And(b => b.PatientId == patientId.Value);
        }

        if (providerId.HasValue)
        {
            criteria = criteria.And(b => b.ProviderId == providerId.Value);
        }

        if (serviceId.HasValue)
        {
            criteria = criteria.And(b => b.ServiceId == serviceId.Value
                || b.LineItems.Any(lineItem => lineItem.ServiceId == serviceId.Value));
        }

        if (!string.IsNullOrWhiteSpace(serviceCategory))
        {
            criteria = criteria.And(b => b.Service != null && b.Service.Category == serviceCategory);
        }

        if (!string.IsNullOrWhiteSpace(searchQuery))
        {
            var escaped = searchQuery.Trim()
                .Replace(@"\", @"\\")
                .Replace("%", @"\%")
                .Replace("_", @"\_");
            var pattern = $"%{escaped}%";
            criteria = criteria.And(b =>
                EF.Functions.ILike(b.BookingNumber, pattern, @"\\") ||
                EF.Functions.ILike(b.PatientName, pattern, @"\\") ||
                (b.Provider != null && (
                    EF.Functions.ILike(b.Provider.FirstName!, pattern, @"\\") ||
                    EF.Functions.ILike(b.Provider.LastName!, pattern, @"\\"))) ||
                (b.Service != null && EF.Functions.ILike(b.Service.Name, pattern, @"\\")) ||
                b.LineItems.Any(lineItem => EF.Functions.ILike(lineItem.ServiceName, pattern, @"\\")));
        }

        Criteria = criteria;

        // ==================== Apply Sorting ====================
        var sortByLower = sortBy?.ToLowerInvariant() ?? "startdate";

        switch (sortByLower)
        {
            case "bookingnumber":
                if (sortDesc)
                    AddOrderByDescending(b => b.BookingNumber);
                else
                    AddOrderBy(b => b.BookingNumber);
                break;

            case "status":
                if (sortDesc)
                    AddOrderByDescending(b => b.Status);
                else
                    AddOrderBy(b => b.Status);
                break;

            case "createdat":
                if (sortDesc)
                    AddOrderByDescending(b => b.CreatedAt);
                else
                    AddOrderBy(b => b.CreatedAt);
                break;

            case "startdate":
            default:
                if (sortDesc)
                    AddOrderByDescending(b => b.StartDate);
                else
                    AddOrderBy(b => b.StartDate);
                break;
        }

        // ==================== Apply Pagination ====================
        var skip = (page - 1) * limit;
        ApplyPaging(skip, limit);
    }
}
