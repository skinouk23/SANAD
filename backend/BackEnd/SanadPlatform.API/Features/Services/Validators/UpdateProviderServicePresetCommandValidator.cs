using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Services.Commands;

namespace SanadPlatform.API.Features.Services.Validators;

/// <summary>
/// Validator for <see cref="UpdateProviderServicePresetCommand"/>.
/// </summary>
public class UpdateProviderServicePresetCommandValidator : AbstractValidator<UpdateProviderServicePresetCommand>
{
    /// <summary>
    /// Initializes validation rules for provider preset updates.
    /// </summary>
    public UpdateProviderServicePresetCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Preset ID is required.");

        RuleFor(x => x.NameEn)
            .NotEmpty().WithMessage("English name is required.")
            .MaximumLength(200).WithMessage("English name must not exceed 200 characters.");

        RuleFor(x => x.NameFr)
            .NotEmpty().WithMessage("French name is required.")
            .MaximumLength(200).WithMessage("French name must not exceed 200 characters.");

        RuleFor(x => x.NameAr)
            .MaximumLength(200).WithMessage("Arabic name must not exceed 200 characters.")
            .When(x => x.NameAr is not null);

        RuleFor(x => x.NameDe)
            .MaximumLength(200).WithMessage("German name must not exceed 200 characters.")
            .When(x => x.NameDe is not null);

        RuleFor(x => x.DescriptionEn)
            .ValidMediumText()
            .When(x => x.DescriptionEn is not null);

        RuleFor(x => x.DescriptionFr)
            .ValidMediumText()
            .When(x => x.DescriptionFr is not null);

        RuleFor(x => x.DescriptionAr)
            .ValidMediumText()
            .When(x => x.DescriptionAr is not null);

        RuleFor(x => x.DescriptionDe)
            .ValidMediumText()
            .When(x => x.DescriptionDe is not null);

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price must be zero or positive.");

        RuleFor(x => x.PriceType)
            .NotEmpty().WithMessage("Price type is required.")
            .Must(value => value is "fixed" or "hourly" or "range" or "starting_from")
            .WithMessage("Price type must be one of: fixed, hourly, range, starting_from.");

        RuleFor(x => x.Currency)
            .NotEmpty().WithMessage("Currency is required.")
            .Length(3).WithMessage("Currency must be a 3-letter code.");

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0).WithMessage("Duration must be positive.")
            .When(x => x.DurationMinutes.HasValue);

        RuleFor(x => x.ServiceLocation)
            .NotEmpty().WithMessage("Service location is required.")
            .Must(value => value is "home" or "clinic" or "both" or "online")
            .WithMessage("Service location must be one of: home, clinic, both, online.");

        RuleFor(x => x.TypeConfig)
            .Must(typeConfig => typeConfig!.Value.ValueKind == System.Text.Json.JsonValueKind.Object)
            .WithMessage("TypeConfig must be a JSON object, not a string or other primitive.")
            .Must(typeConfig => typeConfig!.Value.GetRawText().Length <= 65_536)
            .WithMessage("TypeConfig payload must not exceed 64 KB.")
            .When(x => x.TypeConfig is not null);

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be zero or positive.");
    }
}
