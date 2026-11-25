using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace SanadPlatform.API.Features.Notifications.Hubs;

[Authorize]
public class NotificationHub : Hub<INotificationClient>
{
    public override Task OnConnectedAsync()
    {
        if (string.IsNullOrWhiteSpace(Context.UserIdentifier))
        {
            Context.Abort();
            return Task.CompletedTask;
        }

        return base.OnConnectedAsync();
    }
}
