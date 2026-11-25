using MediatR;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Notifications.DTOs;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Notifications.Commands;

public record MarkAllNotificationsReadCommand(Guid UserId) : IRequest<MarkAllNotificationsReadResponse>;

public class MarkAllNotificationsReadHandler
    : IRequestHandler<MarkAllNotificationsReadCommand, MarkAllNotificationsReadResponse>
{
    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<MarkAllNotificationsReadHandler> _logger;

    public MarkAllNotificationsReadHandler(
        SanadDbContext db,
        IUnitOfWork unitOfWork,
        ILogger<MarkAllNotificationsReadHandler> logger)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<MarkAllNotificationsReadResponse> Handle(
        MarkAllNotificationsReadCommand request,
        CancellationToken cancellationToken)
    {
        var notifications = await _db.Notifications
            .Where(item => item.UserId == request.UserId && !item.IsRead)
            .ToListAsync(cancellationToken);

        if (notifications.Count > 0)
        {
            var readAt = DateTime.UtcNow;
            foreach (var notification in notifications)
            {
                notification.IsRead = true;
                notification.ReadAt = readAt;
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        _logger.LogInformation(
            "Marked {NotificationCount} notifications as read for user {UserId}",
            notifications.Count,
            request.UserId);

        return new MarkAllNotificationsReadResponse
        {
            Count = notifications.Count,
            UpdatedCount = notifications.Count,
        };
    }
}
