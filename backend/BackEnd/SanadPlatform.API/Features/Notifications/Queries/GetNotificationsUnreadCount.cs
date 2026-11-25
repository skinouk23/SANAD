using MediatR;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Notifications.DTOs;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Notifications.Queries;

public record GetNotificationsUnreadCountQuery(Guid UserId) : IRequest<NotificationUnreadCountResponse>;

public class GetNotificationsUnreadCountHandler
    : IRequestHandler<GetNotificationsUnreadCountQuery, NotificationUnreadCountResponse>
{
    private readonly SanadDbContext _db;

    public GetNotificationsUnreadCountHandler(SanadDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<NotificationUnreadCountResponse> Handle(
        GetNotificationsUnreadCountQuery request,
        CancellationToken cancellationToken)
    {
        var count = await _db.Notifications
            .AsNoTracking()
            .CountAsync(item => item.UserId == request.UserId && !item.IsRead, cancellationToken);

        return new NotificationUnreadCountResponse
        {
            Count = count,
        };
    }
}
