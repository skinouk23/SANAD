namespace SanadPlatform.API.Features.Bookings.Services.Policies;

/// <summary>
/// Resolves the appropriate <see cref="IBookingCategoryPolicy"/> for a given service category.
/// Policies self-register via their <see cref="IBookingCategoryPolicy.CategoryCode"/> property;
/// the registry does not hard-code any concrete category codes.
/// Falls back to <see cref="DefaultBookingCategoryPolicy"/> for unrecognised categories.
/// </summary>
public class BookingCategoryPolicyRegistry
{
    private readonly IReadOnlyDictionary<string, IBookingCategoryPolicy> _policies;
    private readonly IBookingCategoryPolicy _default;

    /// <summary>
    /// Initializes the registry from all registered <see cref="IBookingCategoryPolicy"/> implementations.
    /// </summary>
    public BookingCategoryPolicyRegistry(
        IEnumerable<IBookingCategoryPolicy> policies,
        DefaultBookingCategoryPolicy defaultPolicy)
    {
        ArgumentNullException.ThrowIfNull(policies);
        _default = defaultPolicy ?? throw new ArgumentNullException(nameof(defaultPolicy));

        _policies = policies
            .Where(p => p.CategoryCode != "default")
            .ToDictionary(p => p.CategoryCode, StringComparer.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Returns the policy for the given service category, or the default policy if none matches.
    /// </summary>
    /// <param name="categoryCode">Service category string (e.g. "equipment_rental").</param>
    public IBookingCategoryPolicy Resolve(string categoryCode)
    {
        return _policies.TryGetValue(categoryCode, out var policy) ? policy : _default;
    }
}
