using MediatR;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Bookings.Queries;

/// <summary>
/// Query for the authenticated provider's session delivery view.
/// </summary>
public record GetMyProviderBookingSessionDeliveryQuery(
    Guid SessionId,
    Guid CallerUserId) : IRequest<ProviderBookingSessionDeliveryResponse>;

/// <summary>
/// Handles <see cref="GetMyProviderBookingSessionDeliveryQuery"/>.
/// </summary>
public class GetMyProviderBookingSessionDeliveryHandler
    : IRequestHandler<GetMyProviderBookingSessionDeliveryQuery, ProviderBookingSessionDeliveryResponse>
{
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IBookingSessionMapper _mapper;

    public GetMyProviderBookingSessionDeliveryHandler(
        IBookingSessionRepository sessionRepository,
        IProviderRepository providerRepository,
        IBookingSessionMapper mapper)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<ProviderBookingSessionDeliveryResponse> Handle(
        GetMyProviderBookingSessionDeliveryQuery query,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.CallerUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Provider profile not found for the authenticated user.");

        var session = await _sessionRepository.GetByIdAsync(query.SessionId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking session {query.SessionId} was not found.");

        if (session.ProviderId != providerId)
        {
            throw new UnauthorizedAccessException("You do not have permission to view this session delivery.");
        }

        return _mapper.MapProviderDelivery(session);
    }
}
