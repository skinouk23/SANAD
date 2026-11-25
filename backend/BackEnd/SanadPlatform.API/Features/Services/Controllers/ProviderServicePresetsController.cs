using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Services.Commands;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Queries;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Services.Controllers;

/// <summary>
/// Admin endpoints for managing provider service presets.
/// </summary>
[ApiController]
[Authorize(Roles = "admin")]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/provider-service-presets")]
public class ProviderServicePresetsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="ProviderServicePresetsController"/> class.
    /// </summary>
    public ProviderServicePresetsController(IMediator mediator)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    }

    // ==================== Read ====================

    /// <summary>
    /// Returns all provider service presets for the selected provider category.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<AdminProviderServicePresetResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<AdminProviderServicePresetResponse>>>> GetProviderServicePresets(
        [FromQuery] string providerCategory,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetAdminProviderServicePresetsQuery(providerCategory),
            cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<AdminProviderServicePresetResponse>>.SuccessResponse(
            result,
            "Provider service presets retrieved successfully."));
    }

    // ==================== Create ====================

    /// <summary>
    /// Creates a provider service preset.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<AdminProviderServicePresetResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<AdminProviderServicePresetResponse>>> CreateProviderServicePreset(
        [FromBody] CreateProviderServicePresetRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new CreateProviderServicePresetCommand(
                request.ProviderCategory,
                request.Code,
                request.NameEn,
                request.NameFr,
                request.NameAr,
                request.NameDe,
                request.DescriptionEn,
                request.DescriptionFr,
                request.DescriptionAr,
                request.DescriptionDe,
                request.Price,
                request.PriceType,
                request.Currency,
                request.DurationMinutes,
                request.ServiceLocation,
                request.RequiresPrescription,
                request.IsUrgent,
                request.RequiresMedicalHistory,
                request.TypeConfig,
                request.IsActive,
                request.DisplayOrder),
            cancellationToken);

        return CreatedAtAction(
            nameof(GetProviderServicePresets),
            new
            {
                providerCategory = result.ProviderCategory,
                id = result.Id
            },
            ApiResponse<AdminProviderServicePresetResponse>.SuccessResponse(
                result,
                "Provider service preset created successfully."));
    }

    // ==================== Update ====================

    /// <summary>
    /// Updates an existing provider service preset.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<AdminProviderServicePresetResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<AdminProviderServicePresetResponse>>> UpdateProviderServicePreset(
        Guid id,
        [FromBody] UpdateProviderServicePresetRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new UpdateProviderServicePresetCommand(
                id,
                request.NameEn,
                request.NameFr,
                request.NameAr,
                request.NameDe,
                request.DescriptionEn,
                request.DescriptionFr,
                request.DescriptionAr,
                request.DescriptionDe,
                request.Price,
                request.PriceType,
                request.Currency,
                request.DurationMinutes,
                request.ServiceLocation,
                request.RequiresPrescription,
                request.IsUrgent,
                request.RequiresMedicalHistory,
                request.TypeConfig,
                request.IsActive,
                request.DisplayOrder),
            cancellationToken);

        return Ok(ApiResponse<AdminProviderServicePresetResponse>.SuccessResponse(
            result,
            "Provider service preset updated successfully."));
    }

    // ==================== Activation ====================

    /// <summary>
    /// Activates or deactivates a provider service preset.
    /// </summary>
    [HttpPatch("{id:guid}/activation")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> ToggleProviderServicePresetActivation(
        Guid id,
        [FromBody] ToggleProviderServicePresetRequest request,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(
            new ToggleProviderServicePresetCommand(id, request.IsActive),
            cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(
            null!,
            "Provider service preset activation updated successfully."));
    }

    // ==================== Reorder ====================

    /// <summary>
    /// Reorders provider service presets within a category.
    /// </summary>
    [HttpPost("reorder")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> ReorderProviderServicePresets(
        [FromBody] ReorderProviderServicePresetsRequest request,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(
            new ReorderProviderServicePresetsCommand(request.ProviderCategory, request.OrderedIds),
            cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(
            null!,
            "Provider service presets reordered successfully."));
    }

    // ==================== Delete ====================

    /// <summary>
    /// Deletes a provider service preset.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteProviderServicePreset(
        Guid id,
        CancellationToken cancellationToken)
    {
        await _mediator.Send(
            new DeleteProviderServicePresetCommand(id),
            cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(
            null!,
            "Provider service preset deleted successfully."));
    }
}
