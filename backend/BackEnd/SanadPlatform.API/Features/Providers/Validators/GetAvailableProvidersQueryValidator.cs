using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetAvailableProvidersQuery"/>.
/// Ensures pagination parameters and service category are within acceptable bounds.
/// </summary>
public class GetAvailableProvidersQueryValidator : AbstractValidator<GetAvailableProvidersQuery>
{
    /// <summary>
    /// Initializes validation rules for the available providers query.
    /// </summary>
    public GetAvailableProvidersQueryValidator()
    {
        RuleFor(x => x.Page)
            .ValidPage();

        RuleFor(x => x.Limit)
            .ValidLimit();

        RuleFor(x => x.ServiceCategory)
            .MaximumLength(100).WithMessage("Service category must not exceed 100 characters.");
    }
}
