using FluentValidation;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Patients.Commands;

namespace SanadPlatform.API.Features.Patients.Validators;

/// <summary>
/// Validator for AddFamilyMemberCommand.
/// Ensures that family member data is valid before processing the command.
/// </summary>
public class AddFamilyMemberValidator : AbstractValidator<AddFamilyMemberCommand>
{
    public AddFamilyMemberValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");

        // ==================== Personal Info ====================
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .ValidName()
            .WithName("First name");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .ValidName()
            .WithName("Last name");

        RuleFor(x => x.Relationship)
            .NotEmpty().WithMessage("Relationship is required")
            .IsEnumName(typeof(RelationshipType), caseSensitive: false)
            .WithMessage("Invalid relationship type");

        RuleFor(x => x.DateOfBirth)
            .ValidBirthDate()
            .WithName("Date of birth");

        RuleFor(x => x.Gender)
            .IsEnumName(typeof(Gender), caseSensitive: false)
            .When(x => !string.IsNullOrWhiteSpace(x.Gender))
            .WithMessage("Invalid gender");

        RuleFor(x => x.Email)
            .EmailAddress()
            .When(x => !string.IsNullOrWhiteSpace(x.Email))
            .WithMessage("Invalid email address");

        // ==================== Medical Info ====================
        RuleFor(x => x.MedicalHistory)
            .ValidLargeText()
            .WithName("Medical history");

        RuleFor(x => x.Allergies)
            .ValidLargeText()
            .WithName("Allergies");

        RuleFor(x => x.CurrentMedications)
            .ValidLargeText()
            .WithName("Current medications");
    }
}
