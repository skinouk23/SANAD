using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Files.DTOs;
using SanadPlatform.API.Features.Files.Services;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Files.Controllers;

/// <summary>
/// Token-protected anonymous provider signup file endpoints. These endpoints do not use cookies.
/// </summary>
[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/provider-signup-applications")]
[AllowAnonymous]
public class ProviderSignupApplicationsController : ControllerBase
{
    private readonly IProviderSignupUploadTokenService _tokenService;
    private readonly IFileUploadService _fileUploadService;
    private readonly IFileContentService _fileContentService;

    public ProviderSignupApplicationsController(
        IProviderSignupUploadTokenService tokenService,
        IFileUploadService fileUploadService,
        IFileContentService fileContentService)
    {
        _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        _fileUploadService = fileUploadService ?? throw new ArgumentNullException(nameof(fileUploadService));
        _fileContentService = fileContentService ?? throw new ArgumentNullException(nameof(fileContentService));
    }

    /// <summary>
    /// Initializes an anonymous provider signup draft application and returns a short-lived token for document uploads.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ProviderSignupDraftApplicationResponse>), StatusCodes.Status201Created)]
    public ActionResult<ApiResponse<ProviderSignupDraftApplicationResponse>> CreateDraftApplication()
    {
        var issued = _tokenService.Issue();
        var response = new ProviderSignupDraftApplicationResponse
        {
            ApplicationId = issued.ApplicationId,
            UploadToken = issued.Token,
            UploadTokenExpiresAt = issued.ExpiresAt
        };

        return Created(
            $"/api/v1/provider-signup-applications/{response.ApplicationId}",
            ApiResponse<ProviderSignupDraftApplicationResponse>.SuccessResponse(response, "Provider signup draft application initialized."));
    }

    /// <summary>
    /// Accepts a provider signup document for an unauthenticated applicant using an application-bound upload token.
    /// </summary>
    [HttpPost("{applicationId:guid}/files")]
    [RequestSizeLimit(100_000_000)]
    [RequestFormLimits(MultipartBodyLengthLimit = 100_000_000)]
    [ProducesResponseType(typeof(ApiResponse<FileUploadResponse>), StatusCodes.Status202Accepted)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<FileUploadResponse>>> Upload(
        Guid applicationId,
        [FromForm] IFormFile file,
        CancellationToken cancellationToken)
    {
        _tokenService.Validate(GetUploadToken(), applicationId);

        var result = await _fileUploadService.UploadProviderSignupAsync(
            file,
            applicationId,
            GetCorrelationId(),
            cancellationToken);

        return Accepted(ApiResponse<FileUploadResponse>.SuccessResponse(result, "Provider signup file accepted for scanning."));
    }

    /// <summary>
    /// Reads metadata for a provider signup file using an application-bound upload token.
    /// </summary>
    [HttpGet("{applicationId:guid}/files/{fileId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<FileMetadataResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<FileMetadataResponse>>> GetFileMetadata(
        Guid applicationId,
        Guid fileId,
        CancellationToken cancellationToken)
    {
        _tokenService.Validate(GetUploadToken(), applicationId);

        var result = await _fileContentService.GetProviderSignupMetadataAsync(
            applicationId,
            fileId,
            GetIpAddress(),
            GetUserAgent(),
            GetCorrelationId(),
            cancellationToken);

        return Ok(ApiResponse<FileMetadataResponse>.SuccessResponse(result, "Provider signup file metadata retrieved."));
    }

    private string GetUploadToken()
    {
        var token = Request.Headers[FilesConstants.ProviderSignupUploadTokenHeader].ToString();
        if (string.IsNullOrWhiteSpace(token))
        {
            token = Request.Headers[FilesConstants.ApplicationUploadTokenHeader].ToString();
        }

        return token;
    }

    private string? GetCorrelationId() => HttpContext.Response.Headers.TryGetValue("X-Correlation-Id", out var correlationId)
        ? correlationId.ToString()
        : HttpContext.Request.Headers["X-Correlation-Id"].ToString();

    private string? GetIpAddress() => HttpContext.Connection.RemoteIpAddress?.ToString();
    private string? GetUserAgent() => Request.Headers.UserAgent.ToString();
}
