using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetPaginatedProvidersQuery"/>.
/// Ensures pagination parameters are within acceptable bounds.
/// </summary>
public class GetPaginatedProvidersQueryValidator : AbstractValidator<GetPaginatedProvidersQuery>
{
    /// <summary>
    /// Initializes validation rules for the paginated providers query.
    /// </summary>
    public GetPaginatedProvidersQueryValidator()
    {
        RuleFor(x => x.Page)
            .ValidPage();

        RuleFor(x => x.Limit)
            .ValidLimit();

        RuleFor(x => x.SearchQuery)
            .MaximumLength(200).WithMessage("Search query must not exceed 200 characters.")
            .When(x => x.SearchQuery != null);

        RuleFor(x => x.City)
            .MaximumLength(100).WithMessage("City must not exceed 100 characters.")
            .When(x => x.City != null);
    }
}
