using AutoMapper;
using MediatR;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Command to update the current authenticated provider's profile.
/// Uses a record for conciseness and flattened properties for clean validation.
/// </summary>
public record UpdateProviderProfileCommand(
    Guid UserId,
    string? BusinessName,
    string? FirstName,
    string? LastName,
    string? Specialization,
    string? Bio,
    string? Address,
    string? City,
    string? PostalCode,
    decimal? Latitude,
    decimal? Longitude,
    int? ServiceRadius,
    string? Timezone,
    string? NutritionProviderSubtype) : IRequest<ProviderProfileResponse?>, ISensitiveRequest;

/// <summary>
/// Handler for <see cref="UpdateProviderProfileCommand"/>.
/// Uses a tracked read to preserve the xmin concurrency token so that a concurrent update
/// causes <see cref="Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException"/>
/// (mapped to 409 by GlobalExceptionHandlingMiddleware) rather than silently overwriting.
/// Returns null when no provider profile exists for the user (controller maps this to 404).
/// </summary>
public class UpdateProviderProfileCommandHandler : IRequestHandler<UpdateProviderProfileCommand, ProviderProfileResponse?>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<UpdateProviderProfileCommandHandler> _logger;

    public UpdateProviderProfileCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<UpdateProviderProfileCommandHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderProfileResponse?> Handle(
        UpdateProviderProfileCommand command,
        CancellationToken cancellationToken)
    {
        // Tracked read — xmin value is retained in the change tracker for optimistic concurrency.
        var provider = await _providerRepository.GetByUserIdForUpdateAsync(command.UserId, cancellationToken);
        if (provider == null)
        {
            _logger.LogDebug("Provider profile not found for user {UserId}", command.UserId);
            return null;
        }

        var nutritionProviderSubtypeUpdate = ResolveNutritionProviderSubtypeUpdate(
            provider.Id,
            provider.ServiceCategory,
            command.NutritionProviderSubtype);

        _mapper.Map(command, provider);

        if (nutritionProviderSubtypeUpdate.ShouldUpdate)
        {
            provider.NutritionProviderSubtype = nutritionProviderSubtypeUpdate.Value;
        }

        await _providerRepository.UpdateAsync(provider, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Provider {ProviderId} self-updated their profile", provider.Id);

        // CompletionRate is computed in AfterMap inside ProviderMappingProfile.
        return _mapper.Map<ProviderProfileResponse>(provider);
    }

    private (bool ShouldUpdate, NutritionProviderSubtype? Value) ResolveNutritionProviderSubtypeUpdate(
        Guid providerId,
        string providerServiceCategory,
        string? nutritionProviderSubtype)
    {
        if (nutritionProviderSubtype is null)
        {
            return (false, null);
        }

        if (!string.Equals(providerServiceCategory, ServiceCategories.Nutrition, StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogWarning(
                "Provider {ProviderId} with category {ServiceCategory} attempted to self-update nutrition subtype",
                providerId,
                providerServiceCategory);

            throw new InvalidOperationException(
                "Nutrition provider subtype can only be updated when the persisted provider category is 'nutrition'.");
        }

        if (!TryParseNutritionProviderSubtype(nutritionProviderSubtype, out var parsedSubtype))
        {
            _logger.LogWarning(
                "Provider {ProviderId} submitted an invalid nutrition subtype update",
                providerId);

            throw new InvalidOperationException(
                "Nutrition provider subtype must be one of: Restaurant, Chef, Nutritionist");
        }

        return (true, parsedSubtype);
    }

    private static bool TryParseNutritionProviderSubtype(
        string nutritionProviderSubtype,
        out NutritionProviderSubtype parsedSubtype)
    {
        parsedSubtype = default;

        return !string.IsNullOrWhiteSpace(nutritionProviderSubtype)
            && Enum.TryParse(
                nutritionProviderSubtype.Trim(),
                ignoreCase: true,
                out parsedSubtype);
    }
}
