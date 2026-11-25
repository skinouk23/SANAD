using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Providers.Commands;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="CreateProviderCommand"/>.
/// Enforces required fields and format constraints for admin-created provider records.
/// </summary>
public class CreateProviderCommandValidator : AbstractValidator<CreateProviderCommand>
{
    public CreateProviderCommandValidator()
    {
        RuleFor(x => x.ServiceCategory)
            .NotEmpty().WithMessage("Service category is required")
            .MaximumLength(100);

        RuleFor(x => x.CountryCode)
            .NotEmpty().WithMessage("Country code is required")
            .Length(2, 10).WithMessage("Country code must be between 2 and 10 characters");

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

        RuleFor(x => x.City)
            .MaximumLength(100)
            .When(x => x.City != null);

        RuleFor(x => x.AddressLine1)
            .MaximumLength(250)
            .When(x => x.AddressLine1 != null);
    }
}
