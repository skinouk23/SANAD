using FluentValidation;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetProviderMonthAvailabilityQuery"/>.
/// </summary>
public class GetProviderMonthAvailabilityQueryValidator : AbstractValidator<GetProviderMonthAvailabilityQuery>
{
    public GetProviderMonthAvailabilityQueryValidator()
    {
        RuleFor(x => x.ProviderId)
            .NotEmpty()
            .WithMessage("Provider ID is required.");

        RuleFor(x => x.Year)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Year must be a positive value.")
            .LessThanOrEqualTo(9999)
            .WithMessage("Year must be a valid calendar year.");

        RuleFor(x => x.Month)
            .InclusiveBetween(1, 12)
            .WithMessage("Month must be between 1 and 12.");

        RuleFor(x => x.ServiceIds)
            .NotEmpty()
            .WithMessage("At least one service ID is required.")
            .Must(ids => ids.All(id => id != Guid.Empty))
            .WithMessage("Service IDs must not contain empty GUID values.")
            .Must(ids => ids.Distinct().Count() == ids.Count)
            .WithMessage("Duplicate service IDs are not allowed.");
    }
}
