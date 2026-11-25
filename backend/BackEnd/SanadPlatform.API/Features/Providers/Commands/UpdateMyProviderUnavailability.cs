using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Services;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Updates a provider-owned unavailability window.
/// </summary>
public record UpdateMyProviderUnavailabilityCommand(
    Guid UserId,
    Guid UnavailabilityId,
    DateTime StartDatetime,
    DateTime EndDatetime,
    bool IsAllDay,
    bool IsRecurring,
    string? RecurrenceRule,
    string? Reason,
    string? Notes) : IRequest<ProviderUnavailabilityResponse>;

/// <summary>
/// Handles <see cref="UpdateMyProviderUnavailabilityCommand"/>.
/// </summary>
public class UpdateMyProviderUnavailabilityCommandHandler
    : IRequestHandler<UpdateMyProviderUnavailabilityCommand, ProviderUnavailabilityResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateMyProviderUnavailabilityCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task<ProviderUnavailabilityResponse> Handle(
        UpdateMyProviderUnavailabilityCommand command,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByUserIdForUpdateAsync(command.UserId, cancellationToken);
        if (provider is null)
        {
            throw new KeyNotFoundException($"No provider profile found for user '{command.UserId}'.");
        }

        var unavailability = await _providerRepository.GetUnavailabilityByIdForUpdateAsync(
            provider.Id,
            command.UnavailabilityId,
            cancellationToken);
        if (unavailability is null)
        {
            throw new KeyNotFoundException($"Provider unavailability '{command.UnavailabilityId}' was not found.");
        }

        var request = new ProviderUnavailabilityUpsertRequest
        {
            StartDatetime = command.StartDatetime,
            EndDatetime = command.EndDatetime,
            IsAllDay = command.IsAllDay,
            IsRecurring = command.IsRecurring,
            RecurrenceRule = command.RecurrenceRule,
            Reason = command.Reason,
            Notes = command.Notes
        };

        ProviderAvailabilityMutationValidation.ValidateUnavailabilityRequest(request);

        var providerTz = TimeZoneInfo.FindSystemTimeZoneById(provider.Timezone ?? "Africa/Tunis");
        unavailability.StartDatetime = TimeZoneInfo.ConvertTimeToUtc(
            DateTime.SpecifyKind(command.StartDatetime, DateTimeKind.Unspecified),
            providerTz);
        unavailability.EndDatetime = TimeZoneInfo.ConvertTimeToUtc(
            DateTime.SpecifyKind(command.EndDatetime, DateTimeKind.Unspecified),
            providerTz);
        unavailability.IsAllDay = command.IsAllDay;
        unavailability.IsRecurring = command.IsRecurring;
        unavailability.RecurrenceRule = command.RecurrenceRule;
        unavailability.Reason = command.Reason;
        unavailability.Notes = command.Notes;

        await _providerRepository.UpdateUnavailabilityAsync(unavailability, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return unavailability.ToResponse(providerTz);
    }
}
