using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Linq.Expressions;

namespace SanadPlatform.API.Infrastructure.Security;

/// <summary>
/// Entity Framework Core value converter that automatically encrypts values before saving to database
/// and decrypts them when loading from database.
/// 
/// Usage in DbContext:
/// 
/// protected override void OnModelCreating(ModelBuilder modelBuilder)
/// {
///     var encryptionService = new EncryptionService(logger, configuration);
///     var converter = new EncryptedStringConverter(encryptionService);
///     
///     modelBuilder.Entity&lt;Patient&gt;()
///         .Property(p => p.PhoneNumber)
///         .HasConversion(converter);
/// }
/// 
/// HIPAA: Protects ePHI at rest (§164.312(a)(2)(ii))
/// GDPR: Technical safeguard for personal data protection (Article 32)
/// ISO 27001: Implements A.10.2.6 Encryption of information
/// </summary>
public class EncryptedStringConverter : ValueConverter<string, string>
{
    /// <summary>
    /// Creates a new instance of the encrypted string converter.
    /// </summary>
    /// <param name="encryptionService">Service for encryption/decryption operations</param>
    /// <exception cref="ArgumentNullException">Thrown if encryptionService is null</exception>
    public EncryptedStringConverter(IEncryptionService encryptionService)
        : base(
            // Convert from domain model to database store
            plaintext => EncryptValue(plaintext, encryptionService),
            // Convert from database store to domain model
            ciphertext => DecryptValue(ciphertext, encryptionService))
    {
    }

    /// <summary>
    /// Encrypts a plaintext value for storage in the database.
    /// </summary>
    /// <param name="plaintext">The unencrypted value</param>
    /// <param name="encryptionService">Service for encryption</param>
    /// <returns>Encrypted value ready for database storage</returns>
    private static string EncryptValue(string? plaintext, IEncryptionService encryptionService)
    {
        // Null values pass through without encryption
        if (string.IsNullOrEmpty(plaintext))
        {
            return plaintext ?? string.Empty;
        }

        try
        {
            return encryptionService.Encrypt(plaintext);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException(
                $"Failed to encrypt database field value. See inner exception for details.",
                ex);
        }
    }

    /// <summary>
    /// Decrypts a ciphertext value when loading from the database.
    /// </summary>
    /// <param name="ciphertext">The encrypted value from database</param>
    /// <param name="encryptionService">Service for decryption</param>
    /// <returns>Decrypted plaintext value</returns>
    private static string DecryptValue(string? ciphertext, IEncryptionService encryptionService)
    {
        // Null values pass through without decryption
        if (string.IsNullOrEmpty(ciphertext))
        {
            return ciphertext ?? string.Empty;
        }

        try
        {
            return encryptionService.Decrypt(ciphertext);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException(
                $"Failed to decrypt database field value. This may indicate a corrupted encrypted field or key mismatch. See inner exception for details.",
                ex);
        }
    }
}

/// <summary>
/// Entity Framework Core value converter for encrypted Guid values.
/// Automatically encrypts Guid values before storing and decrypts on retrieval.
/// 
/// Use for: Encrypted identifiers, tokens, unique identifiers
/// </summary>
public class EncryptedGuidConverter : ValueConverter<Guid?, string>
{
    /// <summary>
    /// Creates a new instance of the encrypted Guid converter.
    /// </summary>
    /// <param name="encryptionService">Service for encryption/decryption operations</param>
    public EncryptedGuidConverter(IEncryptionService encryptionService)
        : base(
            // Convert from Guid? to encrypted string
            guid => EncryptGuid(guid, encryptionService),
            // Convert from encrypted string to Guid?
            ciphertext => DecryptGuid(ciphertext, encryptionService))
    {
    }

    private static string EncryptGuid(Guid? guid, IEncryptionService encryptionService)
    {
        if (guid == null || guid == Guid.Empty)
        {
            return string.Empty;
        }

        try
        {
            var guidString = guid.Value.ToString();
            return encryptionService.Encrypt(guidString);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to encrypt Guid value.", ex);
        }
    }

    private static Guid? DecryptGuid(string? ciphertext, IEncryptionService encryptionService)
    {
        if (string.IsNullOrEmpty(ciphertext))
        {
            return null;
        }

        try
        {
            var decrypted = encryptionService.Decrypt(ciphertext);
            return Guid.TryParse(decrypted, out var guid) ? guid : null;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to decrypt Guid value.", ex);
        }
    }
}

/// <summary>
/// Entity Framework Core value converter for encrypted numeric values.
/// Automatically encrypts decimal values (prices, measurements) before storing.
/// 
/// Use for: Financial amounts, medical measurements, sensitive numbers
/// </summary>
public class EncryptedDecimalConverter : ValueConverter<decimal?, string>
{
    /// <summary>
    /// Creates a new instance of the encrypted decimal converter.
    /// </summary>
    /// <param name="encryptionService">Service for encryption/decryption operations</param>
    public EncryptedDecimalConverter(IEncryptionService encryptionService)
        : base(
            // Convert from decimal? to encrypted string
            value => EncryptDecimal(value, encryptionService),
            // Convert from encrypted string to decimal?
            ciphertext => DecryptDecimal(ciphertext, encryptionService))
    {
    }

    private static string EncryptDecimal(decimal? value, IEncryptionService encryptionService)
    {
        if (value == null)
        {
            return string.Empty;
        }

        try
        {
            var valueString = value.ToString() ?? string.Empty;
            if (string.IsNullOrEmpty(valueString))
            {
                return string.Empty;
            }
            return encryptionService.Encrypt(valueString);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to encrypt decimal value.", ex);
        }
    }

    private static decimal? DecryptDecimal(string? ciphertext, IEncryptionService encryptionService)
    {
        if (string.IsNullOrEmpty(ciphertext))
        {
            return null;
        }

        try
        {
            var decrypted = encryptionService.Decrypt(ciphertext);
            return decimal.TryParse(decrypted, out var value) ? value : null;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to decrypt decimal value.", ex);
        }
    }
}

/// <summary>
/// Entity Framework Core value converter for encrypted DateTime values.
/// Automatically encrypts date/time values (appointment times, DOB) before storing.
/// 
/// Use for: Dates of birth, medical appointment times, procedure dates
/// </summary>
public class EncryptedDateTimeConverter : ValueConverter<DateTime?, string>
{
    /// <summary>
    /// Creates a new instance of the encrypted DateTime converter.
    /// </summary>
    /// <param name="encryptionService">Service for encryption/decryption operations</param>
    public EncryptedDateTimeConverter(IEncryptionService encryptionService)
        : base(
            // Convert from DateTime? to encrypted string
            dateTime => EncryptDateTime(dateTime, encryptionService),
            // Convert from encrypted string to DateTime?
            ciphertext => DecryptDateTime(ciphertext, encryptionService))
    {
    }

    private static string EncryptDateTime(DateTime? dateTime, IEncryptionService encryptionService)
    {
        if (dateTime == null)
        {
            return string.Empty;
        }

        try
        {
            var dateString = dateTime.Value.ToUniversalTime().ToString("O"); // ISO 8601 format
            return encryptionService.Encrypt(dateString);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to encrypt DateTime value.", ex);
        }
    }

    private static DateTime? DecryptDateTime(string? ciphertext, IEncryptionService encryptionService)
    {
        if (string.IsNullOrEmpty(ciphertext))
        {
            return null;
        }

        try
        {
            var decrypted = encryptionService.Decrypt(ciphertext);
            return DateTime.TryParseExact(decrypted, "O", null, System.Globalization.DateTimeStyles.RoundtripKind, out var dateTime)
                ? dateTime
                : null;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to decrypt DateTime value.", ex);
        }
    }
}

/// <summary>
/// Factory for creating appropriate value converters based on property type.
/// Centralizes converter creation and configuration.
/// </summary>
public static class EncryptedConverterFactory
{
    /// <summary>
    /// Creates an appropriate value converter for the given type.
    /// </summary>
    /// <param name="propertyType">The property type to convert</param>
    /// <param name="encryptionService">The encryption service to use</param>
    /// <returns>A configured value converter, or null if type is not supported</returns>
    public static ValueConverter? CreateConverter(Type propertyType, IEncryptionService encryptionService)
    {
        // Get the underlying type if nullable
        var underlyingType = Nullable.GetUnderlyingType(propertyType) ?? propertyType;

        return underlyingType switch
        {
            Type t when t == typeof(string) => new EncryptedStringConverter(encryptionService),
            Type t when t == typeof(Guid) => new EncryptedGuidConverter(encryptionService),
            Type t when t == typeof(decimal) => new EncryptedDecimalConverter(encryptionService),
            Type t when t == typeof(DateTime) => new EncryptedDateTimeConverter(encryptionService),
            _ => null
        };
    }
}
