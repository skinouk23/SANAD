using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Pharmacy.DTOs;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Pharmacy.Repository;

/// <summary>
/// Repository implementation for pharmacy order operations.
/// Status is derived from the parent <see cref="BookingStatus"/> — the
/// <c>PharmacyOrder</c> entity does not carry its own status column.
/// </summary>
public class PharmacyOrderRepository : IPharmacyOrderRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<PharmacyOrderRepository> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="PharmacyOrderRepository"/> class.
    /// </summary>
    public PharmacyOrderRepository(SanadDbContext context, ILogger<PharmacyOrderRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<PharmacyOrderResponse>> GetPatientOrdersAsync(
        Guid patientId,
        string? filter,
        CancellationToken ct)
    {
        var query = _context.PharmacyOrders
            .AsNoTracking()
            .Include(po => po.Booking)
                .ThenInclude(b => b.Provider)
            .Where(po => po.Booking.PatientId == patientId);

        // Apply filter based on parent Booking.Status
        if (!string.IsNullOrWhiteSpace(filter))
        {
            query = filter.ToLowerInvariant() switch
            {
                "active" => query.Where(po =>
                    po.Booking.Status == BookingStatus.Pending ||
                    po.Booking.Status == BookingStatus.Confirmed ||
                    po.Booking.Status == BookingStatus.ProviderOnWay ||
                    po.Booking.Status == BookingStatus.InProgress),
                "completed" => query.Where(po =>
                    po.Booking.Status == BookingStatus.Completed ||
                    po.Booking.Status == BookingStatus.Validated),
                _ => query
            };
        }

        // Project to anonymous type first (server-side), then map status client-side
        var rows = await query
            .OrderByDescending(po => po.OrderDate)
            .Select(po => new
            {
                po.Id,
                PharmacyName = po.Booking.Provider.BusinessName ??
                    ((po.Booking.Provider.FirstName ?? "") + " " + (po.Booking.Provider.LastName ?? "")).Trim(),
                po.OrderDate,
                BookingStatus = po.Booking.Status,
                po.Amount,
                po.Items,
                po.PrescriptionFileId,
            })
            .ToListAsync(ct);

        var results = rows.Select(r => new PharmacyOrderResponse
        {
            Id = r.Id.ToString(),
            PharmacyName = r.PharmacyName,
            Date = r.OrderDate.ToString("O"),
            Status = MapBookingStatusToPharmacyStatus(r.BookingStatus),
            Amount = r.Amount.HasValue ? r.Amount.Value.ToString("F2") : null,
            Items = r.Items,
            PrescriptionFileId = r.PrescriptionFileId,
        }).ToList();

        _logger.LogDebug(
            "GetPatientOrders: {Count} orders for patient {PatientId} with filter {Filter}",
            results.Count, patientId, filter ?? "all");

        return results;
    }

    /// <inheritdoc />
    public async Task<PharmacyOrderStatsResponse> GetPatientOrderStatsAsync(
        Guid patientId,
        CancellationToken ct)
    {
        var orders = _context.PharmacyOrders
            .AsNoTracking()
            .Where(po => po.Booking.PatientId == patientId);

        var activeCount = await orders.CountAsync(po =>
            po.Booking.Status == BookingStatus.Pending ||
            po.Booking.Status == BookingStatus.Confirmed ||
            po.Booking.Status == BookingStatus.ProviderOnWay ||
            po.Booking.Status == BookingStatus.InProgress, ct);

        var completedCount = await orders.CountAsync(po =>
            po.Booking.Status == BookingStatus.Completed ||
            po.Booking.Status == BookingStatus.Validated, ct);

        var totalSpent = await orders
            .Where(po =>
                (po.Booking.Status == BookingStatus.Completed ||
                 po.Booking.Status == BookingStatus.Validated) &&
                po.Amount.HasValue)
            .SumAsync(po => po.Amount!.Value, ct);

        _logger.LogDebug(
            "GetPatientOrderStats: active={ActiveCount}, completed={CompletedCount}, spent={TotalSpent} for patient {PatientId}",
            activeCount, completedCount, totalSpent, patientId);

        return new PharmacyOrderStatsResponse
        {
            ActiveCount = activeCount,
            CompletedCount = completedCount,
            TotalSpent = totalSpent.ToString("F2"),
        };
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<ProviderPharmacyOrderResponse>> GetProviderOrdersAsync(
        Guid providerId,
        CancellationToken ct)
    {
        // Project to anonymous type first (server-side), then map status client-side
        var rows = await _context.PharmacyOrders
            .AsNoTracking()
            .Include(po => po.Booking)
            .Where(po => po.Booking.ProviderId == providerId)
            .OrderByDescending(po => po.OrderDate)
            .Select(po => new
            {
                po.Id,
                po.Booking.PatientName,
                po.OrderDate,
                BookingStatus = po.Booking.Status,
                po.Items,
                po.PrescriptionFileId,
                po.DeliveryAddress,
                po.PatientPhone,
                po.Amount,
            })
            .ToListAsync(ct);

        var results = rows.Select(r => new ProviderPharmacyOrderResponse
        {
            Id = r.Id.ToString(),
            PatientName = r.PatientName,
            Date = r.OrderDate.ToString("O"),
            Status = MapBookingStatusToPharmacyStatus(r.BookingStatus),
            Items = r.Items,
            PrescriptionFileId = r.PrescriptionFileId,
            Address = r.DeliveryAddress ?? string.Empty,
            Phone = r.PatientPhone ?? string.Empty,
            Amount = r.Amount.HasValue ? r.Amount.Value.ToString("F2") : null,
        }).ToList();

        _logger.LogDebug(
            "GetProviderOrders: {Count} orders for provider {ProviderId}",
            results.Count, providerId);

        return results;
    }

    /// <inheritdoc />
    public async Task<Guid?> GetProviderOrderPrescriptionFileIdAsync(
        Guid providerId,
        Guid orderId,
        CancellationToken ct)
    {
        return await _context.PharmacyOrders
            .AsNoTracking()
            .Where(po => po.Id == orderId && po.Booking.ProviderId == providerId)
            .Select(po => po.PrescriptionFileId)
            .FirstOrDefaultAsync(ct);
    }

    /// <inheritdoc />
    public async Task<bool> ProviderOrderExistsAsync(
        Guid providerId,
        Guid orderId,
        CancellationToken ct)
    {
        return await _context.PharmacyOrders
            .AsNoTracking()
            .AnyAsync(po => po.Id == orderId && po.Booking.ProviderId == providerId, ct);
    }

    // ==================== Private Helpers ====================

    /// <summary>
    /// Maps the parent <see cref="BookingStatus"/> to the pharmacy-specific
    /// status string expected by the frontend (<c>pending</c>, <c>processing</c>,
    /// <c>delivery</c>, <c>completed</c>).
    /// </summary>
    private static string MapBookingStatusToPharmacyStatus(BookingStatus status)
    {
        return status switch
        {
            BookingStatus.Pending => "pending",
            BookingStatus.Confirmed => "processing",
            BookingStatus.ProviderOnWay => "delivery",
            BookingStatus.InProgress => "delivery",
            BookingStatus.Completed => "completed",
            BookingStatus.Validated => "completed",
            BookingStatus.Cancelled => "cancelled",
            BookingStatus.NoShow => "cancelled",
            BookingStatus.Disputed => "pending",
            _ => "pending",
        };
    }
}
