using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetProviderReviewsQuery"/>.
/// Ensures pagination and filter parameters are within valid ranges.
/// </summary>
public class GetProviderReviewsQueryValidator : AbstractValidator<GetProviderReviewsQuery>
{
    /// <summary>
    /// Initializes validation rules for the provider reviews query.
    /// </summary>
    public GetProviderReviewsQueryValidator()
    {
        RuleFor(x => x.Page).ValidPage();

        RuleFor(x => x.Limit).ValidLimit();

        RuleFor(x => x.MinRating)
            .InclusiveBetween(1, 5)
            .When(x => x.MinRating.HasValue)
            .WithMessage("Minimum rating must be between 1 and 5.");
    }
}
