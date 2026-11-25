using FluentValidation;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetMyProviderAvailabilityQuery"/>.
/// Ensures the user ID is present and the query shape is valid.
/// </summary>
public class GetMyProviderAvailabilityQueryValidator : AbstractValidator<GetMyProviderAvailabilityQuery>
{
    /// <summary>
    /// Initializes validation rules for the provider's own availability query.
    /// </summary>
    public GetMyProviderAvailabilityQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(x => x.Date)
            .NotEmpty()
            .WithMessage("Date is required.");

        RuleFor(x => x.ServiceId)
            .NotEqual(Guid.Empty)
            .When(x => x.ServiceId.HasValue)
            .WithMessage("Service ID must not be an empty GUID.");
    }
}
