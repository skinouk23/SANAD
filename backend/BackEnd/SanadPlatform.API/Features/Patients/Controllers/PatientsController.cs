using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Patients.Commands;
using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Queries;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Patients.Controllers;

/// <summary>
/// API controller for patient management endpoints.
/// Handles patient profile creation, retrieval, updates, and deletion.
/// </summary>
[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class PatientsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IClaimsService _claimsService;

    /// <summary>
    /// Initializes controller with dependencies.
    /// </summary>
    public PatientsController(IMediator mediator, IClaimsService claimsService)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    // ==================== Endpoints ====================

    /// <summary>
    /// Retrieves the full profile of the authenticated patient.
    /// 
    /// HTTP GET /api/v1/patients/me
    /// </summary>
    [HttpGet("me")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<MyPatientProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<MyPatientProfileResponse>>> GetMe(CancellationToken cancellationToken)
    {
        var userId = _claimsService.GetUserId(User);
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var query = new GetMyPatientProfileQuery(userId.Value);
        var profile = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<MyPatientProfileResponse>.SuccessResponse(profile, "Patient profile retrieved successfully"));
    }

    /// <summary>
    /// Updates the full profile of the authenticated patient.
    /// 
    /// HTTP PUT /api/v1/patients/me
    /// </summary>
    [HttpPut("me")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<MyPatientProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<MyPatientProfileResponse>>> UpdateMe(
        [FromBody] UpdatePatientProfileRequest request,
        CancellationToken cancellationToken)
    {
        var userId = _claimsService.GetUserId(User);
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var command = new UpdatePatientProfileCommand(
            UserId: userId.Value,
            FirstName: request.FirstName,
            LastName: request.LastName,
            DateOfBirth: request.DateOfBirth,
            Gender: request.Gender,
            Address: request.Address,
            City: request.City,
            PostalCode: request.PostalCode,
            Latitude: request.Latitude,
            Longitude: request.Longitude,
            EmergencyContactName: request.EmergencyContactName,
            EmergencyContactPhone: request.EmergencyContactPhone,
            EmergencyContactRelationship: request.EmergencyContactRelationship,
            MedicalHistory: request.MedicalHistory,
            Allergies: request.Allergies,
            CurrentMedications: request.CurrentMedications,
            InsuranceProvider: request.InsuranceProvider,
            InsuranceNumber: request.InsuranceNumber
        );
        var profile = await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<MyPatientProfileResponse>.SuccessResponse(profile, "Profile updated successfully"));
    }

    /// <summary>
    /// Retrieves patient engagement statistics.
    /// 
    /// HTTP GET /api/v1/patients/me/stats
    /// </summary>
    [HttpGet("me/stats")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<PatientStatsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PatientStatsResponse>>> GetMyStats(CancellationToken cancellationToken)
    {
        var userId = _claimsService.GetUserId(User);
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var query = new GetPatientStatsQuery(userId.Value);
        var stats = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<PatientStatsResponse>.SuccessResponse(stats, "Patient statistics retrieved successfully"));
    }

    /// <summary>
    /// Retrieves patient's family circle members.
    /// 
    /// HTTP GET /api/v1/patients/me/family-circle
    /// </summary>
    [HttpGet("me/family-circle")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<FamilyMemberResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<FamilyMemberResponse>>>> GetFamilyCircle(CancellationToken cancellationToken)
    {
        var userId = _claimsService.GetUserId(User);
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var query = new GetFamilyCircleQuery(userId.Value);
        var members = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<FamilyMemberResponse>>.SuccessResponse(members, "Family circle members retrieved successfully"));
    }

    /// <summary>
    /// Adds a family member to the authenticated patient's circle.
    /// </summary>
    [HttpPost("me/family-circle")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<FamilyMemberResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<FamilyMemberResponse>>> AddFamilyMember(
        [FromBody] AddFamilyMemberRequest request,
        CancellationToken cancellationToken)
    {
        var userId = _claimsService.GetUserId(User);
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var command = new AddFamilyMemberCommand(
            userId.Value,
            request.FirstName,
            request.LastName,
            request.Relationship,
            request.DateOfBirth,
            request.Gender,
            request.Email,
            request.MedicalHistory,
            request.Allergies,
            request.CurrentMedications
        );

        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(nameof(GetFamilyCircle),
            ApiResponse<FamilyMemberResponse>.SuccessResponse(result, "Family member added successfully"));
    }

    /// <summary>
    /// Removes a family member from the authenticated patient's circle.
    /// 
    /// HTTP DELETE /api/v1/patients/me/family-circle/{memberId}
    /// </summary>
    [HttpDelete("me/family-circle/{memberId:guid}")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteFamilyMember(
        [FromRoute] Guid memberId,
        CancellationToken cancellationToken)
    {
        var userId = _claimsService.GetUserId(User);
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var command = new DeleteFamilyMemberCommand(userId.Value, memberId);
        await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Family member removed successfully"));
    }

    /// <summary>
    /// Retrieves the authenticated patient's favorite providers.
    /// 
    /// HTTP GET /api/v1/patients/me/favorites
    /// </summary>
    [HttpGet("me/favorites")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<PatientFavoriteResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<PatientFavoriteResponse>>>> GetFavorites(CancellationToken cancellationToken)
    {
        var userId = _claimsService.GetUserId(User);
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var query = new GetPatientFavoritesQuery(userId.Value);
        var favorites = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<PatientFavoriteResponse>>.SuccessResponse(favorites, "Favorite providers retrieved successfully"));
    }

    /// <summary>
    /// Adds a provider to the authenticated patient's favorites.
    /// 
    /// HTTP POST /api/v1/patients/me/favorites
    /// </summary>
    [HttpPost("me/favorites")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<PatientFavoriteSlimResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<PatientFavoriteSlimResponse>>> AddFavorite(
        [FromBody] AddFavoriteRequest request,
        CancellationToken cancellationToken)
    {
        var userId = _claimsService.GetUserId(User);
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var command = new AddProviderToFavoritesCommand(userId.Value, request.ProviderId);
        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(nameof(GetFavorites),
            ApiResponse<PatientFavoriteSlimResponse>.SuccessResponse(result, "Provider added to favorites"));
    }

    /// <summary>
    /// Retrieves the authenticated patient's notification and privacy preferences.
    /// 
    /// HTTP GET /api/v1/patients/me/preferences
    /// </summary>
    [HttpGet("me/preferences")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<PatientPreferencesResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PatientPreferencesResponse>>> GetPreferences(CancellationToken cancellationToken)
    {
        var userId = _claimsService.GetUserId(User);
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var query = new GetPatientPreferencesQuery(userId.Value);
        var preferences = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<PatientPreferencesResponse>.SuccessResponse(preferences, "Patient preferences retrieved successfully"));
    }

    /// <summary>
    /// Updates the authenticated patient's notification and privacy preferences.
    /// 
    /// HTTP PUT /api/v1/patients/me/preferences
    /// </summary>
    [HttpPut("me/preferences")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<PatientPreferencesResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PatientPreferencesResponse>>> UpdatePreferences(
        [FromBody] UpdatePatientPreferencesRequest request,
        CancellationToken cancellationToken)
    {
        var userId = _claimsService.GetUserId(User);
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var command = new UpdatePatientPreferencesCommand(
            UserId: userId.Value,
            EmailNotifications: request.EmailNotifications,
            SmsNotifications: request.SmsNotifications,
            PushNotifications: request.PushNotifications,
            MarketingEmails: request.MarketingEmails,
            AutoValidationEnabled: request.AutoValidationEnabled,
            ValidationReminderHours: request.ValidationReminderHours,
            ShareWithFamily: request.ShareWithFamily,
            AllowProviderMessages: request.AllowProviderMessages
        );
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<PatientPreferencesResponse>.SuccessResponse(result, "Preferences updated successfully"));
    }

    /// <summary>
    /// Removes a provider from the authenticated patient's favorites.
    /// 
    /// HTTP DELETE /api/v1/patients/me/favorites/{providerId}
    /// </summary>
    [HttpDelete("me/favorites/{providerId:guid}")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteFavorite(
        [FromRoute] Guid providerId,
        CancellationToken cancellationToken)
    {
        var userId = _claimsService.GetUserId(User);
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid user token"));
        }

        var command = new DeleteProviderFromFavoritesCommand(userId.Value, providerId);
        await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<object>.SuccessResponse(null!, "Provider removed from favorites"));
    }
}
