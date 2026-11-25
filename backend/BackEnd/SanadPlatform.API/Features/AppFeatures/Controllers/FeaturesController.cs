using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.AppFeatures.DTOs;
using SanadPlatform.API.Features.AppFeatures.Queries;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.AppFeatures.Controllers;

/// <summary>
/// Public endpoints for app feature visibility.
/// </summary>
[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/features")]
public class FeaturesController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="FeaturesController"/> class.
    /// </summary>
    public FeaturesController(IMediator mediator)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    }

    /// <summary>
    /// Returns all global app features ordered by display order, including inactive rows.
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<FeatureResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<FeatureResponse>>>> GetFeatures(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetFeaturesQuery(), cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<FeatureResponse>>
            .SuccessResponse(result, "Features retrieved successfully"));
    }
}
