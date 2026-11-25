using FluentValidation;
using SanadPlatform.API.Features.Patients.Commands;

namespace SanadPlatform.API.Features.Patients.Validators;

/// <summary>
/// Validator for UpdatePatientPreferencesCommand.
/// Validates the nested request data within the MediatR command.
/// </summary>
public class UpdatePatientPreferencesValidator : AbstractValidator<UpdatePatientPreferencesCommand>
{
    public UpdatePatientPreferencesValidator()
    {
        // If enabling auto-validation, a reminder time must be provided
        RuleFor(x => x.ValidationReminderHours)
            .NotNull()
            .When(x => x.AutoValidationEnabled == true)
            .WithMessage("ValidationReminderHours is required when enabling AutoValidation.");

        RuleFor(x => x.ValidationReminderHours)
            .InclusiveBetween(1, 168) // 1 hour to 1 week
            .When(x => x.ValidationReminderHours.HasValue)
            .WithMessage("Validation reminder must be between 1 and 168 hours (1 week)");
    }
}
