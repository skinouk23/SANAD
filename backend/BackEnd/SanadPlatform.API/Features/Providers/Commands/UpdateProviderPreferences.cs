using AutoMapper;
using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Command to update the authenticated provider's preferences.
/// </summary>
public record UpdateProviderPreferencesCommand(
    Guid UserId,
    bool? EmailNotifications = null,
    bool? SmsNotifications = null,
    bool? PushNotifications = null,
    bool? MarketingEmails = null,
    bool? AllowPatientMessages = null,
    string? ProfileVisibility = null
) : IRequest<ProviderPreferencesResponse>;

/// <summary>
/// Handler for <see cref="UpdateProviderPreferencesCommand"/>.
/// Creates the preferences row on first update for legacy providers that predate this feature.
/// </summary>
public class UpdateProviderPreferencesCommandHandler : IRequestHandler<UpdateProviderPreferencesCommand, ProviderPreferencesResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<UpdateProviderPreferencesCommandHandler> _logger;

    public UpdateProviderPreferencesCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<UpdateProviderPreferencesCommandHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderPreferencesResponse> Handle(
        UpdateProviderPreferencesCommand command,
        CancellationToken cancellationToken)
    {
        var preferences = await _providerRepository.GetPreferencesByUserIdForUpdateAsync(command.UserId, cancellationToken);
        var createdOnThisUpdate = false;

        if (preferences == null)
        {
            var provider = await _providerRepository.GetByUserIdForUpdateAsync(command.UserId, cancellationToken);
            if (provider == null)
            {
                _logger.LogWarning(
                    "Provider preferences update failed: provider not found for User ID {UserId}",
                    command.UserId);

                throw new KeyNotFoundException($"Provider preferences not found for user ID {command.UserId}");
            }

            preferences = new ProviderPreferences
            {
                ProviderId = provider.Id,
                Provider = provider,
            };

            _mapper.Map(command, preferences);
            await _providerRepository.CreatePreferencesAsync(preferences, cancellationToken);
            createdOnThisUpdate = true;
        }
        else
        {
            _mapper.Map(command, preferences);
            await _providerRepository.UpdatePreferencesAsync(preferences, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Provider preferences {Mutation}. PreferencesId: {PreferencesId}, ProviderId: {ProviderId}, UserId: {UserId}",
            createdOnThisUpdate ? "created" : "updated",
            preferences.Id,
            preferences.ProviderId,
            command.UserId);

        return _mapper.Map<ProviderPreferencesResponse>(preferences);
    }
}
