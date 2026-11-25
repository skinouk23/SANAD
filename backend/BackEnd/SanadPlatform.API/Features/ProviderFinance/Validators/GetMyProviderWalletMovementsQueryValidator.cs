using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.ProviderFinance.Queries;

namespace SanadPlatform.API.Features.ProviderFinance.Validators;

/// <summary>
/// Validates pagination and filtering parameters for <see cref="GetMyProviderWalletMovementsQuery"/>.
/// </summary>
public class GetMyProviderWalletMovementsQueryValidator : AbstractValidator<GetMyProviderWalletMovementsQuery>
{
    public GetMyProviderWalletMovementsQueryValidator()
    {
        RuleFor(x => x.Page).ValidPage();

        RuleFor(x => x.Limit).ValidLimit();

        RuleFor(x => x.Type)
            .Must(ProviderFinanceConstants.IsSupportedWalletMovementType)
            .WithMessage("Type must be 'deposit' or 'deduction'.")
            .When(x => !string.IsNullOrWhiteSpace(x.Type));

        RuleFor(x => x.Search)
            .MaximumLength(200)
            .WithMessage("Search must not exceed 200 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Search));

        RuleFor(x => x.Month)
            .InclusiveBetween(1, 12)
            .WithMessage("Month must be between 1 and 12.")
            .When(x => x.Month.HasValue);

        RuleFor(x => x.Year)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Year must be a positive value.")
            .LessThanOrEqualTo(9999)
            .WithMessage("Year must be a valid calendar year.")
            .When(x => x.Year.HasValue);
    }
}
