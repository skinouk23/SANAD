using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Services.Queries;

namespace SanadPlatform.API.Features.Services.Validators;

/// <summary>
/// Validator for <see cref="GetProviderServicesQuery"/>.
/// Ensures pagination parameters are within acceptable bounds and sort values are valid.
/// </summary>
public class GetProviderServicesQueryValidator : AbstractValidator<GetProviderServicesQuery>
{
    private static readonly HashSet<string> AllowedSortValues = new(StringComparer.OrdinalIgnoreCase)
    {
        "name", "price", "created", "bookings"
    };

    /// <summary>
    /// Initializes validation rules for the provider services list query.
    /// </summary>
    public GetProviderServicesQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.");

        RuleFor(x => x.Page).ValidPage();

        RuleFor(x => x.Limit).ValidLimit();

        RuleFor(x => x.SortBy)
            .Must(s => AllowedSortValues.Contains(s!))
            .WithMessage($"Sort must be one of: {string.Join(", ", AllowedSortValues)}.")
            .When(x => x.SortBy is not null);

        RuleFor(x => x.Search)
            .MaximumLength(200).WithMessage("Search term must not exceed 200 characters.")
            .When(x => x.Search is not null);
    }
}
