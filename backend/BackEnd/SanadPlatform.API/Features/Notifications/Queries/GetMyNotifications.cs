using MediatR;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Notifications.DTOs;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Notifications.Queries;

public record GetMyNotificationsQuery(
    Guid UserId,
    string? Status = null,
    string? Category = null,
    string? Cursor = null,
    int Limit = 50,
    bool UnreadOnly = false) : IRequest<NotificationFeedResponse>;

public class GetMyNotificationsHandler
    : IRequestHandler<GetMyNotificationsQuery, NotificationFeedResponse>
{
    private readonly SanadDbContext _db;

    public GetMyNotificationsHandler(SanadDbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }

    public async Task<NotificationFeedResponse> Handle(
        GetMyNotificationsQuery request,
        CancellationToken cancellationToken)
    {
        var limit = Math.Clamp(request.Limit, 1, 100);
        var offset = ParseCursor(request.Cursor);
        var status = NormalizeStatusFilter(request.Status, request.UnreadOnly);
        var category = string.IsNullOrWhiteSpace(request.Category)
            ? null
            : request.Category.Trim().ToLowerInvariant();

        var notifications = await _db.Notifications
            .AsNoTracking()
            .Where(notification => notification.UserId == request.UserId)
            .OrderByDescending(notification => notification.CreatedAt)
            .ToListAsync(cancellationToken);

        var filteredNotifications = notifications
            .Select(NotificationFeedItemResponseMapper.ToResponse)
            .Where(notification => MatchesStatus(notification, status))
            .Where(notification => MatchesCategory(notification, category))
            .ToList();

        var items = filteredNotifications
            .Skip(offset)
            .Take(limit)
            .ToList();

        var nextCursor = offset + items.Count < filteredNotifications.Count
            ? (offset + items.Count).ToString()
            : null;

        return new NotificationFeedResponse
        {
            Items = items,
            NextCursor = nextCursor,
        };
    }

    private static int ParseCursor(string? cursor)
    {
        if (string.IsNullOrWhiteSpace(cursor))
        {
            return 0;
        }

        return int.TryParse(cursor, out var offset) && offset > 0
            ? offset
            : 0;
    }

    private static string? NormalizeStatusFilter(string? status, bool unreadOnly)
    {
        if (!string.IsNullOrWhiteSpace(status))
        {
            return status.Trim().ToLowerInvariant();
        }

        return unreadOnly ? "unread" : null;
    }

    private static bool MatchesStatus(NotificationFeedItemResponse notification, string? status)
    {
        return status switch
        {
            "unread" => notification.ReadAt is null && notification.ArchivedAt is null,
            "archived" => notification.ArchivedAt is not null,
            _ => notification.ArchivedAt is null,
        };
    }

    private static bool MatchesCategory(NotificationFeedItemResponse notification, string? category)
    {
        return category is null
            || string.Equals(notification.Category, category, StringComparison.OrdinalIgnoreCase);
    }
}
