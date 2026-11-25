using System.ComponentModel.DataAnnotations;

namespace SanadPlatform.API.Common.Options;

/// <summary>
/// RabbitMQ topology and connection options for durable file-event publication.
/// </summary>
public class RabbitMqOptions
{
    public const string SectionName = "RabbitMQ";

    public bool Enabled { get; set; }

    [Required]
    public string HostName { get; set; } = "localhost";

    [Range(1, 65535)]
    public int Port { get; set; } = 5672;

    [Required]
    public string VirtualHost { get; set; } = "/";

    public string? UserName { get; set; }

    public string? Password { get; set; }

    public bool UseTls { get; set; }

    public string ExchangeName { get; set; } = "sanad.files";
    public string DeadLetterExchangeName { get; set; } = "sanad.files.dlx";
    public bool UseQuorumQueues { get; set; } = true;
    public bool PublisherConfirms { get; set; } = true;

    [Range(1, 1000)]
    public ushort PrefetchCount { get; set; } = 4;

    [Range(1, 100)]
    public int MaxPublishAttempts { get; set; } = 10;

    [Range(1, int.MaxValue)]
    public int PublishBatchSize { get; set; } = 25;
}
