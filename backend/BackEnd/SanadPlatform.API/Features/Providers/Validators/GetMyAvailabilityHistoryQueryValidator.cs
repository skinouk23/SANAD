using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetMyAvailabilityHistoryQuery"/>.
/// Ensures pagination and date-range parameters are within valid bounds.
/// </summary>
public class GetMyAvailabilityHistoryQueryValidator : AbstractValidator<GetMyAvailabilityHistoryQuery>
{
    /// <summary>
    /// Initializes validation rules for the availability history query.
    /// </summary>
    public GetMyAvailabilityHistoryQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.");

        RuleFor(x => x.Page).ValidPage();

        RuleFor(x => x.Limit).ValidLimit();

        RuleFor(x => x.EndDate)
            .GreaterThanOrEqualTo(x => x.StartDate)
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue)
            .WithMessage("EndDate must be on or after StartDate.");
    }
}
