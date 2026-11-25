using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Bookings.Queries;

// ==================== Query ====================

/// <summary>
/// Query to retrieve a paginated list of bookings.
/// Role-based filtering is enforced in the handler:
/// patients see only their own, providers see only their own, admins see all.
/// </summary>
public record GetBookingsQuery(
    int Page,
    int Limit,
    string? Status,
    DateOnly? StartDateFrom,
    DateOnly? StartDateTo,
    Guid? PatientId,
    Guid? ProviderId,
    Guid? ServiceId,
    string? ServiceCategory,
    string? SearchQuery,
    string SortBy,
    bool SortDesc,
    Guid CallerUserId,
    bool IsPatient,
    bool IsProvider,
    bool IsAdmin) : IRequest<GetBookingsResponse>;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="GetBookingsQuery"/>.
/// Projects all bookings to the unified <see cref="BookingListItemResponse"/> DTO, then
/// applies role-specific field nulling so that patients never see provider-only fields
/// and providers never see patient-only fields.
/// </summary>
public class GetBookingsHandler : IRequestHandler<GetBookingsQuery, GetBookingsResponse>
{
    private readonly IBookingRepository _repository;
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly ILogger<GetBookingsHandler> _logger;

    public GetBookingsHandler(
        IBookingRepository repository,
        IBookingSessionRepository sessionRepository,
        IPatientRepository patientRepository,
        IProviderRepository providerRepository,
        ILogger<GetBookingsHandler> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<GetBookingsResponse> Handle(
        GetBookingsQuery query,
        CancellationToken cancellationToken)
    {
        // ==================== Role-Based Security Filters ====================
        // Resolve CallerUserId (JWT User.Id) → the entity ID stored on Booking rows.
        var (patientId, providerId) = await ResolveSecurityFiltersAsync(query, cancellationToken);

        // ==================== Build Specification ====================
        var specification = new GetBookingsSpecification(
            page: query.Page,
            limit: query.Limit,
            status: query.Status,
            startDateFrom: query.StartDateFrom,
            startDateTo: query.StartDateTo,
            patientId: patientId,
            providerId: providerId,
            serviceId: query.ServiceId,
            serviceCategory: query.ServiceCategory,
            searchQuery: query.SearchQuery,
            sortBy: query.SortBy,
            sortDesc: query.SortDesc);

        // ==================== Execute Query ====================
        var (items, totalCount) = await _repository.GetBookingsProjectedAsync<BookingListItemResponse>(
            specification, cancellationToken);

        _logger.LogDebug(
            "GetBookings: {Count} items for user {UserId} (role: Patient={IsPatient}, Provider={IsProvider}, Admin={IsAdmin}, Page {Page}, Total {Total})",
            items.Count, query.CallerUserId, query.IsPatient, query.IsProvider, query.IsAdmin, query.Page, totalCount);

        // ==================== Apply Role-Based Field Narrowing ====================
        // Records support `with` expression cloning, so init-only properties can be selectively nulled.
        var narrowedItems = await EnrichSessionCountsAsync(ApplyRoleFilter(items, query), cancellationToken);

        // ==================== Build Response ====================
        return BuildResponse(narrowedItems, totalCount, query);
    }

    private async Task<IReadOnlyList<BookingListItemResponse>> EnrichSessionCountsAsync(
        IReadOnlyList<BookingListItemResponse> items,
        CancellationToken cancellationToken)
    {
        var countsByBookingId = await _sessionRepository.GetSessionCountsByBookingIdsAsync(
            items.Select(item => item.Id).Distinct().ToList(),
            cancellationToken);

        return items
            .Select(item =>
            {
                countsByBookingId.TryGetValue(item.Id, out var counts);
                return item with
                {
                    SessionCounts = counts ?? new BookingSessionCountsResponse()
                };
            })
            .ToList()
            .AsReadOnly();
    }

    /// <summary>
    /// Nulls out fields that the caller's role should not see.
    /// Patients must not see <see cref="BookingListItemResponse.Patient"/> or
    /// <see cref="BookingListItemResponse.ProviderAmount"/>.
    /// Providers must not see <see cref="BookingListItemResponse.Provider"/>,
    /// <see cref="BookingListItemResponse.ValidationCode"/>,
    /// <see cref="BookingListItemResponse.Notes"/>,
    /// <see cref="BookingListItemResponse.Rating"/>, or
    /// <see cref="BookingListItemResponse.ReviewComment"/>.
    /// Admins receive all fields.
    /// </summary>
    private static IReadOnlyList<BookingListItemResponse> ApplyRoleFilter(
        IReadOnlyList<BookingListItemResponse> items,
        GetBookingsQuery query)
    {
        if (query.IsAdmin)
            return items;

        if (query.IsProvider)
        {
            return items
                .Select(i => i with
                {
                    Provider = null,
                    ValidationCode = null,
                    Notes = null,
                    Rating = null,
                    ReviewComment = null
                })
                .ToList()
                .AsReadOnly();
        }

        // Patient (and any other role) — hide provider-only fields.
        return items
            .Select(i => i with
            {
                Patient = null,
                ProviderAmount = null
            })
            .ToList()
            .AsReadOnly();
    }

    /// <summary>
    /// Builds the paginated <see cref="GetBookingsResponse"/>.
    /// </summary>
    private static GetBookingsResponse BuildResponse(
        IReadOnlyList<BookingListItemResponse> items,
        int totalCount,
        GetBookingsQuery query)
    {
        int totalPages = query.Limit > 0
            ? (int)Math.Ceiling(totalCount / (double)query.Limit)
            : 0;

        return new GetBookingsResponse
        {
            Items = items,
            Pagination = new PaginationMetadata
            {
                Page = query.Page,
                Limit = query.Limit,
                Total = totalCount,
                TotalPages = totalPages
            }
        };
    }

    /// <summary>
    /// Resolves the caller's JWT User.Id to the correct entity ID used on Booking rows.
    /// Patients  → Patient.Id  (Booking.PatientId)
    /// Providers → Provider.Id (Booking.ProviderId)
    /// Admins    → use query-supplied filter IDs as-is.
    /// </summary>
    private async Task<(Guid? PatientId, Guid? ProviderId)> ResolveSecurityFiltersAsync(
        GetBookingsQuery query,
        CancellationToken cancellationToken)
    {
        if (query.IsPatient)
        {
            var patientId = await _patientRepository.GetPatientIdByUserIdAsync(query.CallerUserId, cancellationToken)
                ?? throw new UnauthorizedAccessException("Patient profile not found for the authenticated user.");

            return (PatientId: patientId, ProviderId: null);
        }

        if (query.IsProvider)
        {
            var providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.CallerUserId, cancellationToken)
                ?? throw new UnauthorizedAccessException("Provider profile not found for the authenticated user.");

            return (PatientId: null, ProviderId: providerId);
        }

        if (query.IsAdmin)
            return (PatientId: query.PatientId, ProviderId: query.ProviderId);

        throw new UnauthorizedAccessException("User does not have a recognised role for booking access.");
    }
}
