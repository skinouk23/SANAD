using FluentValidation;
using SanadPlatform.API.Features.Providers.Queries;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="GetMyProviderAnalyticsQuery"/>.
/// </summary>
public class GetMyProviderAnalyticsQueryValidator : AbstractValidator<GetMyProviderAnalyticsQuery>
{
    private static readonly string[] AllowedPeriods = ["week", "month", "year"];

    public GetMyProviderAnalyticsQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(x => x.Period)
            .Must(period => !string.IsNullOrWhiteSpace(period)
                && AllowedPeriods.Contains(period.Trim(), StringComparer.OrdinalIgnoreCase))
            .WithMessage("Period must be one of: week, month, year.");
    }
}
