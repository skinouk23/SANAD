using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.DTOs;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Nutrition.Queries;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Nutrition.Controllers;

/// <summary>
/// Public endpoints for nutrition configuration lookups.
/// </summary>
[ApiController]
[Authorize]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/nutrition")]
public class NutritionConfigController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="NutritionConfigController"/> class.
    /// </summary>
    public NutritionConfigController(IMediator mediator)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    }

    // ==================== Nutrition Subcategories ====================

    /// <summary>
    /// Returns all active nutrition subcategory options.
    /// </summary>
    [HttpGet("subcategories")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ConfigOptionResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ConfigOptionResponse>>>> GetSubcategories(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetNutritionSubcategoriesQuery(), cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<ConfigOptionResponse>>
            .SuccessResponse(result, "Nutrition subcategories retrieved successfully"));
    }

    // ==================== Nutrition Diet Types ====================

    /// <summary>
    /// Returns all active nutrition diet type options.
    /// </summary>
    [HttpGet("diet-types")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ConfigOptionResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ConfigOptionResponse>>>> GetDietTypes(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetNutritionDietTypesQuery(), cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<ConfigOptionResponse>>
            .SuccessResponse(result, "Nutrition diet types retrieved successfully"));
    }
}
