using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Bookings.Queries;

/// <summary>
/// Query for listing booking sessions scoped to the authenticated caller.
/// </summary>
public record GetBookingSessionsQuery(
    Guid CallerUserId,
    bool IsPatient,
    bool IsProvider,
    bool IsAdmin,
    Guid? BookingId,
    Guid? PatientId,
    Guid? ProviderId,
    string? Status,
    DateOnly? DateFrom,
    DateOnly? DateTo,
    string SortBy,
    bool SortDesc,
    int Page,
    int Limit) : IRequest<GetBookingSessionsResponse>;

/// <summary>
/// Handles <see cref="GetBookingSessionsQuery"/>.
/// </summary>
public class GetBookingSessionsHandler : IRequestHandler<GetBookingSessionsQuery, GetBookingSessionsResponse>
{
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IBookingRollupService _rollupService;
    private readonly IBookingSessionVerificationCodeService _verificationCodeService;
    private readonly IBookingSessionMapper _mapper;

    public GetBookingSessionsHandler(
        IBookingSessionRepository sessionRepository,
        IPatientRepository patientRepository,
        IProviderRepository providerRepository,
        IBookingRollupService rollupService,
        IBookingSessionVerificationCodeService verificationCodeService,
        IBookingSessionMapper mapper)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _verificationCodeService = verificationCodeService ?? throw new ArgumentNullException(nameof(verificationCodeService));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<GetBookingSessionsResponse> Handle(
        GetBookingSessionsQuery query,
        CancellationToken cancellationToken)
    {
        var (patientId, providerId) = await ResolveScopeAsync(query, cancellationToken);
        var parsedStatus = ParseStatus(query.Status);

        var (items, totalCount) = await _sessionRepository.GetSessionsAsync(
            query.BookingId,
            patientId,
            providerId,
            parsedStatus,
            query.DateFrom,
            query.DateTo,
            query.SortBy,
            query.SortDesc,
            query.Page,
            query.Limit,
            cancellationToken);

        var now = DateTime.UtcNow;
        var countsByBookingId = await _sessionRepository.GetSessionCountsByBookingIdsAsync(
            items.Select(session => session.BookingId).Distinct().ToList(),
            cancellationToken);
        var responseItems = items
            .Select(session =>
            {
                countsByBookingId.TryGetValue(session.BookingId, out var counts);
                var code = patientId.HasValue
                    ? _verificationCodeService.GetVisibleCode(session, patientId.Value, now)
                    : null;
                return _mapper.MapSession(session, counts ?? new BookingSessionCountsResponse(), code);
            })
            .ToList()
            .AsReadOnly();

        var safeLimit = Math.Clamp(query.Limit, 1, 100);
        return new GetBookingSessionsResponse
        {
            Items = responseItems,
            Pagination = new PaginationMetadata
            {
                Page = Math.Max(1, query.Page),
                Limit = safeLimit,
                Total = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)safeLimit)
            }
        };
    }

    private async Task<(Guid? PatientId, Guid? ProviderId)> ResolveScopeAsync(
        GetBookingSessionsQuery query,
        CancellationToken cancellationToken)
    {
        if (query.IsPatient)
        {
            var patientId = await _patientRepository.GetPatientIdByUserIdAsync(query.CallerUserId, cancellationToken)
                ?? throw new UnauthorizedAccessException("Patient profile not found for the authenticated user.");
            return (patientId, null);
        }

        if (query.IsProvider)
        {
            var providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.CallerUserId, cancellationToken)
                ?? throw new UnauthorizedAccessException("Provider profile not found for the authenticated user.");
            return (null, providerId);
        }

        if (query.IsAdmin)
        {
            return (query.PatientId, query.ProviderId);
        }

        throw new UnauthorizedAccessException("User does not have a recognised role for booking session access.");
    }

    private static BookingSessionStatus? ParseStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status))
        {
            return null;
        }

        var normalized = status.Replace("_", string.Empty, StringComparison.Ordinal);
        return Enum.TryParse<BookingSessionStatus>(normalized, ignoreCase: true, out var parsed)
            ? parsed
            : throw new InvalidOperationException($"Unknown booking session status '{status}'.");
    }
}
