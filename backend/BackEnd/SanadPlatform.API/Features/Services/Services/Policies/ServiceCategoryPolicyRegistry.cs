namespace SanadPlatform.API.Features.Services.Services.Policies;

/// <summary>
/// Resolves the appropriate <see cref="IServiceCategoryPolicy"/> for a given service category.
/// Policies self-register via their <see cref="IServiceCategoryPolicy.CategoryCode"/> property;
/// the registry does not hard-code any concrete category codes.
/// Falls back to <see cref="DefaultServiceCategoryPolicy"/> for unrecognised categories.
/// </summary>
public class ServiceCategoryPolicyRegistry
{
    private readonly IReadOnlyDictionary<string, IServiceCategoryPolicy> _policies;
    private readonly IServiceCategoryPolicy _default;

    /// <summary>
    /// Initializes the registry from all registered <see cref="IServiceCategoryPolicy"/> implementations.
    /// </summary>
    public ServiceCategoryPolicyRegistry(
        IEnumerable<IServiceCategoryPolicy> policies,
        DefaultServiceCategoryPolicy defaultPolicy)
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
    public IServiceCategoryPolicy Resolve(string categoryCode)
    {
        return _policies.TryGetValue(categoryCode, out var policy) ? policy : _default;
    }
}
