using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Queries;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Services.Controllers;

/// <summary>
/// Public, anonymous endpoints for browsing the service catalog.
/// All endpoints are <c>[AllowAnonymous]</c> — no class-level <c>[Authorize]</c>.
/// Separate from <see cref="ProviderServicesController"/> which is provider-scoped and authorized.
/// </summary>
[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/service-catalog")]
public class ServiceCatalogController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="ServiceCatalogController"/> class.
    /// </summary>
    public ServiceCatalogController(IMediator mediator)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    }

    // ==================== Categories ====================

    /// <summary>
    /// Returns all active service categories grouped by display group
    /// (Medical, Daily, Rehabilitation, Wellness).
    /// </summary>
    [HttpGet("categories")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ServiceCategoryGroupResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ServiceCategoryGroupResponse>>>> GetCategories(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetServiceCategoriesQuery(), cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<ServiceCategoryGroupResponse>>
            .SuccessResponse(result, "Service categories retrieved successfully"));
    }

    // ==================== Catalog ====================

    /// <summary>
    /// Returns a paginated list of active services, filterable by display group,
    /// category, search text, and price range.
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PatientServiceCatalogResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PatientServiceCatalogResponse>>> GetCatalog(
        [FromQuery] GetServiceCatalogRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetServiceCatalogQuery(
                DisplayGroup: request.DisplayGroup,
                Category: request.Category,
                ProviderId: request.ProviderId,
                Search: request.Search,
                MinPrice: request.MinPrice,
                MaxPrice: request.MaxPrice,
                SortBy: request.SortBy,
                SortDesc: request.SortDesc,
                Page: request.Page,
                Limit: request.Limit),
            cancellationToken);

        return Ok(ApiResponse<PatientServiceCatalogResponse>
            .SuccessResponse(result, "Service catalog retrieved successfully"));
    }

    // ==================== Detail ====================

    /// <summary>
    /// Returns the full detail for a single service.
    /// </summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PatientServiceDetailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PatientServiceDetailResponse>>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetServiceDetailQuery(id), cancellationToken);

        return Ok(ApiResponse<PatientServiceDetailResponse>
            .SuccessResponse(result, "Service retrieved successfully"));
    }
}