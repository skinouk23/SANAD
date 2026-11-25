using System.Reflection;
using System.Text.Json;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.ProviderFinance;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Services.Helpers;
using SanadPlatform.API.Features.Services.Services.Policies;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Services.Commands;

/// <summary>
/// Command to create a provider service preset for a canonical provider category.
/// </summary>
public record CreateProviderServicePresetCommand(
    string ProviderCategory,
    string Code,
    string NameEn,
    string NameFr,
    string? NameAr,
    string? NameDe,
    string? DescriptionEn,
    string? DescriptionFr,
    string? DescriptionAr,
    string? DescriptionDe,
    decimal Price,
    string PriceType,
    string Currency,
    int? DurationMinutes,
    string ServiceLocation,
    bool RequiresPrescription,
    bool IsUrgent,
    bool RequiresMedicalHistory,
    JsonElement? TypeConfig,
    bool IsActive,
    int DisplayOrder) : IRequest<AdminProviderServicePresetResponse>;

/// <summary>
/// Handles <see cref="CreateProviderServicePresetCommand"/>.
/// </summary>
public class CreateProviderServicePresetHandler
    : IRequestHandler<CreateProviderServicePresetCommand, AdminProviderServicePresetResponse>
{
    private readonly SanadDbContext _db;
    private readonly ServiceCategoryPolicyRegistry _policyRegistry;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CreateProviderServicePresetHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="CreateProviderServicePresetHandler"/> class.
    /// </summary>
    public CreateProviderServicePresetHandler(
        SanadDbContext db,
        ServiceCategoryPolicyRegistry policyRegistry,
        IUnitOfWork unitOfWork,
        IMemoryCache cache,
        ILogger<CreateProviderServicePresetHandler> logger)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _policyRegistry = policyRegistry ?? throw new ArgumentNullException(nameof(policyRegistry));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Creates a new preset after category validation, uniqueness checks, and policy normalization.
    /// </summary>
    public async Task<AdminProviderServicePresetResponse> Handle(
        CreateProviderServicePresetCommand command,
        CancellationToken cancellationToken)
    {
        var providerCategory = ProviderServicePresetCommandSupport.NormalizeProviderCategory(command.ProviderCategory);
        ProviderServicePresetCommandSupport.EnsureCanonicalProviderCategory(providerCategory);

        var code = ProviderServicePresetCommandSupport.NormalizeCode(command.Code);
        var priceType = ProviderServicePresetCommandSupport.NormalizeLowerInvariant(command.PriceType);
        var serviceLocation = ProviderServicePresetCommandSupport.NormalizeLowerInvariant(command.ServiceLocation);

        var exists = await _db.ProviderServicePresets
            .AnyAsync(
                preset => preset.ProviderCategory == providerCategory && preset.Code == code,
                cancellationToken);

        if (exists)
        {
            throw new InvalidOperationException("A preset with this category and code already exists.");
        }

        var typeConfig = _policyRegistry.Resolve(providerCategory).ValidateAndNormalize(
            new ServiceCategoryContext(
                providerCategory,
                command.Price,
                priceType,
                serviceLocation,
                command.TypeConfig));

        var preset = new ProviderServicePreset
        {
            ProviderCategory = providerCategory,
            Code = code,
            NameEn = ProviderServicePresetCommandSupport.NormalizeRequiredText(command.NameEn),
            NameFr = ProviderServicePresetCommandSupport.NormalizeRequiredText(command.NameFr),
            NameAr = ProviderServicePresetCommandSupport.NormalizeOptionalText(command.NameAr),
            NameDe = ProviderServicePresetCommandSupport.NormalizeOptionalText(command.NameDe),
            DescriptionEn = ProviderServicePresetCommandSupport.NormalizeOptionalText(command.DescriptionEn),
            DescriptionFr = ProviderServicePresetCommandSupport.NormalizeOptionalText(command.DescriptionFr),
            DescriptionAr = ProviderServicePresetCommandSupport.NormalizeOptionalText(command.DescriptionAr),
            DescriptionDe = ProviderServicePresetCommandSupport.NormalizeOptionalText(command.DescriptionDe),
            Price = command.Price,
            PriceType = priceType,
            Currency = ProviderFinanceConstants.DefaultCurrency,
            DurationMinutes = command.DurationMinutes,
            ServiceLocation = serviceLocation,
            RequiresPrescription = command.RequiresPrescription,
            IsUrgent = command.IsUrgent,
            RequiresMedicalHistory = command.RequiresMedicalHistory,
            TypeConfig = typeConfig,
            IsActive = command.IsActive,
            DisplayOrder = command.DisplayOrder
        };

        await _db.ProviderServicePresets.AddAsync(preset, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        ProviderPresetCacheHelper.InvalidateCategory(_cache, preset.ProviderCategory);

        _logger.LogInformation(
            "Admin created provider preset {PresetId} for category {ProviderCategory} with code {PresetCode}",
            preset.Id,
            preset.ProviderCategory,
            preset.Code);

        return AdminProviderServicePresetMapper.ToResponse(preset);
    }
}

internal static class ProviderServicePresetCommandSupport
{
    private static readonly HashSet<string> CanonicalProviderCategories = typeof(ServiceCategories)
        .GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy)
        .Where(field => field is { IsLiteral: true, IsInitOnly: false } && field.FieldType == typeof(string))
        .Select(field => (string)field.GetRawConstantValue()!)
        .ToHashSet(StringComparer.Ordinal);

    public static void EnsureCanonicalProviderCategory(string providerCategory)
    {
        if (!CanonicalProviderCategories.Contains(providerCategory))
        {
            throw new InvalidOperationException($"Unsupported provider category '{providerCategory}'.");
        }
    }

    public static string NormalizeProviderCategory(string providerCategory)
    {
        ArgumentNullException.ThrowIfNull(providerCategory);
        return providerCategory.Trim().ToLowerInvariant();
    }

    public static string NormalizeCode(string code)
    {
        ArgumentNullException.ThrowIfNull(code);
        return code.Trim().ToLowerInvariant();
    }

    public static string NormalizeLowerInvariant(string value)
    {
        ArgumentNullException.ThrowIfNull(value);
        return value.Trim().ToLowerInvariant();
    }

    public static string NormalizeUpperInvariant(string value)
    {
        ArgumentNullException.ThrowIfNull(value);
        return value.Trim().ToUpperInvariant();
    }

    public static string NormalizeRequiredText(string value)
    {
        ArgumentNullException.ThrowIfNull(value);
        return value.Trim();
    }

    public static string? NormalizeOptionalText(string? value)
        => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    public static JsonElement? ParseExistingTypeConfig(string? typeConfig)
    {
        if (string.IsNullOrWhiteSpace(typeConfig))
        {
            return null;
        }

        using var document = JsonDocument.Parse(typeConfig);
        return document.RootElement.Clone();
    }
}

internal static class AdminProviderServicePresetMapper
{
    public static AdminProviderServicePresetResponse ToResponse(ProviderServicePreset preset)
    {
        ArgumentNullException.ThrowIfNull(preset);

        return new AdminProviderServicePresetResponse
        {
            Id = preset.Id,
            ProviderCategory = preset.ProviderCategory,
            Code = preset.Code,
            NameEn = preset.NameEn,
            NameFr = preset.NameFr,
            NameAr = preset.NameAr,
            NameDe = preset.NameDe,
            DescriptionEn = preset.DescriptionEn,
            DescriptionFr = preset.DescriptionFr,
            DescriptionAr = preset.DescriptionAr,
            DescriptionDe = preset.DescriptionDe,
            Price = preset.Price,
            PriceType = preset.PriceType,
            Currency = preset.Currency,
            DurationMinutes = preset.DurationMinutes,
            ServiceLocation = preset.ServiceLocation,
            RequiresPrescription = preset.RequiresPrescription,
            IsUrgent = preset.IsUrgent,
            RequiresMedicalHistory = preset.RequiresMedicalHistory,
            TypeConfig = DeserializeTypeConfig(preset.TypeConfig),
            IsActive = preset.IsActive,
            DisplayOrder = preset.DisplayOrder,
            CreatedAt = preset.CreatedAt,
            UpdatedAt = preset.UpdatedAt
        };
    }

    private static JsonElement? DeserializeTypeConfig(string? typeConfig)
    {
        if (string.IsNullOrWhiteSpace(typeConfig))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<JsonElement>(typeConfig);
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
