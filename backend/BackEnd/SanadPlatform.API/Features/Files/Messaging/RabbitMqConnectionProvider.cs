using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using SanadPlatform.API.Common.Options;

namespace SanadPlatform.API.Features.Files.Messaging;

/// <summary>
/// Lazily creates and reuses a RabbitMQ connection when file messaging is enabled.
/// </summary>
public sealed class RabbitMqConnectionProvider : IRabbitMqConnectionProvider
{
    private readonly RabbitMqOptions _options;
    private readonly SemaphoreSlim _connectionLock = new(1, 1);
    private IConnection? _connection;

    public RabbitMqConnectionProvider(IOptions<RabbitMqOptions> options)
    {
        _options = options?.Value ?? throw new ArgumentNullException(nameof(options));
    }

    /// <inheritdoc />
    public async Task<IConnection> GetConnectionAsync(CancellationToken cancellationToken = default)
    {
        if (!_options.Enabled)
        {
            throw new InvalidOperationException("RabbitMQ is disabled.");
        }

        if (_connection is { IsOpen: true })
        {
            return _connection;
        }

        await _connectionLock.WaitAsync(cancellationToken);
        try
        {
            if (_connection is { IsOpen: true })
            {
                return _connection;
            }

            var factory = new ConnectionFactory
            {
                HostName = _options.HostName,
                Port = _options.Port,
                VirtualHost = _options.VirtualHost,
                UserName = _options.UserName ?? string.Empty,
                Password = _options.Password ?? string.Empty,
                AutomaticRecoveryEnabled = true,
                TopologyRecoveryEnabled = true,
                RequestedHeartbeat = TimeSpan.FromSeconds(30),
                NetworkRecoveryInterval = TimeSpan.FromSeconds(10),
                ClientProvidedName = "SanadPlatform.API files"
            };

            if (_options.UseTls)
            {
                factory.Ssl = new SslOption
                {
                    Enabled = true,
                    ServerName = _options.HostName
                };
            }

            _connection = await factory.CreateConnectionAsync(cancellationToken);
            return _connection;
        }
        finally
        {
            _connectionLock.Release();
        }
    }

    /// <inheritdoc />
    public async ValueTask DisposeAsync()
    {
        if (_connection is not null)
        {
            await _connection.CloseAsync(cancellationToken: CancellationToken.None);
            _connection.Dispose();
        }

        _connectionLock.Dispose();
    }
}
