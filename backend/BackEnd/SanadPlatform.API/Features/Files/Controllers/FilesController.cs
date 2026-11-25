using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.DTOs;
using SanadPlatform.API.Features.Files.Services;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Files.Controllers;

/// <summary>
/// Backend-owned file upload, metadata, content, and deletion endpoints.
/// </summary>
[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/files")]
[Authorize]
public class FilesController : ControllerBase
{
    private readonly IFileUploadService _fileUploadService;
    private readonly IFileContentService _fileContentService;
    private readonly IClaimsService _claimsService;

    public FilesController(
        IFileUploadService fileUploadService,
        IFileContentService fileContentService,
        IClaimsService claimsService)
    {
        _fileUploadService = fileUploadService ?? throw new ArgumentNullException(nameof(fileUploadService));
        _fileContentService = fileContentService ?? throw new ArgumentNullException(nameof(fileContentService));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    /// <summary>
    /// Accepts a multipart file into backend-owned staging and enqueues scanning.
    /// </summary>
    [HttpPost]
    [RequestSizeLimit(600_000_000)]
    [RequestFormLimits(MultipartBodyLengthLimit = 600_000_000)]
    [ProducesResponseType(typeof(ApiResponse<FileUploadResponse>), StatusCodes.Status202Accepted)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ApiResponse<FileUploadResponse>>> Upload(
        [FromForm] UploadFileRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetRequiredUserId();
        var role = GetRequiredRole();

        var result = await _fileUploadService.UploadAuthenticatedAsync(
            request.File,
            request.UseCase,
            userId,
            role,
            request.RelatedPatientId,
            request.RelatedProviderId,
            request.RelatedServiceId,
            request.RelatedBookingId,
            request.RelatedApplicationId,
            GetCorrelationId(),
            cancellationToken);

        return Accepted(ApiResponse<FileUploadResponse>.SuccessResponse(result, "File accepted for scanning."));
    }

    /// <summary>
    /// Reads business-safe metadata for a file.
    /// </summary>
    [HttpGet("{fileId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<FileMetadataResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<FileMetadataResponse>>> GetMetadata(
        Guid fileId,
        CancellationToken cancellationToken)
    {
        var result = await _fileContentService.GetMetadataAsync(
            fileId,
            GetRequiredUserId(),
            GetRequiredRole(),
            GetIpAddress(),
            GetUserAgent(),
            GetCorrelationId(),
            cancellationToken);

        return Ok(ApiResponse<FileMetadataResponse>.SuccessResponse(result, "File metadata retrieved."));
    }

    /// <summary>
    /// Streams ready file content through the authenticated API boundary.
    /// </summary>
    [HttpGet("{fileId:guid}/content")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetContent(
        Guid fileId,
        CancellationToken cancellationToken)
    {
        var result = await _fileContentService.GetContentAsync(
            fileId,
            GetRequiredUserId(),
            GetRequiredRole(),
            GetIpAddress(),
            GetUserAgent(),
            GetCorrelationId(),
            cancellationToken);

        var entityTag = string.IsNullOrWhiteSpace(result.ETag)
            ? null
            : new Microsoft.Net.Http.Headers.EntityTagHeaderValue($"\"{result.ETag.Trim('"')}\"");
        Response.Headers.ETag = entityTag?.ToString();
        Response.Headers.LastModified = result.LastModified?.ToString("R");
        Response.Headers.CacheControl = "private, no-store";
        Response.Headers.ContentDisposition = result.ContentDisposition;
        Response.ContentType = result.ContentType;
        Response.ContentLength = result.SizeBytes;

        await using (result.Content)
        {
            await result.Content.CopyToAsync(Response.Body, cancellationToken);
            await result.Completion;
        }

        return new EmptyResult();
    }

    /// <summary>
    /// Streams ready public file content without exposing object-storage URLs.
    /// </summary>
    [HttpGet("{fileId:guid}/public-content")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPublicContent(
        Guid fileId,
        CancellationToken cancellationToken)
    {
        var result = await _fileContentService.GetPublicContentAsync(
            fileId,
            GetIpAddress(),
            GetUserAgent(),
            GetCorrelationId(),
            cancellationToken);

        var entityTag = string.IsNullOrWhiteSpace(result.ETag)
            ? null
            : new Microsoft.Net.Http.Headers.EntityTagHeaderValue($"\"{result.ETag.Trim('\"')}\"");
        Response.Headers.ETag = entityTag?.ToString();
        Response.Headers.LastModified = result.LastModified?.ToString("R");
        Response.Headers.CacheControl = "public, max-age=300";
        Response.Headers.ContentDisposition = result.ContentDisposition;
        Response.ContentType = result.ContentType;
        Response.ContentLength = result.SizeBytes;

        await using (result.Content)
        {
            await result.Content.CopyToAsync(Response.Body, cancellationToken);
            await result.Completion;
        }

        return new EmptyResult();
    }

    /// <summary>
    /// Soft-deletes a file and enqueues object-storage cleanup.
    /// </summary>
    [HttpDelete("{fileId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<DeleteFileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<DeleteFileResponse>>> Delete(
        Guid fileId,
        CancellationToken cancellationToken)
    {
        var result = await _fileContentService.DeleteAsync(
            fileId,
            GetRequiredUserId(),
            GetRequiredRole(),
            GetIpAddress(),
            GetUserAgent(),
            GetCorrelationId(),
            cancellationToken);

        return Ok(ApiResponse<DeleteFileResponse>.SuccessResponse(result, "File deletion requested."));
    }

    private Guid GetRequiredUserId()
    {
        return _claimsService.GetUserId(User)
            ?? throw new UnauthorizedAccessException("Invalid or missing user token.");
    }

    private string GetRequiredRole()
    {
        return _claimsService.GetRole(User)
            ?? throw new UnauthorizedAccessException("User role claim is missing.");
    }

    private string? GetIpAddress() => HttpContext.Connection.RemoteIpAddress?.ToString();
    private string? GetUserAgent() => Request.Headers.UserAgent.ToString();
    private string? GetCorrelationId() => HttpContext.Response.Headers.TryGetValue("X-Correlation-Id", out var correlationId)
        ? correlationId.ToString()
        : HttpContext.Request.Headers["X-Correlation-Id"].ToString();
}
