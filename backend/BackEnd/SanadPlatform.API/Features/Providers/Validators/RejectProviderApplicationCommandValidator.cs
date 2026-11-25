using FluentValidation;
using SanadPlatform.API.Features.Providers.Commands;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for admin provider rejection.
/// </summary>
public class RejectProviderApplicationCommandValidator
    : AbstractValidator<RejectProviderApplicationCommand>
{
    public RejectProviderApplicationCommandValidator()
    {
        RuleFor(x => x.ProviderId)
            .NotEmpty()
            .WithMessage("Provider ID is required.");

        RuleFor(x => x.AdminUserId)
            .NotEmpty()
            .WithMessage("Admin user ID is required.");

        RuleFor(x => x.Reason)
            .NotEmpty()
            .WithMessage("Rejection reason is required.")
            .MaximumLength(1000)
            .WithMessage("Rejection reason must not exceed 1000 characters.");
    }
}
