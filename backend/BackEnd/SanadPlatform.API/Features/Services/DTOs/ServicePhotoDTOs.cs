namespace SanadPlatform.API.Features.Services.DTOs;

/// <summary>
/// Request body for attaching an existing stored file to a service.
/// </summary>
public record AttachServicePhotoRequest
{
    public Guid FileId { get; init; }
    public bool IsMain { get; init; }
    public int SortOrder { get; init; }
}

/// <summary>
/// Response body for service-photo attachment.
/// </summary>
public record ServicePhotoResponse
{
    public Guid ServiceId { get; init; }
    public Guid FileId { get; init; }
    public bool IsMain { get; init; }
    public int SortOrder { get; init; }
}
