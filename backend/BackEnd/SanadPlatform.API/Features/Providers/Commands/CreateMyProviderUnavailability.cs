using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Services;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Creates a provider-owned unavailability window.
/// </summary>
public record CreateMyProviderUnavailabilityCommand(
    Guid UserId,
    DateTime StartDatetime,
    DateTime EndDatetime,
    bool IsAllDay,
    bool IsRecurring,
    string? RecurrenceRule,
    string? Reason,
    string? Notes) : IRequest<ProviderUnavailabilityResponse>;

/// <summary>
/// Handles <see cref="CreateMyProviderUnavailabilityCommand"/>.
/// </summary>
public class CreateMyProviderUnavailabilityCommandHandler
    : IRequestHandler<CreateMyProviderUnavailabilityCommand, ProviderUnavailabilityResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateMyProviderUnavailabilityCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task<ProviderUnavailabilityResponse> Handle(
        CreateMyProviderUnavailabilityCommand command,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByUserIdForUpdateAsync(command.UserId, cancellationToken);
        if (provider is null)
        {
            throw new KeyNotFoundException($"No provider profile found for user '{command.UserId}'.");
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
        var unavailability = new ProviderUnavailability
        {
            ProviderId = provider.Id,
            Provider = provider,
            StartDatetime = TimeZoneInfo.ConvertTimeToUtc(DateTime.SpecifyKind(command.StartDatetime, DateTimeKind.Unspecified), providerTz),
            EndDatetime = TimeZoneInfo.ConvertTimeToUtc(DateTime.SpecifyKind(command.EndDatetime, DateTimeKind.Unspecified), providerTz),
            IsAllDay = command.IsAllDay,
            IsRecurring = command.IsRecurring,
            RecurrenceRule = command.RecurrenceRule,
            Reason = command.Reason,
            Notes = command.Notes
        };

        await _providerRepository.CreateUnavailabilityAsync(unavailability, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return unavailability.ToResponse(providerTz);
    }
}
