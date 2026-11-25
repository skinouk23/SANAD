using System;

namespace SanadPlatform.API.Infrastructure.Security;

/// <summary>
/// Marks a property as requiring encryption when stored in the database.
/// Entity Framework Core will automatically encrypt/decrypt values with this attribute.
/// 
/// HIPAA Compliance: Protects PHI (Protected Health Information) at rest
/// GDPR Compliance: Implements technical measures for data protection (Article 32)
/// ISO 27001 Compliance: A.10.2.6 Encryption of information
/// </summary>
[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
public class EncryptedAttribute : Attribute
{
    /// <summary>
    /// Gets or sets the encryption algorithm to use.
    /// Default: AES-256-GCM (recommended)
    /// </summary>
    public string Algorithm { get; set; } = "AES-256-GCM";

    /// <summary>
    /// Gets or sets whether this field should be indexed.
    /// Note: Cannot create normal indexes on encrypted fields.
    /// Use encrypted deterministic fields with SearchableEncryptedAttribute instead.
    /// </summary>
    public bool IsIndexable { get; set; } = false;

    /// <summary>
    /// Gets or sets the priority for encryption key rotation.
    /// Higher values = higher priority
    /// Used when planning key rotation strategy
    /// </summary>
    public int RotationPriority { get; set; } = 5;

    /// <summary>
    /// Gets or sets data classification level (for audit purposes)
    /// </summary>
    public DataClassification Classification { get; set; } = DataClassification.Sensitive;

    /// <summary>
    /// Gets or sets the field description for audit/compliance logging
    /// </summary>
    public string? Description { get; set; }
}

/// <summary>
/// Marks a property as requiring searchable encryption (deterministic).
/// Uses AES-256 in deterministic mode to allow equality searches.
/// WARNING: Deterministic encryption is less secure than randomized encryption.
/// Only use for fields that MUST be searchable.
/// 
/// Trade-off: Security vs Searchability
/// Use for: Email, Phone, SSN, Patient ID (fields that need to be searched)
/// Don't use for: Medical records, diagnosis, sensitive notes (not searchable)
/// </summary>
[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
public class SearchableEncryptedAttribute : Attribute
{
    /// <summary>
    /// Gets or sets the encryption mode.
    /// Deterministic encryption allows equality comparisons but is less secure.
    /// </summary>
    public EncryptionMode Mode { get; set; } = EncryptionMode.Deterministic;

    /// <summary>
    /// Gets or sets data classification level
    /// </summary>
    public DataClassification Classification { get; set; } = DataClassification.Sensitive;

    /// <summary>
    /// Gets or sets the field description
    /// </summary>
    public string? Description { get; set; }
}

/// <summary>
/// Encryption modes for database fields
/// </summary>
public enum EncryptionMode
{
    /// <summary>
    /// Randomized encryption (AES-256-GCM) - Most secure, not searchable
    /// Each encryption produces different ciphertext for same plaintext
    /// </summary>
    Randomized = 0,

    /// <summary>
    /// Deterministic encryption (AES-256-ECB) - Less secure, searchable
    /// Same plaintext always produces same ciphertext
    /// WARNING: Vulnerable to pattern analysis attacks
    /// Only use for fields that MUST be searchable (email, phone, SSN)
    /// </summary>
    Deterministic = 1
}

/// <summary>
/// Data classification levels for HIPAA/GDPR/ISO 27001 compliance tracking
/// </summary>
public enum DataClassification
{
    /// <summary>Public information - No encryption required</summary>
    Public = 0,

    /// <summary>Internal information - No encryption required</summary>
    Internal = 1,

    /// <summary>Sensitive information - Encryption recommended</summary>
    Sensitive = 2,

    /// <summary>Confidential/PHI (Protected Health Information) - Encryption required</summary>
    Confidential = 3,

    /// <summary>Critical/PII (Personally Identifiable Information) - Encryption required</summary>
    Critical = 4
}

/// <summary>
/// Examples of field classification for healthcare system:
/// 
/// PUBLIC: Appointment status, opening hours, general clinic info
/// 
/// INTERNAL: Staff schedules, internal notes (without PHI)
/// 
/// SENSITIVE: Patient age, gender, appointment reason
/// 
/// CONFIDENTIAL (PHI): 
/// - Patient names
/// - Medical history
/// - Diagnoses
/// - Medications
/// - Test results
/// - Insurance information
/// 
/// CRITICAL (PII):
/// - SSN/ID numbers
/// - Phone numbers
/// - Email addresses
/// - Home addresses
/// - Payment card information
/// 
/// HIPAA Rule §164.304(b)(1): Identify and document all systems that store, process, or transmit ePHI
/// GDPR Article 32: Implement appropriate technical and organizational measures
/// ISO 27001 A.10.2.6: Encryption of sensitive information at rest and in transit
/// </summary>
public static class ClassificationExamples { }
