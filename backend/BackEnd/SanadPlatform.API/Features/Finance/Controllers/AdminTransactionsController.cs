using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Finance.DTOs;
using SanadPlatform.API.Features.Finance.Queries;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Finance.Controllers;

/// <summary>
/// Admin read endpoints for the transaction hub page.
/// </summary>
[ApiController]
[Authorize(Roles = "admin")]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/admin/transactions")]
public class AdminTransactionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminTransactionsController(IMediator mediator)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    }

    /// <summary>
    /// Returns the admin transaction datasets used by the frontend page.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<AdminTransactionsResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<AdminTransactionsResponse>>> GetTransactions(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAdminTransactionsQuery(), cancellationToken);

        return Ok(
            ApiResponse<AdminTransactionsResponse>.SuccessResponse(
                result,
                "Admin transactions retrieved successfully."));
    }
}
