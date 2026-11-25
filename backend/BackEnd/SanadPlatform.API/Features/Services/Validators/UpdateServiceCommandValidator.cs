using FluentValidation;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Services.Commands;

namespace SanadPlatform.API.Features.Services.Validators;

/// <summary>
/// Validator for <see cref="UpdateServiceCommand"/>.
/// All fields are optional (partial update), but validated when present.
/// </summary>
public class UpdateServiceCommandValidator : AbstractValidator<UpdateServiceCommand>
{
    /// <summary>
    /// Initializes validation rules for service updates (partial update support).
    /// </summary>
    public UpdateServiceCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.");

        RuleFor(x => x.ServiceId)
            .NotEmpty().WithMessage("Service ID is required.");

        // ==================== Basic Info ====================

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Service name cannot be empty when provided.")
            .MaximumLength(200).WithMessage("Service name must not exceed 200 characters.")
            .When(x => x.Name is not null);

        RuleFor(x => x.Description)
            .ValidLargeText()
            .When(x => x.Description is not null);

        RuleFor(x => x.ShortDescription)
            .MaximumLength(500).WithMessage("Short description must not exceed 500 characters.")
            .When(x => x.ShortDescription is not null);

        // ==================== Pricing ====================

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price must be zero or positive.")
            .When(x => x.Price.HasValue);

        RuleFor(x => x.PriceType)
            .Must(pt => pt is "fixed" or "hourly" or "range" or "starting_from")
            .WithMessage("Price type must be one of: fixed, hourly, range, starting_from.")
            .When(x => x.PriceType is not null);

        RuleFor(x => x.Currency)
            .Length(3).WithMessage("Currency must be a 3-letter code.")
            .When(x => x.Currency is not null);

        RuleFor(x => x.MinPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Minimum price must be zero or positive.")
            .When(x => x.MinPrice.HasValue);

        RuleFor(x => x.MaxPrice)
            .GreaterThanOrEqualTo(0).WithMessage("Maximum price must be zero or positive.")
            .GreaterThanOrEqualTo(x => x.MinPrice ?? 0)
            .WithMessage("Maximum price must be greater than or equal to minimum price.")
            .When(x => x.MaxPrice.HasValue);

        // ==================== Duration ====================

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0).WithMessage("Duration must be positive.")
            .When(x => x.DurationMinutes.HasValue);

        RuleFor(x => x.MinDurationMinutes)
            .GreaterThan(0).WithMessage("Minimum duration must be positive.")
            .When(x => x.MinDurationMinutes.HasValue);

        RuleFor(x => x.MaxDurationMinutes)
            .GreaterThan(0).WithMessage("Maximum duration must be positive.")
            .GreaterThanOrEqualTo(x => x.MinDurationMinutes ?? 0)
            .WithMessage("Maximum duration must be greater than or equal to minimum duration.")
            .When(x => x.MaxDurationMinutes.HasValue);

        // ==================== Location ====================

        RuleFor(x => x.ServiceLocation)
            .Must(sl => sl is "home" or "clinic" or "both" or "online")
            .WithMessage("Service location must be one of: home, clinic, both, online.")
            .When(x => x.ServiceLocation is not null);

        // ==================== Age Restrictions ====================

        RuleFor(x => x.AgeRestrictionMin)
            .InclusiveBetween(0, 150).WithMessage("Minimum age must be between 0 and 150.")
            .When(x => x.AgeRestrictionMin.HasValue);

        RuleFor(x => x.AgeRestrictionMax)
            .InclusiveBetween(0, 150).WithMessage("Maximum age must be between 0 and 150.")
            .GreaterThanOrEqualTo(x => x.AgeRestrictionMin ?? 0)
            .WithMessage("Maximum age must be greater than or equal to minimum age.")
            .When(x => x.AgeRestrictionMax.HasValue);

        // ==================== Type Config ====================

        RuleFor(x => x.TypeConfig)
            .Must(tc => tc!.Value.ValueKind == System.Text.Json.JsonValueKind.Object)
            .WithMessage("TypeConfig must be a JSON object, not a string or other primitive.")
            .Must(tc => tc!.Value.GetRawText().Length <= 65_536)
            .WithMessage("TypeConfig payload must not exceed 64 KB.")
            .When(x => x.TypeConfig is not null);

        // ==================== Sub-Services ====================

        RuleFor(x => x.SubServices)
            .Must(subs => subs!.Count <= 50)
            .WithMessage("A service can have at most 50 sub-services.")
            .When(x => x.SubServices is not null);

        RuleFor(x => x.SubServices)
            .Must(subs =>
            {
                var ids = subs!
                    .Where(s => s.Id.HasValue)
                    .Select(s => s.Id!.Value)
                    .ToList();
                return ids.Count == ids.Distinct().Count();
            })
            .WithMessage("Duplicate sub-service IDs are not allowed.")
            .When(x => x.SubServices is not null);

        RuleForEach(x => x.SubServices)
            .SetValidator(new SubServiceRequestValidator())
            .When(x => x.SubServices is not null);
    }
}
