using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Bookings.Commands;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Queries;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Bookings.Controllers;

/// <summary>
/// Handles booking management operations.
/// Role-based access: patients see own bookings, providers see own, admins see all.
/// </summary>
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
[ApiVersion(ApiVersions.V1_0)]
public class BookingsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IClaimsService _claimsService;

    public BookingsController(IMediator mediator, IClaimsService claimsService)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    // ==================== POST /api/v1/bookings ====================

    /// <summary>
    /// Creates a new booking for an authenticated patient.
    /// Supports standard appointments and equipment rentals.
    /// For equipment, include a <c>typeConfig</c> JSON object with <c>endDate</c>
    /// and <c>rentalDurationType</c>.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<CreateBookingResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<CreateBookingResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<CreateBookingResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<CreateBookingResponse>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<CreateBookingResponse>), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<CreateBookingResponse>>> CreateBooking(
        [FromBody] CreateBookingRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<CreateBookingResponse>.ErrorResponse("Invalid authentication token."));

        var command = new CreateBookingCommand(
            CallerUserId: userId.Value,
            ProviderId: request.ProviderId,
            ServiceItems: request.ServiceItems
                .Select(item => new ServiceItemSelection(item.ServiceId, item.Quantity))
                .ToList()
                .AsReadOnly(),
            StartDate: request.StartDate,
            EndDate: request.EndDate,
            DailyStartTime: request.DailyStartTime,
            AddressLine1: request.Address?.Line1,
            AddressLine2: request.Address?.Line2,
            City: request.Address?.City,
            PostalCode: request.Address?.PostalCode,
            Latitude: request.Address?.Latitude,
            Longitude: request.Address?.Longitude,
            AddressInstructions: request.Address?.Instructions,
            PatientNotes: request.PatientNotes,
            PaymentMethod: request.PaymentMethod ?? string.Empty,
            TypeConfig: request.TypeConfig,
            ExpectedTotalAmount: request.ExpectedTotalAmount,
            PatientLocationChoice: request.PatientLocationChoice,
            PrescriptionFileId: request.PrescriptionFileId);

        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetBookingById),
            new { id = result.Id },
            ApiResponse<CreateBookingResponse>.SuccessResponse(result, "Booking created successfully."));
    }

    // ==================== POST /api/v1/bookings/quote ====================

    /// <summary>
    /// Returns an authoritative pricing quote for a booking without creating it.
    /// </summary>
    [HttpPost("quote")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<BookingQuoteResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<BookingQuoteResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<BookingQuoteResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<BookingQuoteResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<BookingQuoteResponse>>> GetBookingQuote(
        [FromBody] CreateBookingRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<BookingQuoteResponse>.ErrorResponse("Invalid authentication token."));

        var query = new GetBookingQuoteQuery(
            CallerUserId: userId.Value,
            ProviderId: request.ProviderId,
            ServiceItems: request.ServiceItems
                .Select(item => new ServiceItemSelection(item.ServiceId, item.Quantity))
                .ToList()
                .AsReadOnly(),
            StartDate: request.StartDate,
            EndDate: request.EndDate,
            DailyStartTime: request.DailyStartTime,
            AddressLine1: request.Address?.Line1,
            TypeConfig: request.TypeConfig,
            PatientLocationChoice: request.PatientLocationChoice,
            PrescriptionFileId: request.PrescriptionFileId);

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<BookingQuoteResponse>.SuccessResponse(result, "Booking quote calculated successfully."));
    }

    // ==================== GET /api/v1/bookings ====================

    /// <summary>
    /// Returns a paginated list of bookings with optional filtering and sorting.
    /// All roles receive a unified <see cref="GetBookingsResponse"/> with role-specific field nulling:
    /// patients cannot see <c>patient</c> or <c>providerAmount</c>;
    /// providers cannot see <c>provider</c>, <c>validationCode</c>, <c>notes</c>, or rating fields.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<GetBookingsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<GetBookingsResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<GetBookingsResponse>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<GetBookingsResponse>>> GetBookings(
        [FromQuery] GetBookingsRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<GetBookingsResponse>.ErrorResponse("Invalid authentication token."));

        var query = new GetBookingsQuery(
            Page: request.Page,
            Limit: request.Limit,
            Status: request.Status,
            StartDateFrom: request.StartDateFrom,
            StartDateTo: request.StartDateTo,
            PatientId: request.PatientId,
            ProviderId: request.ProviderId,
            ServiceId: request.ServiceId,
            ServiceCategory: request.ServiceCategory,
            SearchQuery: request.SearchQuery,
            SortBy: request.SortBy,
            SortDesc: request.SortDesc,
            CallerUserId: userId.Value,
            IsPatient: _claimsService.HasRole(User, "Patient"),
            IsProvider: _claimsService.HasRole(User, "Provider"),
            IsAdmin: _claimsService.HasRole(User, "Admin"));

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<GetBookingsResponse>.SuccessResponse(result, "Bookings retrieved successfully."));
    }

    // ==================== GET /api/v1/bookings/{id} ====================

    /// <summary>
    /// Returns a single booking by ID.
    /// Only the booking's patient, provider, or an admin may access it.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<BookingResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<BookingResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<BookingResponse>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<BookingResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<BookingResponse>>> GetBookingById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<BookingResponse>.ErrorResponse("Invalid authentication token."));

        var query = new GetBookingByIdQuery(
            BookingId: id,
            CallerUserId: userId.Value,
            IsAdmin: _claimsService.HasRole(User, "Admin"));

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<BookingResponse>.SuccessResponse(result));
    }

    // ==================== PATCH /api/v1/bookings/{id} ====================

    /// <summary>
    /// Updates the delivery address and/or patient notes for a pending or confirmed booking.
    /// Only the booking's patient may call this endpoint.
    /// </summary>
    [HttpPatch("{id:guid}")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<UpdateBookingResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<UpdateBookingResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<UpdateBookingResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<UpdateBookingResponse>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<UpdateBookingResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<UpdateBookingResponse>>> UpdateBooking(
        Guid id,
        [FromBody] UpdateBookingRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<UpdateBookingResponse>.ErrorResponse("Invalid authentication token."));

        var command = new UpdateBookingCommand(
            BookingId: id,
            CallerUserId: userId.Value,
            AddressLine1: request.Address?.Line1,
            City: request.Address?.City,
            PostalCode: request.Address?.PostalCode,
            PatientNotes: request.PatientNotes);

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<UpdateBookingResponse>.SuccessResponse(result, "Booking updated successfully."));
    }

    // ==================== POST /api/v1/bookings/{id}/validate ====================

    /// <summary>
    /// Validates a completed booking by providing the 6-digit validation code.
    /// Only the booking's patient may call this endpoint.
    /// On success, the booking transitions to Validated and escrow funds are released.
    /// </summary>
    [HttpPost("{id:guid}/validate")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<ValidateBookingResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ValidateBookingResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<ValidateBookingResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<ValidateBookingResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ValidateBookingResponse>>> ValidateBooking(
        Guid id,
        [FromBody] ValidateBookingRequest request,
        CancellationToken cancellationToken)
    {
        return StatusCode(
            StatusCodes.Status410Gone,
            ApiResponse<ValidateBookingResponse>.ErrorResponse(
                "Parent booking validation is no longer supported. Complete the executable booking session instead.",
                code: "PARENT_BOOKING_EXECUTION_DISABLED"));
    }

    // ==================== POST /api/v1/bookings/{id}/confirm ====================

    /// <summary>
    /// Confirms a pending booking. Only the assigned provider may confirm.
    /// Transitions the booking from Pending to Confirmed.
    /// </summary>
    [HttpPost("{id:guid}/confirm")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ConfirmBookingResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ConfirmBookingResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<ConfirmBookingResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<ConfirmBookingResponse>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<ConfirmBookingResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ConfirmBookingResponse>>> ConfirmBooking(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<ConfirmBookingResponse>.ErrorResponse("Invalid authentication token."));

        var command = new ConfirmBookingCommand(BookingId: id, CallerUserId: userId.Value);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<ConfirmBookingResponse>.SuccessResponse(result, "Booking confirmed successfully."));
    }

    // ==================== POST /api/v1/bookings/{id}/decline ====================

    /// <summary>
    /// Declines an offered booking by performing the canonical cancellation flow while recording
    /// provider-originated decision metadata for downstream provider UIs.
    /// This endpoint is restricted to provider declines from the pending/offered state.
    /// </summary>
    [HttpPost("{id:guid}/decline")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<CancelBookingResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CancelBookingResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<CancelBookingResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<CancelBookingResponse>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<CancelBookingResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CancelBookingResponse>>> DeclineBooking(
        Guid id,
        [FromBody] CancelBookingRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<CancelBookingResponse>.ErrorResponse("Invalid authentication token."));

        var command = new CancelBookingCommand(
            BookingId: id,
            CallerUserId: userId.Value,
            IsPatient: false,
            IsProvider: true,
            CancellationReason: request.CancellationReason,
            IsDeclineAction: true);

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<CancelBookingResponse>.SuccessResponse(result, "Booking declined successfully."));
    }

    // ==================== POST /api/v1/bookings/{id}/start ====================

    /// <summary>
    /// Advances a booking through the provider delivery lifecycle. Only the assigned provider may call this.
    /// If the booking is Confirmed, it transitions to ProviderOnWay.
    /// If the booking is ProviderOnWay, arrival must already be recorded before it transitions to InProgress.
    /// </summary>
    [HttpPost("{id:guid}/start")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<StartBookingResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<StartBookingResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<StartBookingResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<StartBookingResponse>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<StartBookingResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<StartBookingResponse>>> StartBooking(
        Guid id,
        CancellationToken cancellationToken)
    {
        return StatusCode(
            StatusCodes.Status410Gone,
            ApiResponse<StartBookingResponse>.ErrorResponse(
                "Parent booking start is no longer supported. Use the booking session start-journey or start-service endpoint.",
                code: "PARENT_BOOKING_EXECUTION_DISABLED"));
    }

    // ==================== POST /api/v1/bookings/{id}/arrive ====================

    /// <summary>
    /// Records provider arrival without introducing a dedicated arrived status.
    /// Arrival is tracked only through <c>ProviderArrivedAt</c> and keeps the booking in <c>ProviderOnWay</c>.
    /// </summary>
    [HttpPost("{id:guid}/arrive")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ArriveBookingResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ArriveBookingResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<ArriveBookingResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<ArriveBookingResponse>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<ArriveBookingResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ArriveBookingResponse>>> ArriveBooking(
        Guid id,
        CancellationToken cancellationToken)
    {
        return StatusCode(
            StatusCodes.Status410Gone,
            ApiResponse<ArriveBookingResponse>.ErrorResponse(
                "Parent booking arrival is no longer supported. Use the booking session arrival endpoint.",
                code: "PARENT_BOOKING_EXECUTION_DISABLED"));
    }

    // ==================== POST /api/v1/bookings/{id}/complete ====================

    /// <summary>
    /// Completes an in-progress booking. Only the assigned provider may complete.
    /// Transitions the booking from InProgress to Completed, after which the patient
    /// may validate with a code.
    /// </summary>
    [HttpPost("{id:guid}/complete")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<CompleteBookingResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CompleteBookingResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<CompleteBookingResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<CompleteBookingResponse>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<CompleteBookingResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CompleteBookingResponse>>> CompleteBooking(
        Guid id,
        CancellationToken cancellationToken)
    {
        return StatusCode(
            StatusCodes.Status410Gone,
            ApiResponse<CompleteBookingResponse>.ErrorResponse(
                "Parent booking completion is no longer supported. Complete the executable booking session instead.",
                code: "PARENT_BOOKING_EXECUTION_DISABLED"));
    }

    // ==================== POST /api/v1/bookings/{id}/cancel ====================

    /// <summary>
    /// Cancels a booking. Both patients and providers may cancel, subject to the
    /// booking state machine rules. Cancellation fees are calculated based on status.
    /// </summary>
    [HttpPost("{id:guid}/cancel")]
    [Authorize(Roles = "patient,provider")]
    [ProducesResponseType(typeof(ApiResponse<CancelBookingResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<CancelBookingResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<CancelBookingResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<CancelBookingResponse>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<CancelBookingResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CancelBookingResponse>>> CancelBooking(
        Guid id,
        [FromBody] CancelBookingRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<CancelBookingResponse>.ErrorResponse("Invalid authentication token."));

        var command = new CancelBookingCommand(
            BookingId: id,
            CallerUserId: userId.Value,
            IsPatient: _claimsService.HasRole(User, "Patient"),
            IsProvider: _claimsService.HasRole(User, "Provider"),
            CancellationReason: request.CancellationReason);

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<CancelBookingResponse>.SuccessResponse(result, "Booking cancelled successfully."));
    }

    // ==================== Private Helpers ====================

    private Guid? GetAuthenticatedUserId() => _claimsService.GetUserId(User);
}
