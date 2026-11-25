using FluentValidation;
using SanadPlatform.API.Features.Services.Commands;

namespace SanadPlatform.API.Features.Services.Validators;

/// <summary>
/// Validator for <see cref="ReorderProviderServicePresetsCommand"/>.
/// </summary>
public class ReorderProviderServicePresetsCommandValidator : AbstractValidator<ReorderProviderServicePresetsCommand>
{
    /// <summary>
    /// Initializes validation rules for provider preset reordering.
    /// </summary>
    public ReorderProviderServicePresetsCommandValidator()
    {
        RuleFor(x => x.ProviderCategory)
            .NotEmpty().WithMessage("Provider category is required.")
            .MaximumLength(50).WithMessage("Provider category must not exceed 50 characters.");

        RuleFor(x => x.OrderedIds)
            .NotEmpty().WithMessage("OrderedIds must contain at least one preset ID.");
    }
}
