namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Processes a file cleanup request from RabbitMQ or polling fallback.
/// </summary>
public interface IFileCleanupProcessor
{
    Task<bool> ProcessAsync(Guid? fileId = null, CancellationToken cancellationToken = default);
}
