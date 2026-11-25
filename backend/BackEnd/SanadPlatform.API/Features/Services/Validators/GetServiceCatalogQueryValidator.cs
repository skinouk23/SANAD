using FluentValidation;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Services.Queries;

namespace SanadPlatform.API.Features.Services.Validators;

/// <summary>
/// Validator for <see cref="GetServiceCatalogQuery"/>.
/// Ensures pagination, sorting, and filter parameters are within acceptable bounds.
/// </summary>
public class GetServiceCatalogQueryValidator : AbstractValidator<GetServiceCatalogQuery>
{
    private static readonly string[] AllowedSortFields = ["price", "rating", "createdAt"];

    /// <summary>
    /// Initializes validation rules for the service catalog query.
    /// </summary>
    public GetServiceCatalogQueryValidator()
    {
        RuleFor(x => x.Page).ValidPage();

        RuleFor(x => x.Limit).ValidLimit(50);

        RuleFor(x => x.SortBy)
            .Must(s => AllowedSortFields.Contains(s, StringComparer.OrdinalIgnoreCase))
            .When(x => !string.IsNullOrEmpty(x.SortBy))
            .WithMessage($"SortBy must be one of: {string.Join(", ", AllowedSortFields)}.");

        RuleFor(x => x.Search)
            .MaximumLength(100)
            .WithMessage("Search query cannot exceed 100 characters.")
            .When(x => x.Search != null);

        RuleFor(x => x.DisplayGroup)
            .Must(dg => Enum.TryParse<DisplayGroup>(dg, ignoreCase: true, out _))
            .WithMessage("DisplayGroup must be one of: Medical, Daily, Rehabilitation, Wellness.")
            .When(x => !string.IsNullOrEmpty(x.DisplayGroup));

        RuleFor(x => x.Category)
            .MaximumLength(50)
            .WithMessage("Category cannot exceed 50 characters.")
            .When(x => x.Category != null);

        RuleFor(x => x.MinPrice)
            .GreaterThanOrEqualTo(0)
            .WithMessage("MinPrice must be greater than or equal to 0.")
            .When(x => x.MinPrice.HasValue);

        RuleFor(x => x.MaxPrice)
            .GreaterThan(0)
            .WithMessage("MaxPrice must be greater than 0.")
            .When(x => x.MaxPrice.HasValue);

        RuleFor(x => x)
            .Must(q => !q.MinPrice.HasValue || !q.MaxPrice.HasValue || q.MinPrice <= q.MaxPrice)
            .WithMessage("MinPrice cannot be greater than MaxPrice.");
    }
}
