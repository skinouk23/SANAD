using System.Text.Json;

namespace SanadPlatform.API.Features.Services.Services.Policies;

/// <summary>
/// Plain-data context passed to <see cref="IServiceCategoryPolicy.ValidateAndNormalize"/>.
/// Contains only scalar values — no EF entities.
/// </summary>
public sealed record ServiceCategoryContext(
    string CategoryCode,
    decimal Price,
    string PriceType,
    string ServiceLocation,
    JsonElement? TypeConfig);

/// <summary>
/// Defines category-specific validation and normalization for service metadata.
/// Implementations validate the <c>TypeConfig</c> JSON payload, enforce category rules,
/// and return a canonical JSON string for storage in <c>Service.Metadata</c>.
/// </summary>
public interface IServiceCategoryPolicy
{
    /// <summary>
    /// The category code this policy handles (e.g. "equipment_rental", "default").
    /// Used by <see cref="ServiceCategoryPolicyRegistry"/> for automatic lookup.
    /// </summary>
    string CategoryCode { get; }

    /// <summary>
    /// Indicates whether the policy requires revalidation during updates even when
    /// <c>TypeConfig</c> is not provided — i.e. when only policy-relevant scalar fields
    /// (Price, PriceType, ServiceLocation) change. The handler uses this flag to decide
    /// whether to re-run <see cref="ValidateAndNormalize"/> against existing metadata.
    /// </summary>
    bool RequiresRevalidationOnUpdate { get; }

    /// <summary>
    /// Validates the category-specific <c>TypeConfig</c> and returns normalized metadata JSON.
    /// Returns <c>null</c> if the category requires no metadata.
    /// </summary>
    /// <param name="context">Plain-data context built by the handler from the command and provider info.</param>
    /// <returns>Canonical JSON string for <c>Service.Metadata</c>, or <c>null</c>.</returns>
    /// <exception cref="InvalidOperationException">Thrown when validation fails.</exception>
    string? ValidateAndNormalize(ServiceCategoryContext context);
}
