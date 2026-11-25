using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace SanadPlatform.API.Infrastructure.Security;

/// <summary>
/// Service for managing encrypted field configuration in Entity Framework Core.
/// Automatically discovers fields marked with [Encrypted] attribute and configures 
/// appropriate value converters for database encryption/decryption.
/// 
/// This provides:
/// - Automatic encryption of sensitive fields at rest
/// - Transparent decryption on database retrieval
/// - Compliance with HIPAA §164.312(a)(2)(ii) (encryption of ePHI)
/// - GDPR Article 32 (technical safeguards for personal data)
/// - ISO 27001 A.10.2.6 (encryption of information)
/// </summary>
public interface IEncryptedFieldService
{
    /// <summary>
    /// Configures encryption for all properties marked with [Encrypted] attribute.
    /// Should be called in DbContext.OnModelCreating().
    /// </summary>
    /// <param name="modelBuilder">The EF Core model builder</param>
    /// <param name="entityType">The entity type to configure</param>
    void ConfigureEncryptedFields(ModelBuilder modelBuilder, Type entityType);

    /// <summary>
    /// Gets metadata about all encrypted fields in an entity.
    /// </summary>
    /// <param name="entityType">The entity type to inspect</param>
    /// <returns>Dictionary of encrypted field information</returns>
    IReadOnlyDictionary<string, EncryptedFieldMetadata> GetEncryptedFieldsMetadata(Type entityType);

    /// <summary>
    /// Validates that all encrypted fields have proper configuration.
    /// </summary>
    /// <param name="entityType">The entity type to validate</param>
    /// <returns>List of validation errors (empty if valid)</returns>
    List<string> ValidateEncryptedFieldConfiguration(Type entityType);

    /// <summary>
    /// Gets all entities in an assembly that have encrypted fields.
    /// </summary>
    /// <param name="assembly">The assembly to scan</param>
    /// <returns>List of entity types with encrypted fields</returns>
    List<Type> GetEntitiesWithEncryptedFields(Assembly assembly);
}

/// <summary>
/// Default implementation of encrypted field service.
/// </summary>
public class EncryptedFieldService : IEncryptedFieldService
{
    private readonly IEncryptionService _encryptionService;
    private readonly ILogger<EncryptedFieldService> _logger;

    public EncryptedFieldService(
        IEncryptionService encryptionService,
        ILogger<EncryptedFieldService> logger)
    {
        _encryptionService = encryptionService ?? throw new ArgumentNullException(nameof(encryptionService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Configures encryption for all properties marked with [Encrypted] attribute.
    /// </summary>
    public void ConfigureEncryptedFields(ModelBuilder modelBuilder, Type entityType)
    {
        var properties = entityType.GetProperties(
            BindingFlags.Public | BindingFlags.Instance);

        foreach (var property in properties)
        {
            var encryptedAttribute = property.GetCustomAttribute<EncryptedAttribute>();
            if (encryptedAttribute != null)
            {
                ConfigureEncryptedProperty(modelBuilder, entityType, property, encryptedAttribute);
            }

            var searchableAttribute = property.GetCustomAttribute<SearchableEncryptedAttribute>();
            if (searchableAttribute != null)
            {
                ConfigureSearchableEncryptedProperty(modelBuilder, entityType, property, searchableAttribute);
            }
        }
    }

    /// <summary>
    /// Configures a single encrypted property with value converter.
    /// </summary>
    private void ConfigureEncryptedProperty(
        ModelBuilder modelBuilder,
        Type entityType,
        PropertyInfo property,
        EncryptedAttribute attribute)
    {
        try
        {
            var converter = EncryptedConverterFactory.CreateConverter(property.PropertyType, _encryptionService);

            if (converter == null)
            {
                _logger.LogWarning(
                    "No converter found for encrypted property {Entity}.{Property} of type {Type}. " +
                    "Supported types: string, Guid, decimal, DateTime",
                    entityType.Name, property.Name, property.PropertyType.Name);
                return;
            }

            var builder = modelBuilder.Entity(entityType).Property(property.Name);
            builder.HasConversion(converter);

            if (!attribute.IsIndexable)
            {
                builder.IsUnicode(false);
            }

            _logger.LogInformation(
                "Configured encrypted property {Entity}.{Property} with {Algorithm} algorithm. " +
                "Classification: {Classification}, Indexable: {Indexable}",
                entityType.Name, property.Name, attribute.Algorithm,
                attribute.Classification, attribute.IsIndexable);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to configure encrypted property {Entity}.{Property}",
                entityType.Name, property.Name);
            throw;
        }
    }

    /// <summary>
    /// Configures a searchable encrypted property (deterministic encryption).
    /// </summary>
    private void ConfigureSearchableEncryptedProperty(
        ModelBuilder modelBuilder,
        Type entityType,
        PropertyInfo property,
        SearchableEncryptedAttribute attribute)
    {
        try
        {
            // For searchable fields, use string converter
            if (property.PropertyType == typeof(string) || 
                (Nullable.GetUnderlyingType(property.PropertyType) == typeof(string)))
            {
                var converter = new EncryptedStringConverter(_encryptionService);
                modelBuilder.Entity(entityType).Property(property.Name).HasConversion(converter);

                _logger.LogWarning(
                    "Configured searchable encrypted property {Entity}.{Property} with {Mode} mode. " +
                    "WARNING: Deterministic encryption is less secure. Only use if search is required.",
                    entityType.Name, property.Name, attribute.Mode);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to configure searchable encrypted property {Entity}.{Property}",
                entityType.Name, property.Name);
            throw;
        }
    }

    /// <summary>
    /// Gets metadata about all encrypted fields in an entity.
    /// </summary>
    public IReadOnlyDictionary<string, EncryptedFieldMetadata> GetEncryptedFieldsMetadata(Type entityType)
    {
        var metadata = new Dictionary<string, EncryptedFieldMetadata>();
        var properties = entityType.GetProperties(BindingFlags.Public | BindingFlags.Instance);

        foreach (var property in properties)
        {
            var encryptedAttribute = property.GetCustomAttribute<EncryptedAttribute>();
            if (encryptedAttribute != null)
            {
                metadata[property.Name] = new EncryptedFieldMetadata
                {
                    PropertyName = property.Name,
                    PropertyType = property.PropertyType,
                    EntityType = entityType,
                    Algorithm = encryptedAttribute.Algorithm,
                    Classification = encryptedAttribute.Classification,
                    Description = encryptedAttribute.Description,
                    IsSearchable = false,
                    RotationPriority = encryptedAttribute.RotationPriority
                };
            }

            var searchableAttribute = property.GetCustomAttribute<SearchableEncryptedAttribute>();
            if (searchableAttribute != null)
            {
                metadata[property.Name] = new EncryptedFieldMetadata
                {
                    PropertyName = property.Name,
                    PropertyType = property.PropertyType,
                    EntityType = entityType,
                    Algorithm = "AES-256-Deterministic",
                    Classification = searchableAttribute.Classification,
                    Description = searchableAttribute.Description,
                    IsSearchable = true,
                    EncryptionMode = searchableAttribute.Mode,
                    RotationPriority = 3 // Searchable fields have priority 3
                };
            }
        }

        return metadata;
    }

    /// <summary>
    /// Validates encrypted field configuration.
    /// </summary>
    public List<string> ValidateEncryptedFieldConfiguration(Type entityType)
    {
        var errors = new List<string>();
        var metadata = GetEncryptedFieldsMetadata(entityType);

        if (metadata.Count == 0)
        {
            _logger.LogInformation("Entity {Entity} has no encrypted fields", entityType.Name);
            return errors;
        }

        foreach (var field in metadata.Values)
        {
            // Validate field type is supported
            var underlyingType = Nullable.GetUnderlyingType(field.PropertyType) ?? field.PropertyType;
            if (underlyingType != typeof(string) && 
                underlyingType != typeof(Guid) &&
                underlyingType != typeof(decimal) &&
                underlyingType != typeof(DateTime))
            {
                errors.Add($"{field.EntityType.Name}.{field.PropertyName} has unsupported type {field.PropertyType.Name}");
            }

            // Validate searchable fields
            if (field.IsSearchable && field.PropertyType != typeof(string))
            {
                errors.Add($"{field.EntityType.Name}.{field.PropertyName} is marked searchable but is not a string");
            }

            // Validate classification
            if (field.Classification < DataClassification.Sensitive)
            {
                _logger.LogWarning(
                    "Encrypted field {Entity}.{Property} has low classification ({Classification}). " +
                    "Consider if encryption is necessary.",
                    field.EntityType.Name, field.PropertyName, field.Classification);
            }
        }

        return errors;
    }

    /// <summary>
    /// Gets all entities in an assembly that have encrypted fields.
    /// </summary>
    public List<Type> GetEntitiesWithEncryptedFields(Assembly assembly)
    {
        var entityTypes = new List<Type>();

        foreach (var type in assembly.GetTypes())
        {
            if (type.IsAbstract || type.IsInterface)
                continue;

            var hasEncryptedFields = type.GetProperties()
                .Any(p => p.GetCustomAttribute<EncryptedAttribute>() != null ||
                          p.GetCustomAttribute<SearchableEncryptedAttribute>() != null);

            if (hasEncryptedFields)
            {
                entityTypes.Add(type);
            }
        }

        return entityTypes;
    }
}

/// <summary>
/// Metadata about an encrypted field for audit and compliance purposes.
/// </summary>
public class EncryptedFieldMetadata
{
    /// <summary>
    /// Gets or sets the property name
    /// </summary>
    public string PropertyName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the property type
    /// </summary>
    public Type PropertyType { get; set; } = typeof(object);

    /// <summary>
    /// Gets or sets the entity type
    /// </summary>
    public Type EntityType { get; set; } = typeof(object);

    /// <summary>
    /// Gets or sets the encryption algorithm
    /// </summary>
    public string Algorithm { get; set; } = "AES-256-GCM";

    /// <summary>
    /// Gets or sets the data classification level
    /// </summary>
    public DataClassification Classification { get; set; } = DataClassification.Sensitive;

    /// <summary>
    /// Gets or sets the field description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Gets or sets whether field is searchable
    /// </summary>
    public bool IsSearchable { get; set; }

    /// <summary>
    /// Gets or sets the encryption mode (for searchable fields)
    /// </summary>
    public EncryptionMode EncryptionMode { get; set; }

    /// <summary>
    /// Gets or sets the rotation priority
    /// </summary>
    public int RotationPriority { get; set; }
}
