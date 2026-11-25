using FluentValidation;
using SanadPlatform.API.Features.Equipment.Queries;

namespace SanadPlatform.API.Features.Equipment.Validators;

/// <summary>
/// Validator for <see cref="GetEquipmentDetailQuery"/>.
/// </summary>
public class GetEquipmentDetailQueryValidator : AbstractValidator<GetEquipmentDetailQuery>
{
    public GetEquipmentDetailQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Equipment ID is required.");
    }
}