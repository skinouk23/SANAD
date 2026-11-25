using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetTopRatedProvidersQuery"/>.
/// Ensures pagination parameters are within acceptable bounds.
/// </summary>
public class GetTopRatedProvidersQueryValidator : AbstractValidator<GetTopRatedProvidersQuery>
{
    /// <summary>
    /// Initializes validation rules for the top-rated providers query.
    /// </summary>
    public GetTopRatedProvidersQueryValidator()
    {
        RuleFor(x => x.Page)
            .ValidPage();

        RuleFor(x => x.Limit)
            .ValidLimit();
    }
}
