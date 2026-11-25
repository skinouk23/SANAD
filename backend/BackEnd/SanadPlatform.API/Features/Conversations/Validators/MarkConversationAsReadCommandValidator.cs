using FluentValidation;
using SanadPlatform.API.Features.Conversations.Commands;

namespace SanadPlatform.API.Features.Conversations.Validators;

/// <summary>
/// Validates <see cref="MarkConversationAsReadCommand"/>.
/// </summary>
public class MarkConversationAsReadCommandValidator
    : AbstractValidator<MarkConversationAsReadCommand>
{
    /// <summary>
    /// Initializes a new instance of <see cref="MarkConversationAsReadCommandValidator"/>.
    /// </summary>
    public MarkConversationAsReadCommandValidator()
    {
        RuleFor(x => x.ConversationId)
            .NotEmpty()
            .WithMessage("Conversation ID is required.");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("Authenticated user ID is required.");
    }
}
