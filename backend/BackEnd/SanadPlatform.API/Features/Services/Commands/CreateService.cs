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
/// Command to create a new service for the authenticated provider.
/// The service category is inherited from the provider's ServiceCategory.
/// </summary>
public record CreateServiceCommand(
    Guid UserId,
    string Name,
    string? Description,
    string? ShortDescription,
    decimal Price,
    string PriceType,
    string Currency,
    decimal? MinPrice,
    decimal? MaxPrice,
    int? DurationMinutes,
    int? MinDurationMinutes,
    int? MaxDurationMinutes,
    string ServiceLocation,
    bool RequiresPrescription,
    bool IsUrgent,
    bool RequiresMedicalHistory,
    int? AgeRestrictionMin,
    int? AgeRestrictionMax,
    JsonElement? TypeConfig,
    IReadOnlyList<SubServiceRequest>? SubServices) : IRequest<ServiceDetailResponse>;

/// <summary>
/// Handler for <see cref="CreateServiceCommand"/>.
/// Validates provider ownership, builds the Service entity with addons,
/// and persists via IUnitOfWork.
/// </summary>
public class CreateServiceHandler : IRequestHandler<CreateServiceCommand, ServiceDetailResponse>
{
    private readonly IServiceRepository _serviceRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ServiceCategoryPolicyRegistry _policyRegistry;
    private readonly ILogger<CreateServiceHandler> _logger;
    private readonly IMemoryCache _cache;

    public CreateServiceHandler(
        IServiceRepository serviceRepository,
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ServiceCategoryPolicyRegistry policyRegistry,
        ILogger<CreateServiceHandler> logger,
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
    /// Handles service creation.
    /// </summary>
    public async Task<ServiceDetailResponse> Handle(CreateServiceCommand command, CancellationToken cancellationToken)
    {
        var providerInfo = await _providerRepository.GetProviderIdAndCategoryByUserIdAsync(command.UserId, cancellationToken)
            ?? throw new KeyNotFoundException("Provider profile not found.");

        // Run category-specific TypeConfig validation and normalization via the policy
        var policy = _policyRegistry.Resolve(providerInfo.ServiceCategory);
        var policyContext = new ServiceCategoryContext(
            providerInfo.ServiceCategory,
            command.Price,
            command.PriceType,
            command.ServiceLocation,
            command.TypeConfig);
        var normalizedMetadata = policy.ValidateAndNormalize(policyContext);

        // Check for duplicate service name
        var exists = await _serviceRepository.ExistsByNameAsync(
            providerInfo.ProviderId, command.Name, cancellationToken: cancellationToken);
        if (exists)
            throw new InvalidOperationException($"A service named '{command.Name}' already exists.");

        // Build the service entity
        var service = new Service
        {
            ProviderId = providerInfo.ProviderId,
            Category = providerInfo.ServiceCategory,
            Name = command.Name,
            Description = command.Description,
            ShortDescription = command.ShortDescription,
            Price = command.Price,
            PriceType = command.PriceType,
            Currency = ProviderFinanceConstants.DefaultCurrency,
            MinPrice = command.MinPrice,
            MaxPrice = command.MaxPrice,
            DurationMinutes = command.DurationMinutes,
            MinDurationMinutes = command.MinDurationMinutes,
            MaxDurationMinutes = command.MaxDurationMinutes,
            ServiceLocation = command.ServiceLocation,
            RequiresPrescription = command.RequiresPrescription,
            IsUrgent = command.IsUrgent,
            RequiresMedicalHistory = command.RequiresMedicalHistory,
            AgeRestrictionMin = command.AgeRestrictionMin,
            AgeRestrictionMax = command.AgeRestrictionMax,
            Metadata = normalizedMetadata
        };

        // Build sub-services (addons)
        if (command.SubServices is { Count: > 0 })
        {
            foreach (var sub in command.SubServices)
            {
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

        await _serviceRepository.CreateAsync(service, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _serviceRepository.RecalculateCategoryPricesAsync(service.Category, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        _cache.Remove("service-categories:en");
        _cache.Remove("service-categories:fr");
        _cache.Remove("service-categories:ar");
        _logger.LogInformation(
            "Provider {ProviderId} created service {ServiceId} ({ServiceName})",
            providerInfo.ProviderId, service.Id, service.Name);

        return _mapper.Map<ServiceDetailResponse>(service);
    }
}
