using SanadPlatform.API.Features.ProviderFinance;

namespace SanadPlatform.API.Features.Providers.DTOs;

/// <summary>
/// Provider-scoped analytics response for the authenticated provider.
/// </summary>
public record ProviderAnalyticsResponse
{
    public ProviderAnalyticsOverview Overview { get; init; } = new();

    public IReadOnlyList<ProviderAnalyticsRevenueSeriesPoint> RevenueSeries { get; init; } =
        Array.Empty<ProviderAnalyticsRevenueSeriesPoint>();

    public IReadOnlyList<ProviderAnalyticsTopZone> TopZones { get; init; } =
        Array.Empty<ProviderAnalyticsTopZone>();

    public ProviderAnalyticsAppointmentsByStatus AppointmentsByStatus { get; init; } = new();

    public ProviderAnalyticsWalletSummary WalletSummary { get; init; } = new();

    public ProviderAnalyticsWalletActivity WalletActivity { get; init; } = new();
}

/// <summary>
/// Overview cards shown on the provider analytics page.
/// </summary>
public record ProviderAnalyticsOverview
{
    public decimal Revenue { get; init; }

    public int Appointments { get; init; }

    public int UniquePatients { get; init; }

    public decimal AverageRating { get; init; }

    public int ReviewCount { get; init; }
}

/// <summary>
/// Revenue bucket for a provider analytics time series.
/// </summary>
public record ProviderAnalyticsRevenueSeriesPoint
{
    public string Label { get; init; } = string.Empty;

    public decimal Amount { get; init; }
}

/// <summary>
/// City-level booking distribution for the selected analytics period.
/// </summary>
public record ProviderAnalyticsTopZone
{
    public string City { get; init; } = string.Empty;

    public int BookingCount { get; init; }

    public decimal Percentage { get; init; }
}

/// <summary>
/// Provider booking counts grouped into UI-facing status buckets.
/// </summary>
public record ProviderAnalyticsAppointmentsByStatus
{
    public int Confirmed { get; init; }

    public int Pending { get; init; }

    public int Completed { get; init; }

    public int Total { get; init; }
}

/// <summary>
/// Wallet snapshot included in provider analytics.
/// </summary>
public record ProviderAnalyticsWalletSummary
{
    public decimal ReservedBalance { get; init; }

    public decimal UsableBalance { get; init; }

    public string Currency { get; init; } = ProviderFinanceConstants.DefaultCurrency;
}

/// <summary>
/// Current-month provider wallet movement totals included in analytics.
/// </summary>
public record ProviderAnalyticsWalletActivity
{
    public decimal CurrentMonthDeposits { get; init; }

    public decimal CurrentMonthDeductions { get; init; }
}
