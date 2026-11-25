using SanadPlatform.API.Features.Files.Messaging;
using SanadPlatform.API.Features.Files.Repository;
using SanadPlatform.API.Features.Files.Services;
using SanadPlatform.API.Features.Files.Workers;

namespace SanadPlatform.API.Features.Files;

/// <summary>
/// Dependency injection extension methods for the canonical Files feature.
/// </summary>
public static class FileFeatureExtensions
{
    /// <summary>
    /// Registers file repositories, services, messaging abstractions, and hosted workers.
    /// </summary>
    public static IServiceCollection AddFileFeature(this IServiceCollection services)
    {
        services.AddScoped<IStoredFileRepository, StoredFileRepository>();
        services.AddScoped<IFilePolicyResolver, FilePolicyResolver>();
        services.AddScoped<IFileAuthorizationService, FileAuthorizationService>();
        services.AddScoped<IFileUploadService, FileUploadService>();
        services.AddScoped<IFileContentService, FileContentService>();
        services.AddScoped<IProviderSignupUploadTokenService, ProviderSignupUploadTokenService>();
        services.AddScoped<IFileScanProcessor, FileScanProcessor>();
        services.AddScoped<IFileCleanupProcessor, FileCleanupProcessor>();
        services.AddScoped<IFileScanner, ConfiguredFileScanner>();
        services.AddSingleton<IRabbitMqConnectionProvider, RabbitMqConnectionProvider>();
        services.AddSingleton<RabbitMqTopologyInitializer>();
        services.AddScoped<IFileEventPublisher, RabbitMqFileEventPublisher>();

        services.AddHostedService(provider => provider.GetRequiredService<RabbitMqTopologyInitializer>());
        services.AddHostedService<OutboxPublisherWorker>();
        services.AddHostedService<RabbitMqScanConsumerWorker>();
        services.AddHostedService<RabbitMqCleanupConsumerWorker>();
        services.AddHostedService<ScanWorker>();
        services.AddHostedService<CleanupWorker>();
        services.AddHostedService<DerivativeWorker>();
        services.AddHostedService<ExportWorker>();

        return services;
    }
}
