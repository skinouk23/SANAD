using FluentValidation;
using SanadPlatform.API.Features.Providers.Commands;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for admin provider approval.
/// </summary>
public class ApproveProviderApplicationCommandValidator
    : AbstractValidator<ApproveProviderApplicationCommand>
{
    public ApproveProviderApplicationCommandValidator()
    {
        RuleFor(x => x.ProviderId)
            .NotEmpty()
            .WithMessage("Provider ID is required.");

        RuleFor(x => x.AdminUserId)
            .NotEmpty()
            .WithMessage("Admin user ID is required.");
    }
}
