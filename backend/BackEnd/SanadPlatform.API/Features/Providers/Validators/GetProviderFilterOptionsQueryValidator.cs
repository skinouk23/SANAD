using FluentValidation;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetProviderFilterOptionsQuery"/>.
/// </summary>
public class GetProviderFilterOptionsQueryValidator : AbstractValidator<GetProviderFilterOptionsQuery>
{
    /// <summary>
    /// Initializes validation rules for the provider filter options query.
    /// </summary>
    public GetProviderFilterOptionsQueryValidator()
    {
        RuleFor(x => x.ServiceCategory)
            .MaximumLength(100).WithMessage("Service category must not exceed 100 characters.")
            .When(x => x.ServiceCategory != null);
    }
}
