using Microsoft.Extensions.DependencyInjection;
using SanadPlatform.API.Features.Conversations.Repository;

namespace SanadPlatform.API.Features.Conversations;


public static class ConversationServiceExtensions
{
    /// <summary>
    /// Registers the Conversations feature's repositories and services with the DI container.
    /// </summary>
    public static IServiceCollection AddConversationsFeature(this IServiceCollection services)
    {
        services.AddScoped<IConversationRepository, ConversationRepository>();
        return services;
    }
}