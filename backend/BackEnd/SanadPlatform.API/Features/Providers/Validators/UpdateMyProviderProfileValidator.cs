using FluentValidation;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Providers.Commands;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="UpdateProviderProfileCommand"/>.
/// Validates the authenticated provider's self-service profile update.
/// All fields are optional (partial update); present values must meet format constraints.
/// </summary>
public class UpdateProviderProfileValidator : AbstractValidator<UpdateProviderProfileCommand>
{
    public UpdateProviderProfileValidator()
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

        RuleFor(x => x.Address)
            .MaximumLength(250)
            .When(x => x.Address != null);

        RuleFor(x => x.City)
            .MaximumLength(100)
            .When(x => x.City != null);

        RuleFor(x => x.PostalCode)
            .MaximumLength(20)
            .When(x => x.PostalCode != null);

        RuleFor(x => x.Latitude)
            .NotNull()
            .When(x => x.Longitude.HasValue && !x.Latitude.HasValue)
            .WithMessage("Latitude is required when longitude is supplied");

        RuleFor(x => x.Longitude)
            .NotNull()
            .When(x => x.Latitude.HasValue && !x.Longitude.HasValue)
            .WithMessage("Longitude is required when latitude is supplied");

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90m, 90m)
            .When(x => x.Latitude.HasValue)
            .WithMessage("Latitude must be between -90 and 90");

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180m, 180m)
            .When(x => x.Longitude.HasValue)
            .WithMessage("Longitude must be between -180 and 180");

        RuleFor(x => x.ServiceRadius)
            .InclusiveBetween(1, 500)
            .WithMessage("Service radius must be between 1 and 500 km")
            .When(x => x.ServiceRadius.HasValue);

        RuleFor(x => x.NutritionProviderSubtype)
            .Must(BeValidNutritionProviderSubtype)
            .When(x => x.NutritionProviderSubtype != null)
            .WithMessage("Nutrition provider subtype must be one of: Restaurant, Chef, Nutritionist");
    }

    private static bool BeValidNutritionProviderSubtype(string? nutritionProviderSubtype)
    {
        return !string.IsNullOrWhiteSpace(nutritionProviderSubtype)
            && Enum.TryParse<NutritionProviderSubtype>(
                nutritionProviderSubtype.Trim(),
                ignoreCase: true,
                out _);
    }
}
