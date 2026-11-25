namespace SanadPlatform.API.Features.Equipment.Services;

/// <summary>
/// Pure-static utility for multi-rate equipment rental price calculations.
/// Shared by the POST booking creation handler and the GET booking response mapper.
/// No dependencies — fully unit-testable in isolation.
/// </summary>
public static class RentalPricingCalculator
{
    // ==================== Period Count ====================

    /// <summary>
    /// Calculates how many billing periods fall between <paramref name="start"/> and
    /// <paramref name="end"/> for the given <paramref name="tier"/>.
    /// <para>Rules:</para>
    /// <list type="bullet">
    ///   <item>daily  — whole days elapsed, minimum 1</item>
    ///   <item>weekly — ceiling of (days / 7), minimum 1</item>
    ///   <item>monthly — calendar months; a partial month rounds up</item>
    /// </list>
    /// </summary>
    /// <param name="start">Rental start date (inclusive, equals <c>bookingDate</c>).</param>
    /// <param name="end">Planned return date (inclusive).</param>
    /// <param name="tier">Billing tier: <c>daily</c>, <c>weekly</c>, or <c>monthly</c>.</param>
    /// <returns>The number of billable periods.</returns>
    /// <exception cref="ArgumentException">Thrown when <paramref name="tier"/> is not a recognised value.</exception>
    public static int CalculatePeriodCount(DateOnly start, DateOnly end, string tier)
    {
        int days = end.DayNumber - start.DayNumber;

        return tier.ToLowerInvariant() switch
        {
            "daily" => Math.Max(days, 1),
            "weekly" => (int)Math.Ceiling(days / 7.0),
            "monthly" => CalculateCalendarMonths(start, end),
            _ => throw new ArgumentException($"Invalid rental tier '{tier}'. Must be daily, weekly, or monthly.", nameof(tier))
        };
    }

    // ==================== Deposit Status ====================

    /// <summary>
    /// Derives the <c>depositStatus</c> string for API responses from the raw DB boolean flags.
    /// <list type="bullet">
    ///   <item><c>deposit_paid = false</c> → <c>"pending"</c></item>
    ///   <item><c>deposit_paid = true</c> AND <c>deposit_returned = false</c> → <c>"held"</c></item>
    ///   <item><c>deposit_returned = true</c> → <c>"released"</c></item>
    /// </list>
    /// </summary>
    public static string DeriveDepositStatus(bool depositPaid, bool depositReturned)
    {
        if (depositReturned) return "released";
        if (depositPaid) return "held";
        return "pending";
    }

    // ==================== Private Helpers ====================

    /// <summary>
    /// Counts calendar months between <paramref name="start"/> and <paramref name="end"/>,
    /// adding one extra month when the end day is strictly greater than the start day
    /// (partial month rounds up). Minimum result is 1.
    /// </summary>
    private static int CalculateCalendarMonths(DateOnly start, DateOnly end)
    {
        int months = ((end.Year - start.Year) * 12) + (end.Month - start.Month);

        // Partial month: if end day is past the start day within the final month, round up.
        // Example: Jan 15 → Mar 20 = 2 base months + partial 5 days = 3 billable months.
        if (end.Day > start.Day)
            months++;

        return Math.Max(months, 1);
    }
}
