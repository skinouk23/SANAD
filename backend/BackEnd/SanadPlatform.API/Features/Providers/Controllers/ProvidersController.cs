using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Queries;
using SanadPlatform.API.Features.Providers.Commands;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Queries;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Providers.Controllers;

/// <summary>
/// Provider endpoints — both self-service (provider role) and admin (Admin role).
/// All business logic is delegated to MediatR query and command handlers.
/// </summary>
[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class ProvidersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IClaimsService _claimsService;

    public ProvidersController(IMediator mediator, IClaimsService claimsService)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    // ==================== Helpers ====================

    private Guid? GetAuthenticatedUserId() => _claimsService.GetUserId(User);

    // ==================== Self-Service (provider role) ====================

    /// <summary>
    /// Get current authenticated provider's profile.
    /// </summary>
    [HttpGet("me")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderProfileResponse>>> GetMyProfile(CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var profile = await _mediator.Send(new GetMyProviderProfileQuery(userId.Value), cancellationToken);

        if (profile == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Provider profile not found for this user"));

        return Ok(ApiResponse<ProviderProfileResponse>.SuccessResponse(profile, "Provider profile retrieved successfully"));
    }

    /// <summary>
    /// Get current authenticated provider's dashboard.
    /// </summary>
    [HttpGet("me/dashboard")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderDashboardResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderDashboardResponse>>> GetMyDashboard(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var dashboard = await _mediator.Send(new GetMyProviderDashboardQuery(userId.Value), cancellationToken);

        return Ok(ApiResponse<ProviderDashboardResponse>.SuccessResponse(
            dashboard, "Provider dashboard retrieved successfully"));
    }

    /// <summary>
    /// Request or resubmit document verification for the authenticated provider.
    /// </summary>
    [HttpPost("me/verification-request")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderVerificationStateResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderVerificationStateResponse>>> RequestMyVerification(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(new RequestProviderVerificationCommand(userId.Value), cancellationToken);

        return Ok(ApiResponse<ProviderVerificationStateResponse>.SuccessResponse(
            result,
            "Verification request submitted successfully"));
    }

    /// <summary>
    /// Get the authenticated provider's booking payment history.
    /// </summary>
    [HttpGet("me/payment-history")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderPaymentHistoryResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderPaymentHistoryResponse>>> GetMyPaymentHistory(
        [FromQuery] GetMyProviderPaymentHistoryRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new GetMyProviderPaymentHistoryQuery(
                userId.Value,
                request.Status,
                request.Search,
                request.DateFrom,
                request.DateTo,
                request.Page,
                request.Limit,
                request.Sort),
            cancellationToken);

        return Ok(ApiResponse<ProviderPaymentHistoryResponse>.SuccessResponse(
            result,
            "Provider payment history retrieved successfully"));
    }

    /// <summary>
    /// Get aggregate payment-history metrics for the authenticated provider.
    /// </summary>
    [HttpGet("me/payment-history/stats")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderPaymentHistoryStatsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderPaymentHistoryStatsResponse>>> GetMyPaymentHistoryStats(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new GetMyProviderPaymentHistoryStatsQuery(userId.Value),
            cancellationToken);

        return Ok(ApiResponse<ProviderPaymentHistoryStatsResponse>.SuccessResponse(
            result,
            "Provider payment history stats retrieved successfully"));
    }

    /// <summary>
    /// Get analytics for the authenticated provider for the requested period.
    /// </summary>
    [HttpGet("me/analytics")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderAnalyticsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderAnalyticsResponse>>> GetMyAnalytics(
        [FromQuery] string? period,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new GetMyProviderAnalyticsQuery(userId.Value, period ?? string.Empty),
            cancellationToken);

        return Ok(ApiResponse<ProviderAnalyticsResponse>.SuccessResponse(
            result,
            "Provider analytics retrieved successfully"));
    }

    /// <summary>
    /// Get today's bookings for the authenticated provider.
    /// </summary>
    [HttpGet("me/bookings/today")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<BookingListItemResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<BookingListItemResponse>>>> GetMyTodayBookings(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var bookings = await _mediator.Send(new GetMyProviderTodayBookingsQuery(userId.Value), cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<BookingListItemResponse>>.SuccessResponse(
            bookings,
            "Today's provider bookings retrieved successfully"));
    }

    /// <summary>
    /// Update current authenticated provider's profile.
    /// Returns 409 Conflict if a concurrent update race is detected.
    /// </summary>
    [HttpPut("me")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<ProviderProfileResponse>>> UpdateMyProfile(
        UpdateMyProviderProfileRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var command = new UpdateProviderProfileCommand(
            userId.Value,
            request.BusinessName,
            request.FirstName,
            request.LastName,
            request.Specialization,
            request.Bio,
            request.Address,
            request.City,
            request.PostalCode,
            request.Latitude,
            request.Longitude,
            request.ServiceRadius,
            request.Timezone,
            request.NutritionProviderSubtype);

        var updatedProfile = await _mediator.Send(command, cancellationToken);

        if (updatedProfile == null)
            return NotFound(ApiResponse<object>.ErrorResponse("Provider profile not found for this user"));

        return Ok(ApiResponse<ProviderProfileResponse>.SuccessResponse(updatedProfile, "Profile updated successfully"));
    }

    /// <summary>
    /// Get authenticated provider's reviews.
    /// </summary>
    [HttpGet("me/reviews")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderReviewsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderReviewsResponse>>> GetMyReviews(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] int? minRating = null,
        CancellationToken cancellationToken = default)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new GetProviderReviewsQuery(userId.Value, page, limit, minRating),
            cancellationToken);

        return Ok(ApiResponse<ProviderReviewsResponse>.SuccessResponse(result, "Reviews retrieved successfully"));
    }

    /// <summary>
    /// Update the authenticated provider's availability (online/offline).
    /// </summary>
    [HttpPut("me/availability")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<UpdateProviderAvailabilityResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<UpdateProviderAvailabilityResponse>>> UpdateMyAvailability(
        UpdateProviderAvailabilityRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new UpdateMyProviderAvailabilityCommand(userId.Value, request.Available),
            cancellationToken);

        return Ok(ApiResponse<UpdateProviderAvailabilityResponse>.SuccessResponse(
            result, "Availability status updated successfully"));
    }

    /// <summary>
    /// Get authenticated provider's availability status change history.
    /// </summary>
    [HttpGet("me/availability/history")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderAvailabilityHistoryResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderAvailabilityHistoryResponse>>> GetMyAvailabilityHistory(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        CancellationToken cancellationToken = default)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new GetMyAvailabilityHistoryQuery(userId.Value, startDate, endDate, page, limit),
            cancellationToken);

        return Ok(ApiResponse<ProviderAvailabilityHistoryResponse>.SuccessResponse(
            result, "Availability history retrieved successfully"));
    }

    /// <summary>
    /// Get the authenticated provider's own availability for a specific date.
    /// Reuses the same availability computation as the public endpoint but resolves
    /// the provider ID from the caller's claims.
    /// </summary>
    [HttpGet("me/availability")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderAvailabilityResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderAvailabilityResponse>>> GetMyAvailability(
        [FromQuery] DateOnly? date = null,
        [FromQuery] Guid? serviceId = null,
        CancellationToken cancellationToken = default)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var effectiveDate = date ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var query = new GetMyProviderAvailabilityQuery(userId.Value, effectiveDate, serviceId);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(ApiResponse<ProviderAvailabilityResponse>.SuccessResponse(result, "Availability retrieved successfully"));
    }

    /// <summary>
    /// Returns the authenticated provider's weekly schedule intervals.
    /// </summary>
    [HttpGet("me/schedules")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ProviderScheduleIntervalResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProviderScheduleIntervalResponse>>>> GetMySchedules(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(new GetMyProviderSchedulesQuery(userId.Value), cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<ProviderScheduleIntervalResponse>>.SuccessResponse(result, "Schedules retrieved successfully"));
    }

    /// <summary>
    /// Returns the authenticated provider's composite planning payload for a local date range.
    /// </summary>
    [HttpGet("me/planning")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderPlanningResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<ProviderPlanningResponse>>> GetMyPlanning(
        [FromQuery] DateOnly from,
        [FromQuery] DateOnly to,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new GetMyProviderPlanningQuery(userId.Value, from, to),
            cancellationToken);

        return Ok(ApiResponse<ProviderPlanningResponse>.SuccessResponse(result, "Planning retrieved successfully"));
    }

    /// <summary>
    /// Bulk replaces the authenticated provider's weekly schedule intervals.
    /// </summary>
    [HttpPut("me/schedules")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ProviderScheduleIntervalResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProviderScheduleIntervalResponse>>>> ReplaceMySchedules(
        [FromBody] List<ProviderScheduleIntervalRequest> request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new ReplaceMyProviderSchedulesCommand(userId.Value, request.AsReadOnly()),
            cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<ProviderScheduleIntervalResponse>>.SuccessResponse(result, "Schedules updated successfully"));
    }

    /// <summary>
    /// Returns provider-owned blocked slots and absences within a provider-local date window.
    /// </summary>
    [HttpGet("me/unavailabilities")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ProviderUnavailabilityResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProviderUnavailabilityResponse>>>> GetMyUnavailabilities(
        [FromQuery] DateOnly from,
        [FromQuery] DateOnly to,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new GetMyProviderUnavailabilitiesQuery(userId.Value, from, to),
            cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<ProviderUnavailabilityResponse>>.SuccessResponse(result, "Unavailabilities retrieved successfully"));
    }

    /// <summary>
    /// Creates a provider-owned blocked slot or absence.
    /// </summary>
    [HttpPost("me/unavailabilities")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderUnavailabilityResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<ProviderUnavailabilityResponse>>> CreateMyUnavailability(
        [FromBody] ProviderUnavailabilityUpsertRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new CreateMyProviderUnavailabilityCommand(
                userId.Value,
                request.StartDatetime,
                request.EndDatetime,
                request.IsAllDay,
                request.IsRecurring,
                request.RecurrenceRule,
                request.Reason,
                request.Notes),
            cancellationToken);

        return Ok(ApiResponse<ProviderUnavailabilityResponse>.SuccessResponse(result, "Unavailability created successfully"));
    }

    /// <summary>
    /// Updates a provider-owned blocked slot or absence.
    /// </summary>
    [HttpPatch("me/unavailabilities/{id:guid}")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderUnavailabilityResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<ProviderUnavailabilityResponse>>> UpdateMyUnavailability(
        Guid id,
        [FromBody] ProviderUnavailabilityUpsertRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new UpdateMyProviderUnavailabilityCommand(
                userId.Value,
                id,
                request.StartDatetime,
                request.EndDatetime,
                request.IsAllDay,
                request.IsRecurring,
                request.RecurrenceRule,
                request.Reason,
                request.Notes),
            cancellationToken);

        return Ok(ApiResponse<ProviderUnavailabilityResponse>.SuccessResponse(result, "Unavailability updated successfully"));
    }

    /// <summary>
    /// Deletes a provider-owned blocked slot or absence.
    /// </summary>
    [HttpDelete("me/unavailabilities/{id:guid}")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteMyUnavailability(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        await _mediator.Send(new DeleteMyProviderUnavailabilityCommand(userId.Value, id), cancellationToken);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Unavailability deleted successfully"));
    }

    /// <summary>
    /// Retrieves the authenticated provider's notification and privacy preferences.
    /// </summary>
    [HttpGet("me/preferences")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderPreferencesResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderPreferencesResponse>>> GetMyPreferences(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(new GetProviderPreferencesQuery(userId.Value), cancellationToken);

        return Ok(ApiResponse<ProviderPreferencesResponse>.SuccessResponse(
            result,
            "Provider preferences retrieved successfully"));
    }

    /// <summary>
    /// Updates the authenticated provider's notification and privacy preferences.
    /// </summary>
    [HttpPut("me/preferences")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderPreferencesResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderPreferencesResponse>>> UpdateMyPreferences(
        [FromBody] UpdateProviderPreferencesRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var command = new UpdateProviderPreferencesCommand(
            UserId: userId.Value,
            EmailNotifications: request.EmailNotifications,
            SmsNotifications: request.SmsNotifications,
            PushNotifications: request.PushNotifications,
            MarketingEmails: request.MarketingEmails,
            AllowPatientMessages: request.AllowPatientMessages,
            ProfileVisibility: request.ProfileVisibility);

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<ProviderPreferencesResponse>.SuccessResponse(
            result,
            "Provider preferences updated successfully"));
    }

    // ==================== Public listing endpoints ====================

    /// <summary>
    /// Get distinct provider listing filter options.
    /// </summary>
    [HttpGet("filter-options")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ProviderFilterOptionsResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<ProviderFilterOptionsResponse>>> GetProviderFilterOptions(
        [FromQuery] string? serviceCategory = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetProviderFilterOptionsQuery(serviceCategory);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<ProviderFilterOptionsResponse>.SuccessResponse(
            result,
            "Provider filter options retrieved successfully"));
    }

    /// <summary>
    /// Get a paginated, filterable list of all providers.
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PaginatedProviderResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PaginatedProviderResponse>>> GetProviders(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string? status = null,
        [FromQuery] string? serviceCategory = null,
        [FromQuery] string? searchQuery = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool sortDesc = false,
        [FromQuery] string? city = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetPaginatedProvidersQuery(page, limit, status, serviceCategory, searchQuery, sortBy, sortDesc, city);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(ApiResponse<PaginatedProviderResponse>.SuccessResponse(result, "Providers retrieved successfully"));
    }

    /// <summary>
    /// Get available providers filtered by service category.
    /// </summary>
    [HttpGet("available")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PaginatedProviderResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PaginatedProviderResponse>>> GetAvailableProviders(
        [FromQuery] string serviceCategory = "",
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        CancellationToken cancellationToken = default)
    {
        var query = new GetAvailableProvidersQuery(serviceCategory, page, limit);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(ApiResponse<PaginatedProviderResponse>.SuccessResponse(result, "Available providers retrieved successfully"));
    }

    /// <summary>
    /// Get top-rated providers.
    /// </summary>
    [HttpGet("top-rated")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PaginatedProviderResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PaginatedProviderResponse>>> GetTopRatedProviders(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 5,
        CancellationToken cancellationToken = default)
    {
        var query = new GetTopRatedProvidersQuery(page, limit);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(ApiResponse<PaginatedProviderResponse>.SuccessResponse(result, "Top-rated providers retrieved successfully"));
    }

    /// <summary>
    /// Get a provider's schedule (available time slots) for the next N days.
    /// </summary>
    [HttpGet("{id:guid}/schedule")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ProviderScheduleSlotResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProviderScheduleSlotResponse>>>> GetProviderSchedule(
        Guid id,
        [FromQuery] int days = 7,
        CancellationToken cancellationToken = default)
    {
        var query = new GetProviderScheduleQuery(id, days);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<ProviderScheduleSlotResponse>>.SuccessResponse(result, "Schedule retrieved successfully"));
    }

    // ==================== Public read endpoints ====================

    /// <summary>
    /// Get a provider's available and unavailable time slots for a specific date.
    /// Any authenticated user can call this endpoint.
    /// </summary>
    [HttpGet("{providerId:guid}/availability")]
    [ProducesResponseType(typeof(ApiResponse<ProviderAvailabilityResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<ProviderAvailabilityResponse>>> GetProviderAvailability(
        Guid providerId,
        [FromQuery] GetProviderAvailabilityRequest request,
        CancellationToken cancellationToken)
    {
        var query = new GetProviderAvailabilityQuery(providerId, request.Date, request.ServiceId);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<ProviderAvailabilityResponse>.SuccessResponse(
            result, "Availability retrieved successfully"));
    }

    /// <summary>
    /// Get the daily start times that remain valid for every day in a selected booking range.
    /// Any authenticated user can call this endpoint.
    /// </summary>
    [HttpGet("{providerId:guid}/availability/range")]
    [ProducesResponseType(typeof(ApiResponse<ProviderRangeAvailabilityResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<ProviderRangeAvailabilityResponse>>> GetProviderRangeAvailability(
        Guid providerId,
        [FromQuery] GetProviderRangeAvailabilityRequest request,
        CancellationToken cancellationToken)
    {
        var query = new GetProviderRangeAvailabilityQuery(
            providerId,
            request.StartDate,
            request.EndDate,
            request.ServiceIds.AsReadOnly());
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<ProviderRangeAvailabilityResponse>.SuccessResponse(
            result, "Range availability retrieved successfully"));
    }

    /// <summary>
    /// Get month-level availability preview for a provider.
    /// Returns per-day slot counts for the requested calendar month, timezone-aware.
    /// </summary>
    [HttpGet("{providerId:guid}/availability/month")]
    [ProducesResponseType(typeof(ApiResponse<ProviderMonthAvailabilityResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<ProviderMonthAvailabilityResponse>>> GetProviderMonthAvailability(
        Guid providerId,
        [FromQuery] GetProviderMonthAvailabilityRequest request,
        CancellationToken cancellationToken)
    {
        var query = new GetProviderMonthAvailabilityQuery(
            providerId,
            request.Year,
            request.Month,
            request.ServiceIds.AsReadOnly());
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<ProviderMonthAvailabilityResponse>.SuccessResponse(
            result, "Month availability retrieved successfully"));
    }

    /// <summary>
    /// Get all active providers.
    /// </summary>
    [HttpGet("active")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ProviderResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProviderResponse>>>> GetActiveProviders(
        CancellationToken cancellationToken)
    {
        var providers = await _mediator.Send(new GetActiveProvidersQuery(), cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<ProviderResponse>>.SuccessResponse(
            providers, "Active providers retrieved successfully"));
    }

    /// <summary>
    /// Get provider by ID.
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ProviderDetailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderDetailResponse>>> GetProviderById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var provider = await _mediator.Send(new GetProviderByIdQuery(id), cancellationToken);
        return Ok(ApiResponse<ProviderDetailResponse>.SuccessResponse(provider, "Provider retrieved successfully"));
    }

    /// <summary>
    /// Get providers by country.
    /// </summary>
    [HttpGet("country/{country}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ProviderResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProviderResponse>>>> GetProvidersByCountry(
        string country,
        CancellationToken cancellationToken)
    {
        var providers = await _mediator.Send(new GetProvidersByCountryQuery(country), cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<ProviderResponse>>.SuccessResponse(
            providers, "Providers retrieved successfully"));
    }

    // ==================== Admin endpoints ====================

    /// <summary>
    /// Approve a provider application and enable provider login (Admin only).
    /// </summary>
    [HttpPost("{id:guid}/approval")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(ApiResponse<ProviderVerificationStateResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderVerificationStateResponse>>> ApproveProviderApplication(
        Guid id,
        CancellationToken cancellationToken)
    {
        var adminUserId = GetAuthenticatedUserId();
        if (!adminUserId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new ApproveProviderApplicationCommand(id, adminUserId.Value),
            cancellationToken);

        return Ok(ApiResponse<ProviderVerificationStateResponse>.SuccessResponse(
            result,
            "Provider application approved successfully"));
    }

    /// <summary>
    /// Reject a provider application and keep provider login blocked (Admin only).
    /// </summary>
    [HttpPost("{id:guid}/rejection")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(ApiResponse<ProviderVerificationStateResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderVerificationStateResponse>>> RejectProviderApplication(
        Guid id,
        [FromBody] RejectProviderApplicationRequest request,
        CancellationToken cancellationToken)
    {
        var adminUserId = GetAuthenticatedUserId();
        if (!adminUserId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new RejectProviderApplicationCommand(id, adminUserId.Value, request.Reason),
            cancellationToken);

        return Ok(ApiResponse<ProviderVerificationStateResponse>.SuccessResponse(
            result,
            "Provider application rejected successfully"));
    }

    /// <summary>
    /// Update a provider's document verification status (Admin only).
    /// </summary>
    [HttpPatch("{id:guid}/verification-status")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(ApiResponse<ProviderVerificationStateResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderVerificationStateResponse>>> UpdateProviderVerificationStatus(
        Guid id,
        [FromBody] UpdateProviderVerificationStatusRequest request,
        CancellationToken cancellationToken)
    {
        var adminUserId = GetAuthenticatedUserId();
        if (!adminUserId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var result = await _mediator.Send(
            new UpdateProviderVerificationStatusCommand(id, adminUserId.Value, request.VerificationStatus),
            cancellationToken);

        return Ok(ApiResponse<ProviderVerificationStateResponse>.SuccessResponse(
            result,
            "Provider verification status updated successfully"));
    }

    /// <summary>
    /// Create a new provider (Admin only).
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(ApiResponse<ProviderResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<ProviderResponse>>> CreateProvider(
        CreateProviderRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateProviderCommand(
            request.ServiceCategory,
            request.IsIndividual,
            request.BusinessName,
            request.FirstName,
            request.LastName,
            request.Bio,
            request.ShortDescription,
            request.AddressLine1,
            request.City,
            request.CountryCode);

        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(nameof(GetProviderById), new { id = result.Id },
            ApiResponse<ProviderResponse>.SuccessResponse(result, "Provider created successfully"));
    }

    /// <summary>
    /// Update an existing provider (Admin only).
    /// Returns 409 Conflict if a concurrent update race is detected.
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(ApiResponse<ProviderResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<ProviderResponse>>> UpdateProvider(
        Guid id,
        UpdateProviderRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateProviderCommand(
            id,
            request.BusinessName,
            request.FirstName,
            request.LastName,
            request.Bio,
            request.ShortDescription,
            request.AddressLine1,
            request.AddressLine2,
            request.City,
            request.StateProvince,
            request.PostalCode,
            request.CountryCode);

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(ApiResponse<ProviderResponse>.SuccessResponse(result, "Provider updated successfully"));
    }

    /// <summary>
    /// Delete a provider (Admin only).
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteProvider(Guid id, CancellationToken cancellationToken)
    {
        await _mediator.Send(new DeleteProviderCommand(id), cancellationToken);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Provider deleted successfully."));
    }
}
