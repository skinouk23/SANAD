using FluentValidation;
using SanadPlatform.API.Features.Conversations.Queries;

namespace SanadPlatform.API.Features.Conversations.Validators;

/// <summary>
/// Validates <see cref="GetConversationByIdQuery"/>.
/// </summary>
public class GetConversationByIdQueryValidator : AbstractValidator<GetConversationByIdQuery>
{
    /// <summary>
    /// Initializes a new instance of <see cref="GetConversationByIdQueryValidator"/>.
    /// </summary>
    public GetConversationByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Conversation ID is required.");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("Authenticated user ID is required.");
    }
}
