using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Authentication.Commands;
using SanadPlatform.API.Features.Authentication.DTOs;
using SanadPlatform.API.Features.Authentication.Queries;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Authentication.Controllers;

/// <summary>
/// Authentication endpoints: registration, login, token refresh, profile retrieval,
/// and authenticated account security operations.
/// </summary>
[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IClaimsService _claimsService;

    public AuthController(IMediator mediator, IClaimsService claimsService)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    // ==================== Helper Methods ====================

    /// <summary>Extracts the authenticated user's ID from claims.</summary>
    private Guid? GetAuthenticatedUserId() =>
        _claimsService.GetUserId(User);

    /// <summary>Extracts the authenticated session's ID from claims.</summary>
    private Guid? GetAuthenticatedSessionId() =>
        _claimsService.GetSessionId(User);

    /// <summary>Extracts the authenticated user's role from claims.</summary>
    private string? GetAuthenticatedUserRole() =>
        _claimsService.GetRole(User);

    /// <summary>Extracts the caller's IP address from the HTTP context.</summary>
    private string? GetIpAddress() =>
        HttpContext.Connection.RemoteIpAddress?.ToString();

    /// <summary>Extracts the caller's User-Agent header.</summary>
    private string? GetUserAgent() =>
        Request.Headers.UserAgent.ToString();

    // ==================== Endpoints ====================

    /// <summary>
    /// Register a new user account (patient or provider).
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<RegistrationResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<RegistrationResponse>>> Register(
        RegisterUserRequest request,
        CancellationToken cancellationToken)
    {
        // No try-catch: all exceptions propagate to GlobalExceptionHandlingMiddleware,
        // which maps ValidationException → 400, InvalidOperationException → 400, etc.
        var command = new RegisterUserCommand(
            request.Email,
            request.Password,
            request.FirstName,
            request.LastName,
            request.Phone,
            request.City,
            request.Address,
            request.Role,
            request.ServiceType,
            request.NutritionProviderSubtype,
            request.VerificationConsentGiven,
            request.ProviderApplicationId,
            request.ProviderDocuments,
            request.CountryCode,
            request.DeviceFingerprint,
            GetIpAddress(),
            GetUserAgent());

        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetProfile),
            ApiResponse<RegistrationResponse>.SuccessResponse(
                result,
                result.RequiresApproval
                    ? "Provider registration submitted for admin approval. Login will be available after approval."
                    : "Registration successful. Please verify your email."));
    }

    /// <summary>
    /// Authenticate with email and password; returns a JWT access token and a refresh token.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var command = new LoginUserCommand(
            request.Email,
            request.Password,
            request.RememberMe,
            request.DeviceFingerprint,
            GetIpAddress(),
            GetUserAgent());

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(ApiResponse<LoginResponse>.SuccessResponse(result, "Login successful"));
    }

    /// <summary>
    /// Request an email or SMS OTP for passwordless login.
    /// </summary>
    [HttpPost("login/otp/request")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<RequestLoginOtpResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<RequestLoginOtpResponse>>> RequestLoginOtp(
        RequestLoginOtpRequest request,
        CancellationToken cancellationToken)
    {
        var command = new RequestLoginOtpCommand(
            request.Channel,
            request.Email,
            request.PhoneNumber,
            request.RememberMe,
            request.DeviceFingerprint,
            GetIpAddress(),
            GetUserAgent());

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(ApiResponse<RequestLoginOtpResponse>.SuccessResponse(
            result,
            "If the account can use OTP, a verification code has been sent."));
    }

    /// <summary>
    /// Verify a login OTP and return a JWT access token plus refresh token.
    /// </summary>
    [HttpPost("login/otp/verify")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> VerifyLoginOtp(
        VerifyLoginOtpRequest request,
        CancellationToken cancellationToken)
    {
        var command = new VerifyLoginOtpCommand(
            request.ChallengeId,
            request.Code,
            request.RememberMe,
            request.DeviceFingerprint,
            GetIpAddress(),
            GetUserAgent());

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(ApiResponse<LoginResponse>.SuccessResponse(result, "Login successful"));
    }

    /// <summary>
    /// Exchange a valid refresh token for a new access token + refresh token pair
    /// (single-use rotation). Replaying a consumed token revokes all sessions for
    /// that user (stolen-token detection).
    /// </summary>
    [HttpPost("refresh-token")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> RefreshToken(
        RefreshTokenRequest request,
        CancellationToken cancellationToken)
    {
        var command = new RefreshTokenCommand(
            request.RefreshToken,
            request.DeviceFingerprint,
            GetIpAddress(),
            GetUserAgent());

        var result = await _mediator.Send(command, cancellationToken);
        return Ok(ApiResponse<LoginResponse>.SuccessResponse(result, "Token refreshed successfully"));
    }

    /// <summary>
    /// Revoke the current session when authenticated, or revoke the supplied refresh-token session.
    /// </summary>
    [HttpPost("logout")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<object>>> Logout(
        [FromBody(EmptyBodyBehavior = EmptyBodyBehavior.Allow)] LogoutRequest? request,
        CancellationToken cancellationToken)
    {
        var command = new LogoutUserCommand(
            GetAuthenticatedUserId(),
            GetAuthenticatedSessionId(),
            request?.RefreshToken);

        await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(new { }, "Logout successful"));
    }

    /// <summary>
    /// Retrieve the profile of the currently authenticated user.
    /// </summary>
    [HttpGet("profile")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<UserResponse>>> GetProfile(CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var query = new GetUserProfileQuery(userId.Value);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(ApiResponse<UserResponse>.SuccessResponse(result, "Profile retrieved successfully"));
    }

    /// <summary>
    /// Update the shared account profile state of the currently authenticated user.
    /// </summary>
    [HttpPut("account")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<UserResponse>>> UpdateAccount(
        UpdateAccountProfileRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        var userRole = GetAuthenticatedUserRole();

        if (!userId.HasValue || string.IsNullOrWhiteSpace(userRole))
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var command = new UpdateAccountProfileCommand(userId.Value, userRole, request);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<UserResponse>.SuccessResponse(result, "Account profile updated successfully"));
    }

    /// <summary>
    /// Retrieve the authenticated user's live security state, including session inventory.
    /// </summary>
    [HttpGet("security")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<SecurityOverviewResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<SecurityOverviewResponse>>> GetSecurityOverview(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        var sessionId = GetAuthenticatedSessionId();

        if (!userId.HasValue || !sessionId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var query = new GetSecurityOverviewQuery(userId.Value, sessionId.Value);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<SecurityOverviewResponse>.SuccessResponse(result, "Security overview retrieved successfully"));
    }

    /// <summary>
    /// Change the authenticated user's password and revoke all other live sessions.
    /// </summary>
    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<object>>> ChangePassword(
        ChangePasswordRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        var sessionId = GetAuthenticatedSessionId();

        if (!userId.HasValue || !sessionId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var command = new ChangePasswordCommand(
            userId.Value,
            sessionId.Value,
            request.CurrentPassword,
            request.NewPassword);

        await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(new { }, "Password changed successfully"));
    }

    /// <summary>
    /// Delete the authenticated user's account after confirming the current password.
    /// </summary>
    [HttpPost("delete-account")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteAccount(
        DeleteAccountRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var command = new DeleteAccountCommand(
            userId.Value,
            request.CurrentPassword,
            GetIpAddress(),
            GetUserAgent());

        await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(new { }, "Account deleted successfully"));
    }

    /// <summary>
    /// Revoke a single non-current session owned by the authenticated user.
    /// </summary>
    [HttpDelete("sessions/{sessionId:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> RevokeSession(
        Guid sessionId,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        var currentSessionId = GetAuthenticatedSessionId();

        if (!userId.HasValue || !currentSessionId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var command = new RevokeSessionCommand(userId.Value, currentSessionId.Value, sessionId);
        await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(new { }, "Session revoked successfully"));
    }

    /// <summary>
    /// Revoke all live sessions for the authenticated user except the current session.
    /// </summary>
    [HttpPost("sessions/revoke-others")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<object>>> RevokeOtherSessions(CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        var currentSessionId = GetAuthenticatedSessionId();

        if (!userId.HasValue || !currentSessionId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var command = new RevokeOtherSessionsCommand(userId.Value, currentSessionId.Value);
        await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(new { }, "Other sessions revoked successfully"));
    }
}
