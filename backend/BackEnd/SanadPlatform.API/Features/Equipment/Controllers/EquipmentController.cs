using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Equipment.DTOs;
using SanadPlatform.API.Features.Equipment.Queries;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Equipment.Controllers;

/// <summary>
/// Patient-facing, anonymous endpoints for browsing the equipment catalog.
/// </summary>
[ApiController]
[Authorize]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/equipment")]
public class EquipmentController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="EquipmentController"/> class.
    /// </summary>
    public EquipmentController(IMediator mediator)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    }

    // ==================== Categories ====================

    /// <summary>
    /// Returns all active equipment categories.
    /// </summary>
    [HttpGet("categories")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<EquipmentCategoryResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<EquipmentCategoryResponse>>>> GetCategories(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetEquipmentCategoriesQuery(), cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<EquipmentCategoryResponse>>
            .SuccessResponse(result, "Categories retrieved successfully"));
    }

    // ==================== Catalog ====================

    /// <summary>
    /// Returns a paginated list of equipment, filterable by category,
    /// search text, availability, and price range.
    /// </summary>
    [HttpGet("catalog")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<EquipmentCatalogResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<EquipmentCatalogResponse>>> GetCatalog(
        [FromQuery] GetEquipmentRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetEquipmentCatalogQuery(
                Page: request.Page,
                Limit: request.Limit,
                Category: request.Category,
                Search: request.Search,
                SortBy: request.SortBy,
                SortDesc: request.SortDesc,
                Available: request.Available,
                MinPrice: request.MinPrice,
                MaxPrice: request.MaxPrice),
            cancellationToken);

        return Ok(ApiResponse<EquipmentCatalogResponse>
            .SuccessResponse(result, "Catalog retrieved"));
    }

    // ==================== Detail ====================

    /// <summary>
    /// Returns the full detail for a single piece of equipment.
    /// Requires authentication to protect provider contact information.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<EquipmentDetailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<EquipmentDetailResponse>>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetEquipmentDetailQuery(id), cancellationToken);

        return Ok(ApiResponse<EquipmentDetailResponse>
            .SuccessResponse(result, "Equipment retrieved successfully"));
    }
}
