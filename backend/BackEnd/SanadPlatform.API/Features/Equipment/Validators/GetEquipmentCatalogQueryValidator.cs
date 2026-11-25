using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Equipment.Queries;

namespace SanadPlatform.API.Features.Equipment.Validators;

/// <summary>
/// Validator for <see cref="GetEquipmentCatalogQuery"/>.
/// Centralizes all catalog query constraints in one place.
/// </summary>
public class GetEquipmentCatalogQueryValidator : AbstractValidator<GetEquipmentCatalogQuery>
{

    /// <summary>
    /// Initializes validation rules for the equipment catalog query.
    /// </summary>
    public GetEquipmentCatalogQueryValidator()
    {
        RuleFor(x => x.Page).ValidPage();

        RuleFor(x => x.Limit).ValidLimit(50);

        RuleFor(x => x.SortBy)
            .Must(s => EquipmentConstants.SortFields.All.Contains(s, StringComparer.OrdinalIgnoreCase))
            .When(x => !string.IsNullOrEmpty(x.SortBy))
            .WithMessage($"SortBy must be one of: {string.Join(", ", EquipmentConstants.SortFields.All)}");

        RuleFor(x => x.Search)
            .MaximumLength(100)
            .WithMessage("Search query cannot exceed 100 characters.")
            .When(x => x.Search != null);

        RuleFor(x => x.Category)
            .Matches(@"^[a-z0-9_]+$")
            .WithMessage("Category must contain only lowercase letters, digits and underscores.")
            .MaximumLength(50)
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