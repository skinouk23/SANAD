using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.ProviderFinance;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Helpers;
using SanadPlatform.API.Features.Services.Services.Policies;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Services.Commands;

/// <summary>
/// Command to update a provider service preset without changing its immutable identity.
/// </summary>
public record UpdateProviderServicePresetCommand(
    Guid Id,
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
    System.Text.Json.JsonElement? TypeConfig,
    bool IsActive,
    int DisplayOrder) : IRequest<AdminProviderServicePresetResponse>;

/// <summary>
/// Handles <see cref="UpdateProviderServicePresetCommand"/>.
/// </summary>
public class UpdateProviderServicePresetHandler
    : IRequestHandler<UpdateProviderServicePresetCommand, AdminProviderServicePresetResponse>
{
    private readonly SanadDbContext _db;
    private readonly ServiceCategoryPolicyRegistry _policyRegistry;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMemoryCache _cache;
    private readonly ILogger<UpdateProviderServicePresetHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateProviderServicePresetHandler"/> class.
    /// </summary>
    public UpdateProviderServicePresetHandler(
        SanadDbContext db,
        ServiceCategoryPolicyRegistry policyRegistry,
        IUnitOfWork unitOfWork,
        IMemoryCache cache,
        ILogger<UpdateProviderServicePresetHandler> logger)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _policyRegistry = policyRegistry ?? throw new ArgumentNullException(nameof(policyRegistry));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Updates mutable preset fields and re-normalizes policy metadata when required.
    /// </summary>
    public async Task<AdminProviderServicePresetResponse> Handle(
        UpdateProviderServicePresetCommand command,
        CancellationToken cancellationToken)
    {
        var preset = await _db.ProviderServicePresets
            .FirstOrDefaultAsync(item => item.Id == command.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider service preset {command.Id} not found.");

        var priceType = ProviderServicePresetCommandSupport.NormalizeLowerInvariant(command.PriceType);
        var serviceLocation = ProviderServicePresetCommandSupport.NormalizeLowerInvariant(command.ServiceLocation);
        var policy = _policyRegistry.Resolve(preset.ProviderCategory);

        var hasNewTypeConfig = command.TypeConfig is not null;
        var hasPolicyRelevantChanges = preset.Price != command.Price
            || !string.Equals(preset.PriceType, priceType, StringComparison.Ordinal)
            || !string.Equals(preset.ServiceLocation, serviceLocation, StringComparison.Ordinal);

        preset.NameEn = ProviderServicePresetCommandSupport.NormalizeRequiredText(command.NameEn);
        preset.NameFr = ProviderServicePresetCommandSupport.NormalizeRequiredText(command.NameFr);
        preset.NameAr = ProviderServicePresetCommandSupport.NormalizeOptionalText(command.NameAr);
        preset.NameDe = ProviderServicePresetCommandSupport.NormalizeOptionalText(command.NameDe);
        preset.DescriptionEn = ProviderServicePresetCommandSupport.NormalizeOptionalText(command.DescriptionEn);
        preset.DescriptionFr = ProviderServicePresetCommandSupport.NormalizeOptionalText(command.DescriptionFr);
        preset.DescriptionAr = ProviderServicePresetCommandSupport.NormalizeOptionalText(command.DescriptionAr);
        preset.DescriptionDe = ProviderServicePresetCommandSupport.NormalizeOptionalText(command.DescriptionDe);
        preset.Price = command.Price;
        preset.PriceType = priceType;
        preset.Currency = ProviderFinanceConstants.DefaultCurrency;
        preset.DurationMinutes = command.DurationMinutes;
        preset.ServiceLocation = serviceLocation;
        preset.RequiresPrescription = command.RequiresPrescription;
        preset.IsUrgent = command.IsUrgent;
        preset.RequiresMedicalHistory = command.RequiresMedicalHistory;
        preset.IsActive = command.IsActive;
        preset.DisplayOrder = command.DisplayOrder;

        if (hasNewTypeConfig || (policy.RequiresRevalidationOnUpdate && hasPolicyRelevantChanges))
        {
            var typeConfig = hasNewTypeConfig
                ? command.TypeConfig
                : ProviderServicePresetCommandSupport.ParseExistingTypeConfig(preset.TypeConfig);

            preset.TypeConfig = policy.ValidateAndNormalize(
                new ServiceCategoryContext(
                    preset.ProviderCategory,
                    preset.Price,
                    preset.PriceType,
                    preset.ServiceLocation,
                    typeConfig));
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        ProviderPresetCacheHelper.InvalidateCategory(_cache, preset.ProviderCategory);

        _logger.LogInformation(
            "Admin updated provider preset {PresetId} for category {ProviderCategory} with code {PresetCode}",
            preset.Id,
            preset.ProviderCategory,
            preset.Code);

        return AdminProviderServicePresetMapper.ToResponse(preset);
    }
}
