using FluentValidation;
using SanadPlatform.API.Features.Conversations.Queries;

namespace SanadPlatform.API.Features.Conversations.Validators;

/// <summary>
/// Validates <see cref="GetUnreadCountQuery"/>.
/// </summary>
public class GetUnreadCountQueryValidator : AbstractValidator<GetUnreadCountQuery>
{
    /// <summary>
    /// Initializes a new instance of <see cref="GetUnreadCountQueryValidator"/>.
    /// </summary>
    public GetUnreadCountQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("Authenticated user ID is required.");
    }
}
