using FluentValidation;
using SanadPlatform.API.Features.Conversations.Queries;

namespace SanadPlatform.API.Features.Conversations.Validators;

/// <summary>
/// Validates <see cref="GetConversationEntryStatusQuery"/>.
/// </summary>
public class GetConversationEntryStatusQueryValidator : AbstractValidator<GetConversationEntryStatusQuery>
{
    /// <summary>
    /// Initializes a new instance of <see cref="GetConversationEntryStatusQueryValidator"/>.
    /// </summary>
    public GetConversationEntryStatusQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("Authenticated user ID is required.");

        RuleFor(x => x.ProviderId)
            .NotEmpty()
            .WithMessage("Provider ID is required.");
    }
}
