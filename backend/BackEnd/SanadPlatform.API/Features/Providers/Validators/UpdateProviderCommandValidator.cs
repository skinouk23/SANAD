using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Providers.Commands;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="UpdateProviderCommand"/>.
/// All fields are optional (admin partial update), but present values must meet format constraints.
/// </summary>
public class UpdateProviderCommandValidator : AbstractValidator<UpdateProviderCommand>
{
    public UpdateProviderCommandValidator()
    {
        RuleFor(x => x.BusinessName)
            .MaximumLength(200)
            .When(x => x.BusinessName != null);

        RuleFor(x => x.FirstName)
            .ValidName()
            .When(x => x.FirstName != null);

        RuleFor(x => x.LastName)
            .ValidName()
            .When(x => x.LastName != null);

        RuleFor(x => x.Bio)
            .ValidMediumText()
            .When(x => x.Bio != null);

        RuleFor(x => x.ShortDescription)
            .MaximumLength(500)
            .When(x => x.ShortDescription != null);

        RuleFor(x => x.AddressLine1)
            .MaximumLength(250)
            .When(x => x.AddressLine1 != null);

        RuleFor(x => x.AddressLine2)
            .MaximumLength(250)
            .When(x => x.AddressLine2 != null);

        RuleFor(x => x.City)
            .MaximumLength(100)
            .When(x => x.City != null);

        RuleFor(x => x.StateProvince)
            .MaximumLength(100)
            .When(x => x.StateProvince != null);

        RuleFor(x => x.PostalCode)
            .MaximumLength(20)
            .When(x => x.PostalCode != null);

        RuleFor(x => x.CountryCode)
            .Length(2, 10).WithMessage("Country code must be between 2 and 10 characters")
            .When(x => x.CountryCode != null);
    }
}
