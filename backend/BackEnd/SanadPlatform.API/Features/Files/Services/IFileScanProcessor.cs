namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Processes a file scan request from RabbitMQ or polling fallback.
/// </summary>
public interface IFileScanProcessor
{
    Task<bool> ProcessAsync(Guid? fileId = null, CancellationToken cancellationToken = default);
}
