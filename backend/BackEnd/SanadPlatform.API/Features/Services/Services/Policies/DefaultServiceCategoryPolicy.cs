namespace SanadPlatform.API.Features.Services.Services.Policies;

/// <summary>
/// Default (no-op) service category policy used for categories that have no special
/// <c>TypeConfig</c> requirements. Passes through the raw JSON unchanged.
/// </summary>
public class DefaultServiceCategoryPolicy : IServiceCategoryPolicy
{
    /// <inheritdoc />
    public string CategoryCode => "default";

    /// <inheritdoc />
    public bool RequiresRevalidationOnUpdate => false;

    /// <inheritdoc />
    public string? ValidateAndNormalize(ServiceCategoryContext context)
    {
        return context.TypeConfig?.GetRawText();
    }
}
