using FluentValidation;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetMyProviderPlanningQuery"/>.
/// </summary>
public class GetMyProviderPlanningQueryValidator : AbstractValidator<GetMyProviderPlanningQuery>
{
    public GetMyProviderPlanningQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(x => x.To)
            .GreaterThanOrEqualTo(x => x.From)
            .WithMessage("To date must be on or after the from date.");

        RuleFor(x => x.To.DayNumber - x.From.DayNumber + 1)
            .LessThanOrEqualTo(90)
            .WithMessage("Planning range cannot exceed 90 days.");
    }
}
