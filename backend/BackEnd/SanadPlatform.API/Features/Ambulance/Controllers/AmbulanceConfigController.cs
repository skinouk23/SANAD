using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.DTOs;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Ambulance.Queries;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Ambulance.Controllers;

/// <summary>
/// Public endpoints for ambulance configuration lookups.
/// </summary>
[ApiController]
[Authorize]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/ambulance")]
public class AmbulanceConfigController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="AmbulanceConfigController"/> class.
    /// </summary>
    public AmbulanceConfigController(IMediator mediator)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    }

    // ==================== Ambulance Service Types ====================

    /// <summary>
    /// Returns all active ambulance service type options.
    /// </summary>
    [HttpGet("service-types")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ConfigOptionResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ConfigOptionResponse>>>> GetServiceTypes(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAmbulanceServiceTypesQuery(), cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<ConfigOptionResponse>>
            .SuccessResponse(result, "Ambulance service types retrieved successfully"));
    }
}
