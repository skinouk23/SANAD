using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.DTOs;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Veterinary.Queries;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Veterinary.Controllers;

/// <summary>
/// Public endpoints for veterinary configuration lookups.
/// </summary>
[ApiController]
[Authorize]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/veterinary")]
public class VeterinaryConfigController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="VeterinaryConfigController"/> class.
    /// </summary>
    public VeterinaryConfigController(IMediator mediator)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    }

    // ==================== Veterinary Animal Types ====================

    /// <summary>
    /// Returns all active veterinary animal type options.
    /// </summary>
    [HttpGet("animal-types")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ConfigOptionResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ConfigOptionResponse>>>> GetAnimalTypes(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetVeterinaryAnimalTypesQuery(), cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<ConfigOptionResponse>>
            .SuccessResponse(result, "Veterinary animal types retrieved successfully"));
    }
}
