using System.Linq.Expressions;
using FluentValidation;
using SanadPlatform.API.Features.Finance.DTOs;
using SanadPlatform.API.Features.Finance.Queries;

namespace SanadPlatform.API.Features.Finance.Validators;

/// <summary>
/// Shared validation rules for finance timeline queries.
/// </summary>
public abstract class FinanceTimelineQueryValidatorBase<T> : AbstractValidator<T>
{
    protected FinanceTimelineQueryValidatorBase(
        Expression<Func<T, DateTime?>> dateFromExpression,
        Expression<Func<T, DateTime?>> dateToExpression,
        Expression<Func<T, string?>> sortExpression)
    {
        var getDateFrom = dateFromExpression.Compile();
        var getDateTo = dateToExpression.Compile();
        var getSort = sortExpression.Compile();

        RuleFor(sortExpression)
            .Must(BeSupportedSort)
            .WithMessage($"Sort must be '{FinanceTimelineSortOptions.OccurredAtDesc}' or '{FinanceTimelineSortOptions.CreatedAtDesc}'.")
            .When(x => !string.IsNullOrWhiteSpace(getSort(x)));

        RuleFor(x => x)
            .Must(model => HaveValidDateRange(getDateFrom(model), getDateTo(model)))
            .WithMessage("DateFrom must be earlier than or equal to DateTo.");
    }

    private static bool BeSupportedSort(string? sort)
    {
        return string.IsNullOrWhiteSpace(sort)
            || string.Equals(sort.Trim(), FinanceTimelineSortOptions.OccurredAtDesc, StringComparison.OrdinalIgnoreCase)
            || string.Equals(sort.Trim(), FinanceTimelineSortOptions.CreatedAtDesc, StringComparison.OrdinalIgnoreCase);
    }

    private static bool HaveValidDateRange(DateTime? dateFrom, DateTime? dateTo)
    {
        return !dateFrom.HasValue || !dateTo.HasValue || dateFrom.Value <= dateTo.Value;
    }
}

/// <summary>
/// Validates <see cref="GetMyFinanceTimelineQuery"/>.
/// </summary>
public sealed class GetMyFinanceTimelineQueryValidator : FinanceTimelineQueryValidatorBase<GetMyFinanceTimelineQuery>
{
    public GetMyFinanceTimelineQueryValidator()
        : base(query => query.DateFrom, query => query.DateTo, query => query.Sort)
    {
    }
}

/// <summary>
/// Validates <see cref="GetProviderFinanceTimelineQuery"/>.
/// </summary>
public sealed class GetProviderFinanceTimelineQueryValidator : FinanceTimelineQueryValidatorBase<GetProviderFinanceTimelineQuery>
{
    public GetProviderFinanceTimelineQueryValidator()
        : base(query => query.DateFrom, query => query.DateTo, query => query.Sort)
    {
    }
}

/// <summary>
/// Validates <see cref="GetAdminFinanceTimelineQuery"/>.
/// </summary>
public sealed class GetAdminFinanceTimelineQueryValidator : FinanceTimelineQueryValidatorBase<GetAdminFinanceTimelineQuery>
{
    public GetAdminFinanceTimelineQueryValidator()
        : base(query => query.DateFrom, query => query.DateTo, query => query.Sort)
    {
    }
}

/// <summary>
/// Validates <see cref="GetBookingFinanceTimelineQuery"/>.
/// </summary>
public sealed class GetBookingFinanceTimelineQueryValidator : FinanceTimelineQueryValidatorBase<GetBookingFinanceTimelineQuery>
{
    public GetBookingFinanceTimelineQueryValidator()
        : base(query => query.DateFrom, query => query.DateTo, query => query.Sort)
    {
    }
}
