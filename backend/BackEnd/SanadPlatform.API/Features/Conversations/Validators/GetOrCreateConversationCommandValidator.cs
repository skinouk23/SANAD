using FluentValidation;
using SanadPlatform.API.Features.Conversations.Commands;

namespace SanadPlatform.API.Features.Conversations.Validators;

/// <summary>
/// Validates <see cref="GetOrCreateConversationCommand"/>.
/// Ensures the caller provides the correct target participant ID for their role.
/// </summary>
public class GetOrCreateConversationCommandValidator : AbstractValidator<GetOrCreateConversationCommand>
{
    /// <summary>
    /// Initializes a new instance of <see cref="GetOrCreateConversationCommandValidator"/>.
    /// </summary>
    public GetOrCreateConversationCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("Authenticated user ID is required.");

        // Patients must specify the target provider
        RuleFor(x => x.TargetProviderId)
            .NotEmpty()
            .WithMessage("ProviderId is required when creating a conversation as a patient.")
            .When(x => x.IsPatient);

        // Providers must specify the target patient
        RuleFor(x => x.TargetPatientId)
            .NotEmpty()
            .WithMessage("PatientId is required when creating a conversation as a provider.")
            .When(x => x.IsProvider);

        // At least one role must be set
        RuleFor(x => x)
            .Must(x => x.IsPatient || x.IsProvider)
            .WithMessage("Caller must be a patient or a provider.");
    }
}
