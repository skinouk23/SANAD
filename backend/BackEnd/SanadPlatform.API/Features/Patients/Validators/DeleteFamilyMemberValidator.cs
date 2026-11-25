using FluentValidation;
using SanadPlatform.API.Features.Patients.Commands;

namespace SanadPlatform.API.Features.Patients.Validators;

/// <summary>
/// Validator for DeleteFamilyMemberCommand.
/// </summary>
public class DeleteFamilyMemberValidator : AbstractValidator<DeleteFamilyMemberCommand>
{
    public DeleteFamilyMemberValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");

        RuleFor(x => x.MemberId)
            .NotEmpty().WithMessage("Member ID is required");
    }
}
