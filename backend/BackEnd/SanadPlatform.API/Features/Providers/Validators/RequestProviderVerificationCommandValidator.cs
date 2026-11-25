using FluentValidation;
using SanadPlatform.API.Features.Providers.Commands;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for provider self-service verification requests.
/// </summary>
public class RequestProviderVerificationCommandValidator : AbstractValidator<RequestProviderVerificationCommand>
{
    public RequestProviderVerificationCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");
    }
}
