using FluentValidation;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Patients.Commands;

namespace SanadPlatform.API.Features.Patients.Validators;

/// <summary>
/// Validator for UpdatePatientProfileCommand.
/// Validates the nested request data within the MediatR command.
/// </summary>
public class UpdatePatientProfileValidator : AbstractValidator<UpdatePatientProfileCommand>
{
    public UpdatePatientProfileValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");

        RuleFor(x => x.FirstName)
            .ValidName()
            .When(x => !string.IsNullOrWhiteSpace(x.FirstName))
            .WithName("First name");

        RuleFor(x => x.LastName)
            .ValidName()
            .When(x => !string.IsNullOrWhiteSpace(x.LastName))
            .WithName("Last name");

        RuleFor(x => x.DateOfBirth)
            .ValidBirthDate()
            .WithName("Date of birth");

        RuleFor(x => x.Gender)
            .IsEnumName(typeof(Gender), caseSensitive: false)
            .When(x => !string.IsNullOrWhiteSpace(x.Gender))
            .WithMessage("Invalid gender");

        RuleFor(x => x.EmergencyContactPhone)
            .ValidPhoneNumber()
            .When(x => !string.IsNullOrWhiteSpace(x.EmergencyContactPhone))
            .WithName("Emergency contact phone");

        RuleFor(x => x.Latitude)
            .NotNull()
            .When(x => x.Longitude.HasValue && !x.Latitude.HasValue)
            .WithMessage("Latitude is required when longitude is supplied");

        RuleFor(x => x.Longitude)
            .NotNull()
            .When(x => x.Latitude.HasValue && !x.Longitude.HasValue)
            .WithMessage("Longitude is required when latitude is supplied");

        RuleFor(x => x.Latitude)
            .InclusiveBetween(-90m, 90m)
            .When(x => x.Latitude.HasValue)
            .WithMessage("Latitude must be between -90 and 90");

        RuleFor(x => x.Longitude)
            .InclusiveBetween(-180m, 180m)
            .When(x => x.Longitude.HasValue)
            .WithMessage("Longitude must be between -180 and 180");

        RuleFor(x => x.MedicalHistory)
            .ValidLargeText()
            .When(x => x.MedicalHistory != null)
            .WithName("Medical history");

        RuleFor(x => x.Allergies)
            .ValidLargeText()
            .When(x => x.Allergies != null)
            .WithName("Allergies");

        RuleFor(x => x.CurrentMedications)
            .ValidLargeText()
            .When(x => x.CurrentMedications != null)
            .WithName("Current medications");
    }
}
