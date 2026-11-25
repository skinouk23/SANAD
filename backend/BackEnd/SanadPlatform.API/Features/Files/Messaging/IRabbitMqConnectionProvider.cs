using RabbitMQ.Client;

namespace SanadPlatform.API.Features.Files.Messaging;

/// <summary>
/// Provides RabbitMQ connections for file messaging infrastructure.
/// </summary>
public interface IRabbitMqConnectionProvider : IAsyncDisposable
{
    Task<IConnection> GetConnectionAsync(CancellationToken cancellationToken = default);
}
