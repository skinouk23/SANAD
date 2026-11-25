using MediatR;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Notifications.DTOs;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Notifications.Commands;

public record MarkNotificationAsReadCommand(
    Guid NotificationId,
    Guid UserId) : IRequest<NotificationFeedItemResponse>;

public class MarkNotificationAsReadHandler
    : IRequestHandler<MarkNotificationAsReadCommand, NotificationFeedItemResponse>
{
    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<MarkNotificationAsReadHandler> _logger;

    public MarkNotificationAsReadHandler(
        SanadDbContext db,
        IUnitOfWork unitOfWork,
        ILogger<MarkNotificationAsReadHandler> logger)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<NotificationFeedItemResponse> Handle(
        MarkNotificationAsReadCommand request,
        CancellationToken cancellationToken)
    {
        var notification = await _db.Notifications
            .FirstOrDefaultAsync(
                item => item.Id == request.NotificationId && item.UserId == request.UserId,
                cancellationToken)
            ?? throw new KeyNotFoundException("Notification not found.");

        if (!notification.IsRead)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        _logger.LogInformation(
            "Notification {NotificationId} marked as read by user {UserId}",
            notification.Id,
            request.UserId);

        return NotificationFeedItemResponseMapper.ToResponse(notification);
    }
}
