using MediatR;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Notifications.Commands;

public record DeleteNotificationCommand(Guid NotificationId, Guid UserId) : IRequest;

public class DeleteNotificationHandler : IRequestHandler<DeleteNotificationCommand>
{
    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeleteNotificationHandler> _logger;

    public DeleteNotificationHandler(
        SanadDbContext db,
        IUnitOfWork unitOfWork,
        ILogger<DeleteNotificationHandler> logger)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task Handle(DeleteNotificationCommand request, CancellationToken cancellationToken)
    {
        var notification = await _db.Notifications
            .FirstOrDefaultAsync(
                item => item.Id == request.NotificationId && item.UserId == request.UserId,
                cancellationToken)
            ?? throw new KeyNotFoundException("Notification not found.");

        _db.Notifications.Remove(notification);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Notification {NotificationId} deleted by user {UserId}",
            request.NotificationId,
            request.UserId);
    }
}
