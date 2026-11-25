using FluentValidation;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Bookings.Commands;

namespace SanadPlatform.API.Features.Bookings.Validators;

/// <summary>
/// FluentValidation validator for <see cref="CreateBookingCommand"/>.
/// Category-specific rules (equipment rental dates, tier validity, minimum durations)
/// are handled by <see cref="Services.Policies.IBookingCategoryPolicy"/> in the handler;
/// this validator covers the common structural fields.
/// </summary>
public class CreateBookingCommandValidator : AbstractValidator<CreateBookingCommand>
{
    public CreateBookingCommandValidator()
    {
        RuleFor(x => x.ProviderId)
            .NotEmpty().WithMessage("ProviderId is required.");

        RuleFor(x => x.StartDate)
            .Must(d => d >= DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("Start date cannot be in the past.");

        RuleFor(x => x.EndDate)
            .GreaterThanOrEqualTo(x => x.StartDate)
            .WithMessage("End date must be on or after the start date.");

        RuleFor(x => x.DailyStartTime)
            .NotEqual(default(TimeOnly))
            .WithMessage("DailyStartTime is required.");

        RuleFor(x => x.PatientNotes)
            .ValidLargeText()
            .When(x => x.PatientNotes != null);

        RuleFor(x => x.PaymentMethod)
            .NotEmpty().WithMessage("PaymentMethod is required.")
            .Must(PaymentMethods.IsSupported)
            .WithMessage("PaymentMethod must be 'card', 'd17', or 'cash'.");

        RuleFor(x => x.PatientLocationChoice)
            .Must(v => v!.Equals("home", StringComparison.OrdinalIgnoreCase)
                || v!.Equals("provider_site", StringComparison.OrdinalIgnoreCase))
            .WithMessage("PatientLocationChoice must be 'home' or 'provider_site'.")
            .When(x => x.PatientLocationChoice is not null);

        RuleFor(x => x.TypeConfig)
            .Must(tc => tc!.Value.GetRawText().Length <= 65_536)
            .WithMessage("TypeConfig payload must not exceed 64 KB.")
            .When(x => x.TypeConfig is not null);

        RuleFor(x => x.ServiceItems)
            .NotEmpty().WithMessage("At least one service item is required.")
            .Must(items => items.Count <= 20)
            .WithMessage("A maximum of 20 service items may be selected per booking.")
            .Must(items => items.Select(item => item.ServiceId).Distinct().Count() == items.Count)
            .WithMessage("Duplicate service IDs are not allowed in the same booking.");

        RuleForEach(x => x.ServiceItems)
            .ChildRules(item =>
            {
                item.RuleFor(i => i.ServiceId)
                    .NotEmpty().WithMessage("ServiceId is required.");

                item.RuleFor(i => i.Quantity)
                    .InclusiveBetween(1, 10)
                    .WithMessage("Service item quantity must be between 1 and 10.");
            });
    }
}
