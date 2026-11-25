using Lib.AspNetCore.WebPush;
using SanadPlatform.API.Features.Notifications.Repository;
using SanadPlatform.API.Features.Notifications.Services;

namespace SanadPlatform.API.Features.Notifications;

public static class NotificationServiceExtensions
{
    public static IServiceCollection AddNotificationFeature(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<WebPushSettings>(configuration.GetSection(WebPushSettings.SectionName));
        services.AddMemoryCache();
        services.AddMemoryVapidTokenCache();
        services.AddPushServiceClient(options =>
        {
            var settings = configuration.GetSection(WebPushSettings.SectionName).Get<WebPushSettings>() ?? new WebPushSettings();
            options.Subject = settings.Subject;
            options.PublicKey = settings.PublicKey;
            options.PrivateKey = settings.PrivateKey;
        });

        services.AddSignalR();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IWebPushSubscriptionRepository, WebPushSubscriptionRepository>();
        services.AddScoped<IWebPushSubscriptionService, WebPushSubscriptionService>();
        services.AddScoped<IWebPushNotificationSender, WebPushNotificationSender>();

        return services;
    }
}
