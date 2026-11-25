using FluentValidation;
using SanadPlatform.API.Features.Providers.Commands;

namespace SanadPlatform.API.Features.Providers.Validators;

/// <summary>
/// Validator for <see cref="ReplaceMyProviderSchedulesCommand"/>.
/// </summary>
public class ReplaceMyProviderSchedulesCommandValidator : AbstractValidator<ReplaceMyProviderSchedulesCommand>
{
    public ReplaceMyProviderSchedulesCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleForEach(x => x.Schedules)
            .ChildRules(schedule =>
            {
                schedule.RuleFor(item => item.ServiceId)
                    .NotEqual(Guid.Empty)
                    .When(item => item.ServiceId.HasValue)
                    .WithMessage("Service ID must not be an empty GUID.");

                schedule.RuleFor(item => item.EndTime)
                    .GreaterThan(item => item.StartTime)
                    .WithMessage("Schedule end time must be later than start time.");
            });
    }
}
