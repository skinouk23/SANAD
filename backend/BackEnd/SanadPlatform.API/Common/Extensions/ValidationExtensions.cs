using System.Text.Json;
using FluentValidation;

namespace SanadPlatform.API.Common.Extensions;

/// <summary>
/// Extension methods for FluentValidation to enforce consistent validation rules across the application.
/// </summary>
public static class ValidationExtensions
{
    // Centralized Regex for Names (supports international chars including accents)
    private const string NameRegex = @"^[a-zA-Z\s\-'.éèêëàâäùûüôöçñ]+$";

    // E.164 format for international phone numbers
    private const string PhoneRegex = @"^\+?[1-9]\d{1,14}$";

    /// <summary>
    /// Validates that a string is a valid name (letters, spaces, hyphens, apostrophes, accents).
    /// </summary>
    /// <remarks>
    /// Accepts string? to support both required (string) and optional (string?) properties.
    /// If the value is null, validation is skipped (use .NotNull() beforehand if required).
    /// </remarks>
    public static IRuleBuilderOptions<T, string?> ValidName<T>(this IRuleBuilder<T, string?> ruleBuilder)
    {
        return ruleBuilder
            .Matches(NameRegex).WithMessage("Name contains invalid characters")
            .Length(2, 100).WithMessage("Name must be between 2 and 100 characters");
    }

    /// <summary>
    /// Validates that a string is a valid E.164 phone number.
    /// </summary>
    public static IRuleBuilderOptions<T, string?> ValidPhoneNumber<T>(this IRuleBuilder<T, string?> ruleBuilder)
    {
        return ruleBuilder
            .Matches(PhoneRegex).WithMessage("Invalid phone number format. Please use international format (e.g. +21612345678).");
    }

    /// <summary>
    /// Validates that a password meets the platform's minimum complexity requirements.
    /// </summary>
    public static IRuleBuilderOptions<T, string> StrongPassword<T>(this IRuleBuilder<T, string> ruleBuilder)
    {
        return ruleBuilder
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long")
            .Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter")
            .Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter")
            .Matches(@"[0-9]").WithMessage("Password must contain at least one digit")
            .Matches(@"[!@#$%^&*]").WithMessage("Password must contain at least one special character (!@#$%^&*)");
    }

    /// <summary>
    /// Validates that a date of birth is not in the future and represents a reasonable age (0-120).
    /// </summary>
    public static IRuleBuilderOptions<T, DateOnly?> ValidBirthDate<T>(this IRuleBuilder<T, DateOnly?> ruleBuilder)
    {
        return ruleBuilder
            .Must(date => !date.HasValue || date.Value <= DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("Date of birth cannot be in the future")
            .Must(BeValidAge)
            .WithMessage("Age must be between 0 and 120 years");
    }

    /// <summary>
    /// Validates that a string does not exceed the standard length for large text fields (2000 chars).
    /// </summary>
    public static IRuleBuilderOptions<T, string?> ValidLargeText<T>(this IRuleBuilder<T, string?> ruleBuilder)
    {
        return ruleBuilder.MaximumLength(2000).WithMessage("Text must not exceed 2000 characters");
    }

    /// <summary>
    /// Validates that a string does not exceed the standard length for medium text fields (1000 chars).
    /// </summary>
    public static IRuleBuilderOptions<T, string?> ValidMediumText<T>(this IRuleBuilder<T, string?> ruleBuilder)
    {
        return ruleBuilder.MaximumLength(1000).WithMessage("Text must not exceed 1000 characters");
    }

    /// <summary>
    /// Validates that a page number is at least 1.
    /// </summary>
    public static IRuleBuilderOptions<T, int> ValidPage<T>(this IRuleBuilder<T, int> ruleBuilder)
    {
        return ruleBuilder
            .GreaterThanOrEqualTo(1)
            .WithMessage("Page must be at least 1.");
    }

    /// <summary>
    /// Validates that a limit (page size) is between 1 and <paramref name="max"/>.
    /// </summary>
    public static IRuleBuilderOptions<T, int> ValidLimit<T>(
        this IRuleBuilder<T, int> ruleBuilder,
        int max = 100)
    {
        return ruleBuilder
            .InclusiveBetween(1, max)
            .WithMessage($"Limit must be between 1 and {max}.");
    }

    /// <summary>
    /// Validates that a string is well-formed JSON and does not exceed <paramref name="maxLength"/> characters.
    /// Null or whitespace-only values are accepted (use <c>.NotNull()</c> beforehand if the field is required).
    /// </summary>
    public static IRuleBuilderOptions<T, string?> ValidJson<T>(
        this IRuleBuilder<T, string?> ruleBuilder,
        int maxLength = 10_000)
    {
        return ruleBuilder
            .MaximumLength(maxLength)
            .WithMessage($"JSON content must not exceed {maxLength:N0} characters.")
            .Must(value =>
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    return true;
                }

                try
                {
                    using var doc = JsonDocument.Parse(value);
                    return true;
                }
                catch (JsonException)
                {
                    return false;
                }
            })
            .WithMessage("Type configuration must be valid JSON.");
    }

    private static bool BeValidAge(DateOnly? dateOfBirth)
    {
        if (!dateOfBirth.HasValue)
        {
            return true;
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // Calculate age
        var age = today.Year - dateOfBirth.Value.Year;

        // Adjust for leap years/incomplete years
        if (dateOfBirth.Value > today.AddYears(-age))
        {
            age--;
        }

        return age >= 0 && age <= 120;
    }
}
