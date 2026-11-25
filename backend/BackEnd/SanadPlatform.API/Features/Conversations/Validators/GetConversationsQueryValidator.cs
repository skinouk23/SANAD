using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Conversations.Queries;

namespace SanadPlatform.API.Features.Conversations.Validators;

/// <summary>
/// Validates <see cref="GetConversationsQuery"/>.
/// </summary>
public class GetConversationsQueryValidator : AbstractValidator<GetConversationsQuery>
{
    private static readonly string[] AllowedSortFields = ["lastMessageAt", "createdAt", "updatedAt"];

    /// <summary>
    /// Initializes a new instance of <see cref="GetConversationsQueryValidator"/>.
    /// </summary>
    public GetConversationsQueryValidator()
    {
        RuleFor(x => x.Request.Page)
            .ValidPage();

        RuleFor(x => x.Request.Limit)
            .ValidLimit(100);

        RuleFor(x => x.Request.SortBy)
            .Must(s => AllowedSortFields.Contains(s, StringComparer.OrdinalIgnoreCase))
            .When(x => !string.IsNullOrEmpty(x.Request.SortBy))
            .WithMessage($"SortBy must be one of: {string.Join(", ", AllowedSortFields)}.");

        RuleFor(x => x.Request.SearchQuery)
            .MaximumLength(100)
            .When(x => !string.IsNullOrEmpty(x.Request.SearchQuery))
            .WithMessage("Search query must not exceed 100 characters.");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("Authenticated user ID is required.");
    }
}
