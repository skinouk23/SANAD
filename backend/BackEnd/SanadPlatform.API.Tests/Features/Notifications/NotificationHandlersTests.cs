using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Notifications.Commands;
using SanadPlatform.API.Features.Notifications.Entities;
using SanadPlatform.API.Features.Notifications.Queries;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Notifications;

public class NotificationHandlersTests
{
    [Fact]
    public async Task GetMyNotifications_BuildsFrontendFriendlyFeedAndSupportsPagination()
    {
        await using var context = CreateContext();
        var user = CreateUser();

        context.Users.Add(user);
        context.Notifications.AddRange(
            CreateNotification(
                user.Id,
                "booking_created",
                "Nouvelle reservation",
                "Yassin Kammoun a cree une reservation.",
                createdAt: DateTime.UtcNow.AddMinutes(-1),
                actionUrl: "/provider/schedule",
                actionData: JsonSerializer.Serialize(new { PatientName = "Yassin Kammoun" })),
            CreateNotification(
                user.Id,
                "validation_pending",
                "Validation en attente",
                "N'oubliez pas de valider votre service avec le code recu.",
                createdAt: DateTime.UtcNow.AddMinutes(-10)),
            CreateNotification(
                user.Id,
                "new_message",
                "Nouveau message",
                "Amira Mansour vous a envoye un message.",
                createdAt: DateTime.UtcNow.AddMinutes(-20),
                isRead: true,
                readAt: DateTime.UtcNow.AddMinutes(-5)));

        await context.SaveChangesAsync();

        var handler = new GetMyNotificationsHandler(context);

        var firstPage = await handler.Handle(
            new GetMyNotificationsQuery(user.Id, Limit: 1),
            CancellationToken.None);

        Assert.Single(firstPage.Items);
        Assert.Equal("1", firstPage.NextCursor);
        Assert.Equal("booking", firstPage.Items[0].Category);
        Assert.Equal("Voir le planning", firstPage.Items[0].Action?.Label);
        Assert.Equal("/provider/schedule", firstPage.Items[0].Action?.Url);
        Assert.Equal("Yassin Kammoun", firstPage.Items[0].Actor?.Name);
        Assert.Equal("info", firstPage.Items[0].Severity);

        var unreadOnly = await handler.Handle(
            new GetMyNotificationsQuery(user.Id, Status: "unread", Limit: 10),
            CancellationToken.None);

        Assert.Equal(2, unreadOnly.Items.Count);
        Assert.DoesNotContain(unreadOnly.Items, item => item.ReadAt is not null);
    }

    [Fact]
    public async Task GetNotificationsUnreadCount_ReturnsOnlyUnreadNotifications()
    {
        await using var context = CreateContext();
        var user = CreateUser();

        context.Users.Add(user);
        context.Notifications.AddRange(
            CreateNotification(user.Id, "booking_created", "Nouvelle reservation", "Unread", createdAt: DateTime.UtcNow.AddMinutes(-1)),
            CreateNotification(user.Id, "new_message", "Nouveau message", "Also unread", createdAt: DateTime.UtcNow.AddMinutes(-2)),
            CreateNotification(
                user.Id,
                "booking_confirmed",
                "Rendez-vous confirme",
                "Read",
                createdAt: DateTime.UtcNow.AddMinutes(-3),
                isRead: true,
                readAt: DateTime.UtcNow.AddMinutes(-2)));

        await context.SaveChangesAsync();

        var handler = new GetNotificationsUnreadCountHandler(context);

        var response = await handler.Handle(new GetNotificationsUnreadCountQuery(user.Id), CancellationToken.None);

        Assert.Equal(2, response.Count);
    }

    [Fact]
    public async Task MarkAllNotificationsRead_MarksEveryUnreadNotification()
    {
        await using var context = CreateContext();
        var user = CreateUser();

        context.Users.Add(user);
        context.Notifications.AddRange(
            CreateNotification(user.Id, "booking_created", "Nouvelle reservation", "Unread", createdAt: DateTime.UtcNow.AddMinutes(-1)),
            CreateNotification(user.Id, "new_message", "Nouveau message", "Unread", createdAt: DateTime.UtcNow.AddMinutes(-2)),
            CreateNotification(
                user.Id,
                "booking_confirmed",
                "Rendez-vous confirme",
                "Read",
                createdAt: DateTime.UtcNow.AddMinutes(-3),
                isRead: true,
                readAt: DateTime.UtcNow.AddMinutes(-2)));

        await context.SaveChangesAsync();

        var handler = new MarkAllNotificationsReadHandler(
            context,
            context,
            NullLogger<MarkAllNotificationsReadHandler>.Instance);

        var response = await handler.Handle(new MarkAllNotificationsReadCommand(user.Id), CancellationToken.None);

        Assert.Equal(2, response.Count);
        Assert.Equal(2, response.UpdatedCount);
        Assert.Equal(3, await context.Notifications.CountAsync(item => item.IsRead));
    }

    [Fact]
    public async Task DeleteNotification_RemovesOwnedNotification()
    {
        await using var context = CreateContext();
        var user = CreateUser();
        var notification = CreateNotification(
            user.Id,
            "booking_created",
            "Nouvelle reservation",
            "Delete me",
            createdAt: DateTime.UtcNow.AddMinutes(-1));

        context.Users.Add(user);
        context.Notifications.Add(notification);
        await context.SaveChangesAsync();

        var handler = new DeleteNotificationHandler(
            context,
            context,
            NullLogger<DeleteNotificationHandler>.Instance);

        await handler.Handle(new DeleteNotificationCommand(notification.Id, user.Id), CancellationToken.None);

        Assert.Empty(await context.Notifications.ToListAsync());
    }

    private static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        return new SanadDbContext(options);
    }

    private static User CreateUser()
    {
        var now = DateTime.UtcNow;
        return new User
        {
            Id = Guid.NewGuid(),
            Email = $"{Guid.NewGuid():N}@example.com",
            PasswordHash = "hashed-password",
            Phone = "+21620123456",
            Role = "provider",
            CreatedAt = now,
            UpdatedAt = now,
        };
    }

    private static Notification CreateNotification(
        Guid userId,
        string type,
        string title,
        string message,
        DateTime createdAt,
        bool isRead = false,
        DateTime? readAt = null,
        string? actionUrl = null,
        string? actionData = null)
    {
        return new Notification
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Type = type,
            Title = title,
            Message = message,
            ActionUrl = actionUrl,
            ActionData = actionData,
            IsRead = isRead,
            ReadAt = readAt,
            CreatedAt = createdAt,
        };
    }
}
