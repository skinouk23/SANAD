using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using MediatR;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Services.Commands;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Queries;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Services.Controllers;

/// <summary>
/// Provider service management endpoints.
/// All endpoints are scoped to the authenticated provider via the JWT token.
/// Routes: api/v1/providers/me/services/...
/// </summary>
[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/providers/me/services")]
[Authorize(Roles = "provider")]
public class ProviderServicesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IClaimsService _claimsService;

    /// <summary>
    /// Initializes a new instance of <see cref="ProviderServicesController"/>.
    /// </summary>
    public ProviderServicesController(IMediator mediator, IClaimsService claimsService)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    // ==================== Helpers ====================

    private Guid? GetAuthenticatedUserId() => _claimsService.GetUserId(User);

    // ==================== List & Detail ====================

    /// <summary>
    /// Get a paginated list of services for the authenticated provider.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<ProviderServiceListResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderServiceListResponse>>> GetMyServices(
        [FromQuery] GetProviderServicesRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token."));

        var result = await _mediator.Send(
            new GetProviderServicesQuery(
                userId.Value, request.Search, request.IsActive,
                request.SortBy, request.SortDesc, request.Page, request.Limit),
            cancellationToken);

        return Ok(ApiResponse<ProviderServiceListResponse>.SuccessResponse(
            result, "Services retrieved successfully."));
    }

    /// <summary>
    /// Get full details of a specific service owned by the authenticated provider.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ServiceDetailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ServiceDetailResponse>>> GetMyServiceDetail(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token."));

        var result = await _mediator.Send(
            new GetProviderServiceDetailQuery(userId.Value, id),
            cancellationToken);

        return Ok(ApiResponse<ServiceDetailResponse>.SuccessResponse(
            result, "Service detail retrieved successfully."));
    }

    /// <summary>
    /// Get localized default service presets for the authenticated provider's category.
    /// </summary>
    [HttpGet("presets")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ProviderServicePresetResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProviderServicePresetResponse>>>> GetMyServicePresets(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token."));

        var result = await _mediator.Send(
            new GetProviderPresetsQuery(userId.Value),
            cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<ProviderServicePresetResponse>>.SuccessResponse(
            result, "Service presets retrieved successfully."));
    }

    // ==================== Create ====================

    /// <summary>
    /// Create a new service for the authenticated provider.
    /// The service category is automatically inherited from the provider's ServiceCategory.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ServiceDetailResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<ServiceDetailResponse>>> CreateService(
        [FromBody] CreateServiceRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token."));

        var result = await _mediator.Send(
            new CreateServiceCommand(
                UserId: userId.Value,
                Name: request.Name,
                Description: request.Description,
                ShortDescription: request.ShortDescription,
                Price: request.Price,
                PriceType: request.PriceType,
                Currency: request.Currency,
                MinPrice: request.MinPrice,
                MaxPrice: request.MaxPrice,
                DurationMinutes: request.DurationMinutes,
                MinDurationMinutes: request.MinDurationMinutes,
                MaxDurationMinutes: request.MaxDurationMinutes,
                ServiceLocation: request.ServiceLocation,
                RequiresPrescription: request.RequiresPrescription,
                IsUrgent: request.IsUrgent,
                RequiresMedicalHistory: request.RequiresMedicalHistory,
                AgeRestrictionMin: request.AgeRestrictionMin,
                AgeRestrictionMax: request.AgeRestrictionMax,
                TypeConfig: request.TypeConfig,
                SubServices: request.SubServices),
            cancellationToken);

        return CreatedAtAction(
            nameof(GetMyServiceDetail),
            new { id = result.Id },
            ApiResponse<ServiceDetailResponse>.SuccessResponse(result, "Service created successfully."));
    }

    // ==================== Update ====================

    /// <summary>
    /// Update an existing service owned by the authenticated provider.
    /// Supports partial updates — only non-null fields are applied.
    /// Sub-services use full-replacement: present IDs updated, new entries created, omitted removed.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ServiceDetailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<ServiceDetailResponse>>> UpdateService(
        Guid id,
        [FromBody] UpdateServiceRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token."));

        var result = await _mediator.Send(
            new UpdateServiceCommand(
                UserId: userId.Value,
                ServiceId: id,
                Name: request.Name,
                Description: request.Description,
                ShortDescription: request.ShortDescription,
                Price: request.Price,
                PriceType: request.PriceType,
                Currency: request.Currency,
                MinPrice: request.MinPrice,
                MaxPrice: request.MaxPrice,
                DurationMinutes: request.DurationMinutes,
                MinDurationMinutes: request.MinDurationMinutes,
                MaxDurationMinutes: request.MaxDurationMinutes,
                ServiceLocation: request.ServiceLocation,
                RequiresPrescription: request.RequiresPrescription,
                IsUrgent: request.IsUrgent,
                RequiresMedicalHistory: request.RequiresMedicalHistory,
                AgeRestrictionMin: request.AgeRestrictionMin,
                AgeRestrictionMax: request.AgeRestrictionMax,
                TypeConfig: request.TypeConfig,
                SubServices: request.SubServices),
            cancellationToken);

        return Ok(ApiResponse<ServiceDetailResponse>.SuccessResponse(
            result, "Service updated successfully."));
    }

    // ==================== Toggle Active Status ====================

    /// <summary>
    /// Toggle a service's active status.
    /// Deactivation is blocked if the service has active bookings (Pending, Confirmed, ProviderOnWay, or InProgress).
    /// </summary>
    [HttpPatch("{id:guid}/toggle")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> ToggleService(
        Guid id,
        [FromBody] ToggleServiceRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token."));

        await _mediator.Send(
            new ToggleServiceCommand(userId.Value, id, request.IsActive),
            cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Service toggled successfully."));
    }

    // ==================== Delete ====================

    /// <summary>
    /// Soft-delete a service owned by the authenticated provider.
    /// Deletion is blocked if the service has active bookings (Pending, Confirmed, ProviderOnWay, or InProgress).
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteService(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token."));

        await _mediator.Send(
            new DeleteServiceCommand(userId.Value, id),
            cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Service deleted successfully."));
    }

    // ==================== Photo Upload ====================

    /// <summary>
    /// Attach an uploaded service-photo asset to a service.
    /// </summary>
    [HttpPost("{id:guid}/photos")]
    [ProducesResponseType(typeof(ApiResponse<ServicePhotoResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ServicePhotoResponse>>> AttachPhoto(
        Guid id,
        [FromBody] AttachServicePhotoRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token."));

        var result = await _mediator.Send(
            new AttachServicePhotoCommand(userId.Value, id, request.FileId, request.IsMain, request.SortOrder),
            cancellationToken);

        return Ok(ApiResponse<ServicePhotoResponse>.SuccessResponse(
            result, "Photo attached successfully."));
    }

    // ==================== Stats ====================

    /// <summary>
    /// Get aggregate statistics for the authenticated provider's services.
    /// </summary>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(ApiResponse<ServiceStatsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ServiceStatsResponse>>> GetMyServiceStats(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token."));

        var result = await _mediator.Send(
            new GetProviderServiceStatsQuery(userId.Value),
            cancellationToken);

        return Ok(ApiResponse<ServiceStatsResponse>.SuccessResponse(
            result, "Service statistics retrieved successfully."));
    }
}
