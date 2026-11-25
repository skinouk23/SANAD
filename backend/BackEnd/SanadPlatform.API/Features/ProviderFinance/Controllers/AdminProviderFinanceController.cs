using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Queries;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.ProviderFinance.Controllers;

/// <summary>
/// Admin read endpoints for provider wallet finance data.
/// </summary>
[ApiController]
[Authorize(Roles = "admin")]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/admin/provider-finance")]
public class AdminProviderFinanceController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminProviderFinanceController(IMediator mediator)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
    }

    /// <summary>
    /// Returns admin-facing provider wallet top-ups.
    /// </summary>
    [HttpGet("top-up-requests")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<AdminProviderFinanceTopUpRequestResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<AdminProviderFinanceTopUpRequestResponse>>>> GetTopUpRequests(
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAdminProviderFinanceTopUpRequestsQuery(), cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<AdminProviderFinanceTopUpRequestResponse>>.SuccessResponse(result, "Top-up requests retrieved successfully."));
    }

    /// <summary>
    /// Returns the prepaid-wallet summary for a provider.
    /// </summary>
    [HttpGet("providers/{providerId:guid}/wallet")]
    [ProducesResponseType(typeof(ApiResponse<AdminProviderWalletSummaryResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<AdminProviderWalletSummaryResponse>>> GetProviderWallet(
        Guid providerId,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAdminProviderWalletQuery(providerId), cancellationToken);
        return Ok(ApiResponse<AdminProviderWalletSummaryResponse>.SuccessResponse(result, "Provider wallet summary retrieved successfully."));
    }
}
