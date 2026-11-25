using FluentValidation;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Extensions;
using SanadPlatform.API.Features.Authentication.Commands;

namespace SanadPlatform.API.Features.Authentication.Validators;

/// <summary>
/// Validator for RegisterUserCommand record.
/// Rules are applied directly to record properties to ensure clean error keys.
/// </summary>
public class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
{
    private static readonly HashSet<string> CanonicalProviderServiceTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        ServiceCategories.Nursing,
        ServiceCategories.ElderlyCare,
        ServiceCategories.Physiotherapy,
        ServiceCategories.Doctor,
        ServiceCategories.Maternity,
        ServiceCategories.NightCare,
        ServiceCategories.Psychology,
        ServiceCategories.ChronicCare,
        ServiceCategories.Laboratory,
        ServiceCategories.Radiology,
        ServiceCategories.Ambulance,
        ServiceCategories.Nutrition,
        ServiceCategories.EquipmentRental,
        ServiceCategories.Gym,
        ServiceCategories.Checkup,
        ServiceCategories.MedicalCompanion,
        ServiceCategories.Babysitting,
        ServiceCategories.Pharmacy,
        ServiceCategories.Funeral,
        ServiceCategories.Veterinary
    };

    public RegisterUserCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email must be a valid email address")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .StrongPassword();

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .ValidName();

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .ValidName();

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone number is required")
            .ValidPhoneNumber();

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(100);

        RuleFor(x => x.Address)
            .MaximumLength(250)
            .When(x => IsProviderRegistration(x) && x.Address != null)
            .WithMessage("Address must not exceed 250 characters");

        RuleFor(x => x.Role)
            .NotEmpty().WithMessage("Role is required")
            .Must(r => string.Equals(r, "patient", StringComparison.OrdinalIgnoreCase)
                    || string.Equals(r, "provider", StringComparison.OrdinalIgnoreCase))
            .WithMessage("Role must be either 'patient' or 'provider'");

        RuleFor(x => x.ServiceType)
            .NotEmpty()
            .When(IsProviderRegistration)
            .WithMessage("Service type is required for providers");

        RuleFor(x => x.ServiceType)
            .MaximumLength(100)
            .When(x => x.ServiceType != null)
            .WithMessage("Service type must not exceed 100 characters");

        RuleFor(x => x.ServiceType)
            .Must(BeCanonicalServiceType)
            .When(x => IsProviderRegistration(x) && !string.IsNullOrWhiteSpace(x.ServiceType))
            .WithMessage("Service type must use a canonical provider category code");

        RuleFor(x => x.NutritionProviderSubtype)
            .NotEmpty()
            .When(IsNutritionProviderRegistration)
            .WithMessage("Nutrition provider subtype is required when service type is 'nutrition'");

        RuleFor(x => x.NutritionProviderSubtype)
            .Must(BeValidNutritionProviderSubtype)
            .When(x => IsNutritionProviderRegistration(x) && !string.IsNullOrWhiteSpace(x.NutritionProviderSubtype))
            .WithMessage("Nutrition provider subtype must be one of: Restaurant, Chef, Nutritionist");

        RuleFor(x => x.NutritionProviderSubtype)
            .Empty()
            .When(x => !IsNutritionProviderRegistration(x) && !string.IsNullOrWhiteSpace(x.NutritionProviderSubtype))
            .WithMessage("Nutrition provider subtype can only be supplied when service type is 'nutrition'");

        RuleFor(x => x.CountryCode)
            .Matches(@"^[A-Z]{2}$").When(x => x.CountryCode != null)
            .WithMessage("Country code must be a valid ISO 3166-1 alpha-2 code (e.g. TN, FR, US)");

        RuleFor(x => x.DeviceFingerprint)
            .MaximumLength(255)
            .When(x => x.DeviceFingerprint != null)
            .WithMessage("Device fingerprint must not exceed 255 characters");

        RuleFor(x => x.ProviderApplicationId)
            .NotEmpty()
            .When(IsProviderRegistration)
            .WithMessage("Provider signup upload application ID is required for provider registration");

        RuleFor(x => x.ProviderDocuments)
            .NotEmpty()
            .When(IsProviderRegistration)
            .WithMessage("Provider approval documents are required for provider registration");

        RuleForEach(x => x.ProviderDocuments)
            .ChildRules(document =>
            {
                document.RuleFor(x => x.DocumentType)
                    .NotEmpty().WithMessage("Provider document type is required")
                    .MaximumLength(100).WithMessage("Provider document type must not exceed 100 characters");

                document.RuleFor(x => x)
                    .Must(x => x.FileId.HasValue && x.FileId.Value != Guid.Empty)
                    .WithMessage("Provider document must reference a completed file ID");

                document.RuleFor(x => x.ApplicationId)
                    .NotEmpty()
                    .When(x => x.ApplicationId.HasValue)
                    .WithMessage("Provider document application ID must not be empty when provided");

                document.RuleFor(x => x.DocumentName)
                    .MaximumLength(200)
                    .When(x => x.DocumentName != null)
                    .WithMessage("Provider document name must not exceed 200 characters");

                document.RuleFor(x => x.FileSizeBytes)
                    .GreaterThan(0)
                    .When(x => x.FileSizeBytes.HasValue)
                    .WithMessage("Provider document file size must be greater than 0");

                document.RuleFor(x => x.MimeType)
                    .MaximumLength(100)
                    .When(x => x.MimeType != null)
                    .WithMessage("Provider document MIME type must not exceed 100 characters");
            })
            .When(IsProviderRegistration);

        RuleFor(x => x.ProviderDocuments)
            .Must(documents => documents.Count <= 20)
            .When(IsProviderRegistration)
            .WithMessage("Provider registration cannot include more than 20 approval documents");
    }

    private static bool IsProviderRegistration(RegisterUserCommand command)
    {
        return string.Equals(command.Role, "provider", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsNutritionProviderRegistration(RegisterUserCommand command)
    {
        return IsProviderRegistration(command)
            && string.Equals(
                command.ServiceType?.Trim(),
                ServiceCategories.Nutrition,
                StringComparison.OrdinalIgnoreCase);
    }

    private static bool BeCanonicalServiceType(string? serviceType)
    {
        return !string.IsNullOrWhiteSpace(serviceType)
            && CanonicalProviderServiceTypes.Contains(serviceType.Trim());
    }

    private static bool BeValidNutritionProviderSubtype(string? nutritionProviderSubtype)
    {
        return !string.IsNullOrWhiteSpace(nutritionProviderSubtype)
            && Enum.TryParse<NutritionProviderSubtype>(
                nutritionProviderSubtype.Trim(),
                ignoreCase: true,
                out _);
    }
}

/// <summary>
/// Validator for LoginUserCommand record.
/// </summary>
public class LoginUserCommandValidator : AbstractValidator<LoginUserCommand>
{
    public LoginUserCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email must be a valid email address");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required");

        RuleFor(x => x.DeviceFingerprint)
            .MaximumLength(255)
            .When(x => x.DeviceFingerprint != null)
            .WithMessage("Device fingerprint must not exceed 255 characters");
    }
}

/// <summary>
/// Validator for RequestLoginOtpCommand record.
/// </summary>
public class RequestLoginOtpCommandValidator : AbstractValidator<RequestLoginOtpCommand>
{
    public RequestLoginOtpCommandValidator()
    {
        RuleFor(x => x.Channel)
            .NotEmpty().WithMessage("OTP channel is required")
            .Must(channel => string.Equals(channel, "email", StringComparison.OrdinalIgnoreCase)
                || string.Equals(channel, "sms", StringComparison.OrdinalIgnoreCase))
            .WithMessage("OTP channel must be either 'email' or 'sms'");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email must be a valid email address")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters")
            .When(x => string.Equals(x.Channel, "email", StringComparison.OrdinalIgnoreCase));

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .MaximumLength(32).WithMessage("Phone number must not exceed 32 characters")
            .When(x => string.Equals(x.Channel, "sms", StringComparison.OrdinalIgnoreCase));

        RuleFor(x => x.DeviceFingerprint)
            .MaximumLength(255)
            .When(x => x.DeviceFingerprint != null)
            .WithMessage("Device fingerprint must not exceed 255 characters");
    }
}

/// <summary>
/// Validator for VerifyLoginOtpCommand record.
/// </summary>
public class VerifyLoginOtpCommandValidator : AbstractValidator<VerifyLoginOtpCommand>
{
    public VerifyLoginOtpCommandValidator()
    {
        RuleFor(x => x.ChallengeId)
            .NotEmpty().WithMessage("OTP challenge is required");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("OTP code is required")
            .Matches(@"^\d{6}$").WithMessage("OTP code must be exactly 6 digits");

        RuleFor(x => x.DeviceFingerprint)
            .MaximumLength(255)
            .When(x => x.DeviceFingerprint != null)
            .WithMessage("Device fingerprint must not exceed 255 characters");
    }
}

/// <summary>
/// Validator for RefreshTokenCommand record.
/// </summary>
public class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage("Refresh token is required");

        RuleFor(x => x.DeviceFingerprint)
            .MaximumLength(255)
            .When(x => x.DeviceFingerprint != null)
            .WithMessage("Device fingerprint must not exceed 255 characters");
    }
}

/// <summary>
/// Validator for LogoutUserCommand record.
/// </summary>
public class LogoutUserCommandValidator : AbstractValidator<LogoutUserCommand>
{
    public LogoutUserCommandValidator()
    {
        RuleFor(x => x.RefreshToken)
            .MaximumLength(4096)
            .When(x => x.RefreshToken != null)
            .WithMessage("Refresh token must not exceed 4096 characters");
    }
}

/// <summary>
/// Validator for ChangePasswordCommand record.
/// </summary>
public class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordCommandValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage("Current password is required");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required");

        RuleFor(x => x.NewPassword)
            .StrongPassword()
            .When(x => !string.IsNullOrWhiteSpace(x.NewPassword));

        RuleFor(x => x.NewPassword)
            .Must((command, newPassword) =>
                !string.Equals(command.CurrentPassword, newPassword, StringComparison.Ordinal))
            .When(x => !string.IsNullOrWhiteSpace(x.CurrentPassword) && !string.IsNullOrWhiteSpace(x.NewPassword))
            .WithMessage("New password must be different from the current password");
    }
}

/// <summary>
/// Validator for DeleteAccountCommand record.
/// </summary>
public class DeleteAccountCommandValidator : AbstractValidator<DeleteAccountCommand>
{
    public DeleteAccountCommandValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage("Current password is required");
    }
}
