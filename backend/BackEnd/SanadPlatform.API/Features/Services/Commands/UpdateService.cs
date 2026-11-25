using System.Text.Json;
using AutoMapper;
using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.ProviderFinance;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Services.Repository;
using SanadPlatform.API.Features.Services.Services.Policies;
using Microsoft.Extensions.Caching.Memory;

namespace SanadPlatform.API.Features.Services.Commands;

/// <summary>
/// Command to update an existing service owned by the authenticated provider.
/// Supports partial updates — only fields that are non-null in the request are applied.
/// Note: null values in the request are treated as "no change", not "clear the field".
/// To explicitly clear a nullable field, a dedicated endpoint or sentinel value would be needed.
/// Sub-services use a full-replacement strategy: present IDs are updated, new entries
/// (null ID) are created, and omitted existing IDs are removed.
/// </summary>
public record UpdateServiceCommand(
    Guid UserId,
    Guid ServiceId,
    string? Name,
    string? Description,
    string? ShortDescription,
    decimal? Price,
    string? PriceType,
    string? Currency,
    decimal? MinPrice,
    decimal? MaxPrice,
    int? DurationMinutes,
    int? MinDurationMinutes,
    int? MaxDurationMinutes,
    string? ServiceLocation,
    bool? RequiresPrescription,
    bool? IsUrgent,
    bool? RequiresMedicalHistory,
    int? AgeRestrictionMin,
    int? AgeRestrictionMax,
    JsonElement? TypeConfig,
    IReadOnlyList<SubServiceRequest>? SubServices) : IRequest<ServiceDetailResponse>;

/// <summary>
/// Handler for <see cref="UpdateServiceCommand"/>.
/// Loads the service with tracking, applies partial updates, syncs addons, and persists.
/// </summary>
public class UpdateServiceHandler : IRequestHandler<UpdateServiceCommand, ServiceDetailResponse>
{
    private readonly IServiceRepository _serviceRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ServiceCategoryPolicyRegistry _policyRegistry;
    private readonly ILogger<UpdateServiceHandler> _logger;
    private readonly IMemoryCache _cache;

    public UpdateServiceHandler(
        IServiceRepository serviceRepository,
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ServiceCategoryPolicyRegistry policyRegistry,
        ILogger<UpdateServiceHandler> logger,
        IMemoryCache cache)
    {
        _serviceRepository = serviceRepository ?? throw new ArgumentNullException(nameof(serviceRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _policyRegistry = policyRegistry ?? throw new ArgumentNullException(nameof(policyRegistry));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
    }

    /// <summary>
    /// Handles the service update.
    /// </summary>
    public async Task<ServiceDetailResponse> Handle(UpdateServiceCommand command, CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(command.UserId, cancellationToken)
            ?? throw new KeyNotFoundException("Provider profile not found.");

        var service = await _serviceRepository.GetByIdAndProviderForUpdateAsync(
            command.ServiceId, providerId, cancellationToken)
            ?? throw new KeyNotFoundException($"Service {command.ServiceId} not found.");

        // Check for duplicate name (if name is being changed)
        if (command.Name is not null && command.Name != service.Name)
        {
            var exists = await _serviceRepository.ExistsByNameAsync(
                providerId, command.Name, excludeServiceId: service.Id, cancellationToken: cancellationToken);
            if (exists)
                throw new InvalidOperationException($"A service named '{command.Name}' already exists.");
        }

        // ==================== Apply Partial Updates ====================
        // Note: null means "no change" — fields cannot be cleared to null via this endpoint.

        if (command.Name is not null) service.Name = command.Name;
        if (command.Description is not null) service.Description = command.Description;
        if (command.ShortDescription is not null) service.ShortDescription = command.ShortDescription;
        if (command.Price.HasValue) service.Price = command.Price.Value;
        if (command.PriceType is not null) service.PriceType = command.PriceType;
        service.Currency = ProviderFinanceConstants.DefaultCurrency;
        if (command.MinPrice.HasValue) service.MinPrice = command.MinPrice;
        if (command.MaxPrice.HasValue) service.MaxPrice = command.MaxPrice;
        if (command.DurationMinutes.HasValue) service.DurationMinutes = command.DurationMinutes;
        if (command.MinDurationMinutes.HasValue) service.MinDurationMinutes = command.MinDurationMinutes;
        if (command.MaxDurationMinutes.HasValue) service.MaxDurationMinutes = command.MaxDurationMinutes;
        if (command.ServiceLocation is not null) service.ServiceLocation = command.ServiceLocation;
        if (command.RequiresPrescription.HasValue) service.RequiresPrescription = command.RequiresPrescription.Value;
        if (command.IsUrgent.HasValue) service.IsUrgent = command.IsUrgent.Value;
        if (command.RequiresMedicalHistory.HasValue) service.RequiresMedicalHistory = command.RequiresMedicalHistory.Value;
        if (command.AgeRestrictionMin.HasValue) service.AgeRestrictionMin = command.AgeRestrictionMin;
        if (command.AgeRestrictionMax.HasValue) service.AgeRestrictionMax = command.AgeRestrictionMax;

        // ==================== Category Policy Validation ====================
        // Run the category policy when:
        // (a) the client sent a new TypeConfig, OR
        // (b) the policy requires revalidation and policy-relevant scalar fields changed
        //     (e.g. equipment_rental enforces Price > 0 inside the policy).

        var hasNewTypeConfig = command.TypeConfig is not null;
        var policy = _policyRegistry.Resolve(service.Category);
        var hasPolicyRelevantChanges = command.Price.HasValue
            || command.PriceType is not null
            || command.ServiceLocation is not null;

        if (hasNewTypeConfig || (policy.RequiresRevalidationOnUpdate && hasPolicyRelevantChanges))
        {
            var typeConfig = hasNewTypeConfig
                ? command.TypeConfig
                : ParseExistingMetadata(service.Metadata);

            var policyContext = new ServiceCategoryContext(
                service.Category,
                service.Price,
                service.PriceType,
                service.ServiceLocation,
                typeConfig);
            service.Metadata = policy.ValidateAndNormalize(policyContext);
        }

        // ==================== Post-Update Cross-Field Validation ====================
        // These checks must happen after partial updates are applied because the validator
        // cannot compare incoming partial values against the current entity state.

        ValidateCrossFieldConstraints(service);

        // ==================== Sync Sub-Services (Addons) ====================

        if (command.SubServices is not null)
        {
            SyncAddons(service, command.SubServices);
        }

        await _serviceRepository.UpdateAsync(service, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var priceFieldsChanged = command.Price.HasValue
            || command.MinPrice.HasValue
            || command.MaxPrice.HasValue
            || command.PriceType is not null;

        if (priceFieldsChanged)
        {
            await _serviceRepository.RecalculateCategoryPricesAsync(service.Category, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            _cache.Remove("service-categories:en");
            _cache.Remove("service-categories:fr");
            _cache.Remove("service-categories:ar");
        }
        _logger.LogInformation(
            "Provider {ProviderId} updated service {ServiceId}",
            providerId, service.Id);

        return _mapper.Map<ServiceDetailResponse>(service);
    }

    // ==================== Cross-Field Validation ====================

    /// <summary>
    /// Parses existing <c>Service.Metadata</c> JSON into a <see cref="JsonElement"/> so it can
    /// be passed to the category policy for revalidation when <c>TypeConfig</c> was not provided.
    /// Returns <c>null</c> if the service has no stored metadata.
    /// </summary>
    private static JsonElement? ParseExistingMetadata(string? metadata)
    {
        if (string.IsNullOrWhiteSpace(metadata))
            return null;

        using var doc = JsonDocument.Parse(metadata);
        return doc.RootElement.Clone();
    }

    /// <summary>
    /// Validates cross-field constraints after partial updates have been applied.
    /// These constraints cannot be checked in the FluentValidation validator because
    /// partial update requests may only contain one side of a range.
    /// </summary>
    private static void ValidateCrossFieldConstraints(Service service)
    {
        if (service.MinPrice.HasValue && service.MaxPrice.HasValue && service.MaxPrice < service.MinPrice)
            throw new InvalidOperationException("Maximum price must be greater than or equal to minimum price.");

        if (service.MinDurationMinutes.HasValue && service.MaxDurationMinutes.HasValue
            && service.MaxDurationMinutes < service.MinDurationMinutes)
            throw new InvalidOperationException("Maximum duration must be greater than or equal to minimum duration.");

        if (service.AgeRestrictionMin.HasValue && service.AgeRestrictionMax.HasValue
            && service.AgeRestrictionMax < service.AgeRestrictionMin)
            throw new InvalidOperationException("Maximum age restriction must be greater than or equal to minimum age restriction.");
    }

    // ==================== Addon Sync Algorithm ====================

    /// <summary>
    /// Syncs the tracked service's Addons collection with the incoming sub-service list.
    /// - New entries (Id is null): added to the collection.
    /// - Existing entries (Id matches): updated in place.
    /// - Missing entries (existing addon ID not in request): removed from collection.
    ///   EF detects orphaned children on the required FK and marks them Deleted;
    ///   the <c>AuditableEntityInterceptor</c> converts Deleted entities implementing
    ///   <see cref="SanadPlatform.API.Common.Interfaces.ISoftDeletable"/> to a soft-delete
    ///   (UPDATE setting DeletedAt, not a physical DELETE), so the Restrict FK behavior
    ///   configured on ServiceAddon → Service is never violated at the database level.
    /// </summary>
    private static void SyncAddons(Service service, IReadOnlyList<SubServiceRequest> requestAddons)
    {
        var existingAddons = service.Addons.ToList();
        var requestAddonIds = requestAddons
            .Where(r => r.Id.HasValue)
            .Select(r => r.Id!.Value)
            .ToHashSet();

        // Remove addons not present in the request
        var addonsToRemove = existingAddons.Where(a => !requestAddonIds.Contains(a.Id)).ToList();
        foreach (var addon in addonsToRemove)
        {
            service.Addons.Remove(addon);
        }

        // Update existing and add new
        foreach (var sub in requestAddons)
        {
            if (sub.Id.HasValue)
            {
                // Update existing addon
                var existing = existingAddons.FirstOrDefault(a => a.Id == sub.Id.Value);
                if (existing is null)
                    throw new KeyNotFoundException($"Sub-service {sub.Id.Value} not found on this service.");

                existing.Name = sub.Name;
                existing.Description = sub.Description;
                existing.Price = sub.Price;
                existing.DurationMinutes = sub.DurationMinutes;
                existing.Icon = sub.Icon;
                existing.IsSupplement = sub.IsSupplement;
            }
            else
            {
                // Add new addon
                service.Addons.Add(new ServiceAddon
                {
                    ServiceId = service.Id,
                    Name = sub.Name,
                    Description = sub.Description,
                    Price = sub.Price,
                    DurationMinutes = sub.DurationMinutes,
                    Icon = sub.Icon,
                    IsSupplement = sub.IsSupplement
                });
            }
        }
    }
}
