using FluentValidation;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetProviderAvailabilityQuery"/>.
/// Ensures the provider ID is present and the query shape is valid.
/// </summary>
public class GetProviderAvailabilityQueryValidator : AbstractValidator<GetProviderAvailabilityQuery>
{
    /// <summary>
    /// Initializes validation rules for the provider availability query.
    /// </summary>
    public GetProviderAvailabilityQueryValidator()
    {
        RuleFor(x => x.ProviderId)
            .NotEmpty()
            .WithMessage("Provider ID is required.");

        RuleFor(x => x.Date)
            .NotEmpty()
            .WithMessage("Date is required.");

        RuleFor(x => x.ServiceId)
            .NotEqual(Guid.Empty)
            .When(x => x.ServiceId.HasValue)
            .WithMessage("Service ID must not be an empty GUID.");
    }
}
