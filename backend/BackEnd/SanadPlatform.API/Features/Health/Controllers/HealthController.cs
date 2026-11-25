using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;

namespace SanadPlatform.API.Features.Health.Controllers;

/// <summary>
/// Health check endpoints
/// Used for monitoring and load balancer health checks
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly ILogger<HealthController> _logger;

    public HealthController(ILogger<HealthController> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Liveness probe - indicates if the service is running
    /// </summary>
    [HttpGet("live")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public ActionResult<ApiResponse<object>> GetLiveness()
    {
        return Ok(ApiResponse<object>.SuccessResponse(new { status = "alive" }, "Service is running"));
    }

    /// <summary>
    /// Readiness probe - indicates if the service is ready to accept requests
    /// </summary>
    [HttpGet("ready")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public ActionResult<ApiResponse<object>> GetReadiness()
    {
        return Ok(ApiResponse<object>.SuccessResponse(new { status = "ready" }, "Service is ready"));
    }

    /// <summary>
    /// Version endpoint
    /// </summary>
    [HttpGet("version")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public ActionResult<ApiResponse<object>> GetVersion()
    {
        var version = typeof(Program).Assembly.GetName().Version?.ToString() ?? "1.0.0";
        return Ok(ApiResponse<object>.SuccessResponse(new { version }, "API version retrieved"));
    }
}
