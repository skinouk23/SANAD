using FluentValidation;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetProviderRangeAvailabilityQuery"/>.
/// </summary>
public class GetProviderRangeAvailabilityQueryValidator : AbstractValidator<GetProviderRangeAvailabilityQuery>
{
    public GetProviderRangeAvailabilityQueryValidator()
    {
        RuleFor(x => x.ProviderId)
            .NotEmpty()
            .WithMessage("Provider ID is required.");

        RuleFor(x => x.StartDate)
            .NotEmpty()
            .WithMessage("Start date is required.");

        RuleFor(x => x.EndDate)
            .NotEmpty()
            .WithMessage("End date is required.")
            .GreaterThanOrEqualTo(x => x.StartDate)
            .WithMessage("End date must be on or after the start date.");

        RuleFor(x => x.ServiceIds)
            .NotEmpty()
            .WithMessage("At least one service ID is required.")
            .Must(ids => ids.All(id => id != Guid.Empty))
            .WithMessage("Service IDs must not contain empty GUID values.")
            .Must(ids => ids.Distinct().Count() == ids.Count)
            .WithMessage("Duplicate service IDs are not allowed.");
    }
}
