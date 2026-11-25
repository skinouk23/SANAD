using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.ProviderFinance.Commands;
using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Queries;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.ProviderFinance.Controllers;

/// <summary>
/// Provider self-service endpoints for prepaid cash-wallet management.
/// </summary>
[ApiController]
[Authorize(Roles = "provider")]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/providers/me/wallet")]
public class ProviderWalletController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IClaimsService _claimsService;

    public ProviderWalletController(IMediator mediator, IClaimsService claimsService)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    private Guid? GetAuthenticatedUserId() => _claimsService.GetUserId(User);

    /// <summary>
    /// Returns the authenticated provider's prepaid-wallet summary.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<ProviderWalletSummaryResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderWalletSummaryResponse>>> GetMyWallet(CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));
        }

        var result = await _mediator.Send(new GetMyProviderWalletQuery(userId.Value), cancellationToken);
        return Ok(ApiResponse<ProviderWalletSummaryResponse>.SuccessResponse(result, "Wallet summary retrieved successfully."));
    }

    /// <summary>
    /// Returns the authenticated provider's wallet top-ups.
    /// </summary>
    [HttpGet("top-ups")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ProviderWalletTopUpRequestResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProviderWalletTopUpRequestResponse>>>> GetMyWalletTopUps(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));
        }

        var result = await _mediator.Send(new GetMyProviderWalletTopUpsQuery(userId.Value), cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<ProviderWalletTopUpRequestResponse>>.SuccessResponse(result, "Wallet top-up requests retrieved successfully."));
    }

    /// <summary>
    /// Returns aggregate stats for the authenticated provider's unified wallet movements.
    /// </summary>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(ApiResponse<ProviderWalletStatsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderWalletStatsResponse>>> GetMyWalletStats(CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));
        }

        var result = await _mediator.Send(new GetMyProviderWalletStatsQuery(userId.Value), cancellationToken);
        return Ok(ApiResponse<ProviderWalletStatsResponse>.SuccessResponse(result, "Wallet stats retrieved successfully."));
    }

    /// <summary>
    /// Returns the authenticated provider's unified wallet movement history.
    /// </summary>
    [HttpGet("movements")]
    [ProducesResponseType(typeof(ApiResponse<ProviderWalletMovementsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderWalletMovementsResponse>>> GetMyWalletMovements(
        [FromQuery] GetMyProviderWalletMovementsRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));
        }

        var result = await _mediator.Send(
            new GetMyProviderWalletMovementsQuery(
                userId.Value,
                request.Page,
                request.Limit,
                request.Type,
                request.Search,
                request.Month,
                request.Year),
            cancellationToken);

        return Ok(ApiResponse<ProviderWalletMovementsResponse>.SuccessResponse(result, "Wallet movements retrieved successfully."));
    }

    /// <summary>
    /// Creates and credits a wallet top-up for the authenticated provider.
    /// </summary>
    [HttpPost("top-ups/submit")]
    [ProducesResponseType(typeof(ApiResponse<ProviderWalletTopUpRequestResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderWalletTopUpRequestResponse>>> CreateAndSubmitWalletTopUp(
        [FromBody] CreateAndSubmitProviderWalletTopUpRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));
        }

        var result = await _mediator.Send(
            new CreateAndSubmitProviderWalletTopUpCommand(
                userId.Value,
                request.Amount,
                request.Currency,
                request.PaymentChannel,
                request.ProviderTransferReference,
                request.EvidenceUrl),
            cancellationToken);

        return StatusCode(
            StatusCodes.Status201Created,
            ApiResponse<ProviderWalletTopUpRequestResponse>.SuccessResponse(result, "Wallet top-up credited successfully."));
    }

    /// <summary>
    /// Returns the authenticated provider's canonical wallet ledger view.
    /// </summary>
    [HttpGet("ledger")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ProviderWalletLedgerEntryResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProviderWalletLedgerEntryResponse>>>> GetMyWalletLedger(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));
        }

        var result = await _mediator.Send(new GetMyProviderWalletLedgerQuery(userId.Value), cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<ProviderWalletLedgerEntryResponse>>.SuccessResponse(result, "Wallet ledger retrieved successfully."));
    }
}
