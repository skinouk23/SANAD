using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Services;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Bulk replaces the authenticated provider's weekly schedule intervals.
/// </summary>
public record ReplaceMyProviderSchedulesCommand(
    Guid UserId,
    IReadOnlyList<ProviderScheduleIntervalRequest> Schedules) : IRequest<IReadOnlyList<ProviderScheduleIntervalResponse>>;

/// <summary>
/// Handles <see cref="ReplaceMyProviderSchedulesCommand"/>.
/// </summary>
public class ReplaceMyProviderSchedulesCommandHandler
    : IRequestHandler<ReplaceMyProviderSchedulesCommand, IReadOnlyList<ProviderScheduleIntervalResponse>>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ReplaceMyProviderSchedulesCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task<IReadOnlyList<ProviderScheduleIntervalResponse>> Handle(
        ReplaceMyProviderSchedulesCommand command,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByUserIdWithAvailabilityForUpdateAsync(command.UserId, cancellationToken);
        if (provider is null)
        {
            throw new KeyNotFoundException($"No provider profile found for user '{command.UserId}'.");
        }

        ProviderAvailabilityMutationValidation.ValidateScheduleIntervals(command.Schedules);

        var activeServices = await _providerRepository.GetActiveServicesByUserIdAsync(command.UserId, cancellationToken);
        var activeServiceIds = activeServices.Select(service => service.Id).ToHashSet();

        foreach (var schedule in command.Schedules)
        {
            if (schedule.ServiceId.HasValue && !activeServiceIds.Contains(schedule.ServiceId.Value))
            {
                throw new InvalidOperationException($"Service '{schedule.ServiceId.Value}' is not an active service owned by this provider.");
            }
        }

        if (provider.Schedules.Count > 0)
        {
            _providerRepository.RemoveSchedules(provider.Schedules.ToList());
        }

        var newSchedules = command.Schedules
            .Select(item => new ProviderSchedule
            {
                ProviderId = provider.Id,
                Provider = provider,
                DayOfWeek = item.DayOfWeek,
                ServiceId = item.ServiceId,
                StartTime = item.StartTime,
                EndTime = item.EndTime,
                IsAvailable = true
            })
            .ToList();

        await _providerRepository.CreateSchedulesAsync(newSchedules, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return newSchedules
            .OrderBy(schedule => schedule.DayOfWeek)
            .ThenBy(schedule => schedule.ServiceId.HasValue ? 1 : 0)
            .ThenBy(schedule => schedule.ServiceId)
            .ThenBy(schedule => schedule.StartTime)
            .Select(schedule => schedule.ToScheduleResponse())
            .ToList()
            .AsReadOnly();
    }
}
