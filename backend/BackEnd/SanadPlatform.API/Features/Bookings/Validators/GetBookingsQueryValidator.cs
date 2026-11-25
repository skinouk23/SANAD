using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Bookings.Queries;

namespace SanadPlatform.API.Features.Bookings.Validators;

/// <summary>
/// FluentValidation validator for <see cref="GetBookingsQuery"/>.
/// </summary>
public class GetBookingsQueryValidator : AbstractValidator<GetBookingsQuery>
{
    private static readonly string[] AllowedSortFields =
        ["startDate", "bookingNumber", "status", "createdAt"];

    public GetBookingsQueryValidator()
    {
        RuleFor(x => x.Page).ValidPage();

        RuleFor(x => x.Limit).ValidLimit();

        RuleFor(x => x.SearchQuery)
            .MaximumLength(100)
            .WithMessage("Search query cannot exceed 100 characters.")
            .When(x => x.SearchQuery != null);

        RuleFor(x => x.SortBy)
            .Must(f => AllowedSortFields.Contains(f, StringComparer.OrdinalIgnoreCase))
            .WithMessage($"SortBy must be one of: {string.Join(", ", AllowedSortFields)}.");
    }
}
