using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Conversations.Queries;

namespace SanadPlatform.API.Features.Conversations.Validators;

/// <summary>
/// Validates <see cref="GetConversationMessagesQuery"/>.
/// </summary>
public class GetConversationMessagesQueryValidator : AbstractValidator<GetConversationMessagesQuery>
{
    /// <summary>
    /// Initializes a new instance of <see cref="GetConversationMessagesQueryValidator"/>.
    /// </summary>
    public GetConversationMessagesQueryValidator()
    {
        RuleFor(x => x.ConversationId)
            .NotEmpty()
            .WithMessage("Conversation ID is required.");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("Authenticated user ID is required.");

        RuleFor(x => x.Request.Page)
            .ValidPage();

        RuleFor(x => x.Request.Limit)
            .ValidLimit(100);

        RuleFor(x => x.Request.Before)
            .LessThan(_ => DateTime.UtcNow)
            .When(x => x.Request.Before.HasValue)
            .WithMessage("Before must be a past datetime.");
    }
}
