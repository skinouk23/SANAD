using FluentValidation;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetProviderScheduleQuery"/>.
/// Ensures the provider ID is present and the days parameter is within bounds.
/// </summary>
public class GetProviderScheduleQueryValidator : AbstractValidator<GetProviderScheduleQuery>
{
    /// <summary>
    /// Initializes validation rules for the provider schedule query.
    /// </summary>
    public GetProviderScheduleQueryValidator()
    {
        RuleFor(x => x.ProviderId)
            .NotEmpty()
            .WithMessage("Provider ID is required.");

        RuleFor(x => x.Days)
            .InclusiveBetween(1, 90)
            .WithMessage("Days must be between 1 and 90.");
    }
}
