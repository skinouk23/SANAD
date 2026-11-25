using System.Net;
using System.Reflection;
using System.Security.Claims;
using System.Text.Json;
using FluentValidation.TestHelper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Authentication.Commands;
using SanadPlatform.API.Features.Authentication.Controllers;
using SanadPlatform.API.Features.Authentication.DTOs;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Authentication.Queries;
using SanadPlatform.API.Features.Authentication.Repository;
using SanadPlatform.API.Features.Authentication.Validators;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Infrastructure.Database;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Tests.Features.Authentication;

public class SecurityEndpointTests
{
    [Theory]
    [InlineData("Aa1!", "Password must be at least 8 characters long")]
    [InlineData("password1!", "Password must contain at least one uppercase letter")]
    [InlineData("PASSWORD1!", "Password must contain at least one lowercase letter")]
    [InlineData("Password!!", "Password must contain at least one digit")]
    [InlineData("Password1", "Password must contain at least one special character (!@#$%^&*)")]
    public void ChangePasswordValidator_RejectsWeakPasswords(string newPassword, string expectedMessage)
    {
        var validator = new ChangePasswordCommandValidator();
        var command = CreateChangePasswordCommand(newPassword: newPassword);

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.NewPassword)
            .WithErrorMessage(expectedMessage);
    }

    [Fact]
    public void ChangePasswordValidator_RejectsEmptyCurrentPassword()
    {
        var validator = new ChangePasswordCommandValidator();
        var command = CreateChangePasswordCommand(currentPassword: string.Empty);

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.CurrentPassword)
            .WithErrorMessage("Current password is required");
    }

    [Fact]
    public void ChangePasswordValidator_RejectsEmptyNewPassword()
    {
        var validator = new ChangePasswordCommandValidator();
        var command = CreateChangePasswordCommand(newPassword: string.Empty);

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.NewPassword)
            .WithErrorMessage("New password is required");
    }

    [Fact]
    public void ChangePasswordValidator_RejectsNewPasswordThatMatchesCurrentPassword()
    {
        var validator = new ChangePasswordCommandValidator();
        var command = CreateChangePasswordCommand(
            currentPassword: "Password1!",
            newPassword: "Password1!");

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.NewPassword)
            .WithErrorMessage("New password must be different from the current password");
    }

    [Fact]
    public void DeleteAccountValidator_RejectsEmptyCurrentPassword()
    {
        var validator = new DeleteAccountCommandValidator();
        var command = CreateDeleteAccountCommand(currentPassword: string.Empty);

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.CurrentPassword)
            .WithErrorMessage("Current password is required");
    }

    [Fact]
    public async Task ChangePasswordHandler_ThrowsWhenCurrentPasswordIsIncorrect()
    {
        await using var context = CreateContext();
        var passwordHasher = new PasswordHashingService(NullLogger<PasswordHashingService>.Instance);
        var logger = new CapturingLogger<ChangePasswordHandler>();
        var user = CreateUser(passwordHash: passwordHasher.HashPassword("Password1!"));
        var currentSession = CreateSession(user, createdAt: DateTime.UtcNow.AddMinutes(-5));
        var otherSession = CreateSession(user, createdAt: DateTime.UtcNow.AddMinutes(-10), deviceType: "mobile");

        context.Users.Add(user);
        context.UserSessions.AddRange(currentSession, otherSession);
        await context.SaveChangesAsync();

        var handler = CreateChangePasswordHandler(context, passwordHasher, logger);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new ChangePasswordCommand(
                user.Id,
                currentSession.Id,
                "WrongPassword1!",
                "BetterPass2@"),
            CancellationToken.None));

        context.ChangeTracker.Clear();
        var persistedUser = await context.Users.SingleAsync(x => x.Id == user.Id);
        var sessions = await context.UserSessions
            .AsNoTracking()
            .Where(x => x.UserId == user.Id)
            .ToListAsync();

        Assert.Equal("Current password is incorrect", exception.Message);
        Assert.Null(persistedUser.PasswordChangedAt);
        Assert.True(passwordHasher.VerifyPassword("Password1!", persistedUser.PasswordHash));
        Assert.All(sessions, session => Assert.True(session.IsActive));
        Assert.Contains(
            logger.Entries,
            entry => entry.Level == LogLevel.Warning
                && entry.Message.Contains("invalid current password", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task ChangePasswordHandler_UpdatesHash_SetsPasswordChangedAt_AndRevokesOtherSessions()
    {
        await using var context = CreateContext();
        var passwordHasher = new PasswordHashingService(NullLogger<PasswordHashingService>.Instance);
        var logger = new CapturingLogger<ChangePasswordHandler>();
        var user = CreateUser(passwordHash: passwordHasher.HashPassword("Password1!"));
        var currentSession = CreateSession(user, createdAt: DateTime.UtcNow.AddMinutes(-2));
        var otherActiveSession = CreateSession(user, createdAt: DateTime.UtcNow.AddMinutes(-8), deviceType: "tablet");
        var revokedSession = CreateSession(
            user,
            isActive: false,
            revokedAt: DateTime.UtcNow.AddMinutes(-1),
            createdAt: DateTime.UtcNow.AddMinutes(-20),
            deviceType: "desktop");

        context.Users.Add(user);
        context.UserSessions.AddRange(currentSession, otherActiveSession, revokedSession);
        await context.SaveChangesAsync();

        var handler = CreateChangePasswordHandler(context, passwordHasher, logger);

        await handler.Handle(
            new ChangePasswordCommand(
                user.Id,
                currentSession.Id,
                "Password1!",
                "BetterPass2@"),
            CancellationToken.None);

        context.ChangeTracker.Clear();
        var persistedUser = await context.Users.SingleAsync(x => x.Id == user.Id);
        var sessions = await context.UserSessions
            .AsNoTracking()
            .Where(x => x.UserId == user.Id)
            .ToDictionaryAsync(x => x.Id);

        Assert.NotNull(persistedUser.PasswordChangedAt);
        Assert.True(passwordHasher.VerifyPassword("BetterPass2@", persistedUser.PasswordHash));
        Assert.False(passwordHasher.VerifyPassword("Password1!", persistedUser.PasswordHash));

        Assert.True(sessions[currentSession.Id].IsActive);
        Assert.Null(sessions[currentSession.Id].RevokedAt);
        Assert.False(sessions[otherActiveSession.Id].IsActive);
        Assert.NotNull(sessions[otherActiveSession.Id].RevokedAt);
        Assert.False(sessions[revokedSession.Id].IsActive);
        Assert.NotNull(sessions[revokedSession.Id].RevokedAt);

        Assert.Contains(
            logger.Entries,
            entry => entry.Level == LogLevel.Information
                && entry.Message.Contains("Password changed for User", StringComparison.Ordinal));
    }

    [Fact]
    public async Task DeleteAccountHandler_WrongPassword_LeavesUserProfilesSessionsAndAuditStateUnchanged()
    {
        await using var context = CreateContext();
        var passwordHasher = new PasswordHashingService(NullLogger<PasswordHashingService>.Instance);
        var user = CreateUser(
            passwordHash: passwordHasher.HashPassword("Password1!"),
            role: "provider");
        var patient = CreatePatient(user);
        var provider = CreateProvider(user);
        var activeSession = CreateSession(user, createdAt: DateTime.UtcNow.AddMinutes(-5), deviceType: "desktop");
        var otherActiveSession = CreateSession(
            user,
            createdAt: DateTime.UtcNow.AddMinutes(-10),
            deviceType: "mobile",
            ipAddress: "198.51.100.15");

        user.Patient = patient;
        user.Provider = provider;

        context.Users.Add(user);
        context.Patients.Add(patient);
        context.Providers.Add(provider);
        context.UserSessions.AddRange(activeSession, otherActiveSession);
        await context.SaveChangesAsync();

        var handler = CreateDeleteAccountHandler(context, passwordHasher);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new DeleteAccountCommand(user.Id, "WrongPassword1!", "203.0.113.9", "xunit-agent"),
            CancellationToken.None));

        context.ChangeTracker.Clear();

        var persistedUser = await context.Users.SingleAsync(x => x.Id == user.Id);
        var persistedPatient = await context.Patients.SingleAsync(x => x.Id == patient.Id);
        var persistedProvider = await context.Providers.SingleAsync(x => x.Id == provider.Id);
        var sessions = await context.UserSessions
            .AsNoTracking()
            .Where(x => x.UserId == user.Id)
            .ToListAsync();
        var auditLogs = await context.AuditLogs
            .AsNoTracking()
            .Where(x => x.RecordId == user.Id)
            .ToListAsync();

        Assert.Equal("Current password is incorrect", exception.Message);
        Assert.True(persistedUser.IsActive);
        Assert.Null(persistedUser.DeletedAt);
        Assert.Null(persistedPatient.DeletedAt);
        Assert.Null(persistedProvider.DeletedAt);
        Assert.True(passwordHasher.VerifyPassword("Password1!", persistedUser.PasswordHash));
        Assert.All(
            sessions,
            session =>
            {
                Assert.True(session.IsActive);
                Assert.Null(session.RevokedAt);
            });
        Assert.Empty(auditLogs);
    }


    [Fact]
    public async Task DeleteAccountHandler_SoftDeletesUserProfiles_RevokesSessions_AndWritesAuditLog()
    {
        await using var context = CreateContext();
        var passwordHasher = new PasswordHashingService(NullLogger<PasswordHashingService>.Instance);
        var logger = new CapturingLogger<DeleteAccountHandler>();
        var user = CreateUser(
            passwordHash: passwordHasher.HashPassword("Password1!"),
            role: "provider");
        var patient = CreatePatient(user);
        var provider = CreateProvider(user);
        var activeSession = CreateSession(user, createdAt: DateTime.UtcNow.AddMinutes(-5), deviceType: "desktop");
        var otherActiveSession = CreateSession(
            user,
            createdAt: DateTime.UtcNow.AddMinutes(-10),
            deviceType: "mobile",
            ipAddress: "198.51.100.15");

        user.Patient = patient;
        user.Provider = provider;

        context.Users.Add(user);
        context.Patients.Add(patient);
        context.Providers.Add(provider);
        context.UserSessions.AddRange(activeSession, otherActiveSession);
        await context.SaveChangesAsync();

        var handler = CreateDeleteAccountHandler(context, passwordHasher, logger: logger);

        await handler.Handle(
            new DeleteAccountCommand(user.Id, "Password1!", "203.0.113.9", "xunit-agent"),
            CancellationToken.None);

        context.ChangeTracker.Clear();

        Assert.Null(await context.Users.SingleOrDefaultAsync(x => x.Id == user.Id));
        Assert.Null(await context.Patients.SingleOrDefaultAsync(x => x.Id == patient.Id));
        Assert.Null(await context.Providers.SingleOrDefaultAsync(x => x.Id == provider.Id));

        var deletedUser = await context.Users.IgnoreQueryFilters().SingleAsync(x => x.Id == user.Id);
        var deletedPatient = await context.Patients.IgnoreQueryFilters().SingleAsync(x => x.Id == patient.Id);
        var deletedProvider = await context.Providers.IgnoreQueryFilters().SingleAsync(x => x.Id == provider.Id);
        var sessions = await context.UserSessions
            .AsNoTracking()
            .Where(x => x.UserId == user.Id)
            .ToListAsync();
        var auditLog = await context.AuditLogs.AsNoTracking().SingleAsync(x => x.RecordId == user.Id);

        Assert.False(deletedUser.IsActive);
        Assert.NotNull(deletedUser.DeletedAt);
        Assert.NotNull(deletedPatient.DeletedAt);
        Assert.NotNull(deletedProvider.DeletedAt);
        Assert.All(
            sessions,
            session =>
            {
                Assert.False(session.IsActive);
                Assert.NotNull(session.RevokedAt);
            });

        Assert.Equal("account_deleted", auditLog.Action);
        Assert.Equal("users", auditLog.TableName);
        Assert.Equal(user.Id, auditLog.RecordId);
        Assert.Equal(user.Id, auditLog.UserId);
        Assert.Equal("203.0.113.9", auditLog.IpAddress);
        Assert.Equal("xunit-agent", auditLog.UserAgent);
        Assert.Contains("is_active", auditLog.ChangedFields!);
        Assert.Contains("deleted_at", auditLog.ChangedFields!);
        Assert.Contains("patient.deleted_at", auditLog.ChangedFields!);
        Assert.Contains("provider.deleted_at", auditLog.ChangedFields!);

        using var oldData = JsonDocument.Parse(auditLog.OldData!);
        using var newData = JsonDocument.Parse(auditLog.NewData!);

        Assert.True(oldData.RootElement.GetProperty("isActive").GetBoolean());
        Assert.Equal(JsonValueKind.Null, oldData.RootElement.GetProperty("deletedAt").ValueKind);
        Assert.False(newData.RootElement.GetProperty("isActive").GetBoolean());
        Assert.NotEqual(JsonValueKind.Null, newData.RootElement.GetProperty("deletedAt").ValueKind);
        Assert.NotEqual(JsonValueKind.Null, newData.RootElement.GetProperty("patientDeletedAt").ValueKind);
        Assert.NotEqual(JsonValueKind.Null, newData.RootElement.GetProperty("providerDeletedAt").ValueKind);

        Assert.Contains(
            logger.Entries,
            entry => entry.Level == LogLevel.Information
                && entry.Message.Contains("Deleted account for User", StringComparison.Ordinal));
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task GetSecurityOverviewHandler_ReturnsTwoFactorState_AndMarksCurrentSession(bool twoFactorEnabled)
    {
        await using var context = CreateContext();
        var passwordChangedAt = new DateTime(2026, 4, 14, 12, 0, 0, DateTimeKind.Utc);
        var user = CreateUser(twoFactorEnabled: twoFactorEnabled, passwordChangedAt: passwordChangedAt);
        var currentSession = CreateSession(user, createdAt: DateTime.UtcNow.AddMinutes(-1), deviceType: "desktop");
        var otherSession = CreateSession(user, createdAt: DateTime.UtcNow.AddMinutes(-15), deviceType: "mobile");
        var revokedSession = CreateSession(
            user,
            isActive: false,
            revokedAt: DateTime.UtcNow.AddMinutes(-3),
            createdAt: DateTime.UtcNow.AddMinutes(-30),
            deviceType: "tablet");
        var expiredSession = CreateSession(
            user,
            isActive: true,
            expiresAt: DateTime.UtcNow.AddMinutes(-1),
            createdAt: DateTime.UtcNow.AddMinutes(-40),
            deviceType: "desktop");

        context.Users.Add(user);
        context.UserSessions.AddRange(currentSession, otherSession, revokedSession, expiredSession);
        await context.SaveChangesAsync();

        var handler = CreateGetSecurityOverviewHandler(context);

        var response = await handler.Handle(
            new GetSecurityOverviewQuery(user.Id, currentSession.Id),
            CancellationToken.None);

        Assert.Equal(twoFactorEnabled, response.TwoFactorEnabled);
        Assert.Equal(passwordChangedAt, response.PasswordChangedAt);
        Assert.Equal(2, response.Sessions.Count);

        var current = Assert.Single(response.Sessions, session => session.IsCurrent);
        Assert.Equal(currentSession.Id, current.Id);
        Assert.Equal(currentSession.IpAddress, current.IpAddress);
        Assert.Equal(currentSession.DeviceType, current.DeviceType);

        var other = Assert.Single(response.Sessions, session => session.Id == otherSession.Id);
        Assert.False(other.IsCurrent);
        Assert.DoesNotContain(response.Sessions, session => session.Id == revokedSession.Id);
        Assert.DoesNotContain(response.Sessions, session => session.Id == expiredSession.Id);
    }

    [Fact]
    public async Task RevokeSessionHandler_RejectsCurrentSession()
    {
        await using var context = CreateContext();
        var user = CreateUser();
        var currentSession = CreateSession(user);

        context.Users.Add(user);
        context.UserSessions.Add(currentSession);
        await context.SaveChangesAsync();

        var handler = CreateRevokeSessionHandler(context);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new RevokeSessionCommand(user.Id, currentSession.Id, currentSession.Id),
            CancellationToken.None));

        context.ChangeTracker.Clear();
        var persistedSession = await context.UserSessions.AsNoTracking().SingleAsync(x => x.Id == currentSession.Id);

        Assert.Equal("Cannot revoke the current session", exception.Message);
        Assert.True(persistedSession.IsActive);
        Assert.Null(persistedSession.RevokedAt);
    }

    [Fact]
    public async Task RevokeSessionHandler_RejectsAnotherUsersSession()
    {
        await using var context = CreateContext();
        var owner = CreateUser();
        var otherUser = CreateUser();
        var currentSession = CreateSession(owner);
        var foreignSession = CreateSession(otherUser);

        context.Users.AddRange(owner, otherUser);
        context.UserSessions.AddRange(currentSession, foreignSession);
        await context.SaveChangesAsync();

        var handler = CreateRevokeSessionHandler(context);

        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(
            new RevokeSessionCommand(owner.Id, currentSession.Id, foreignSession.Id),
            CancellationToken.None));

        context.ChangeTracker.Clear();
        var persistedForeignSession = await context.UserSessions
            .AsNoTracking()
            .SingleAsync(x => x.Id == foreignSession.Id);

        Assert.Equal("Session not found.", exception.Message);
        Assert.True(persistedForeignSession.IsActive);
        Assert.Null(persistedForeignSession.RevokedAt);
    }

    [Fact]
    public async Task RevokeSessionHandler_RevokesOwnedNonCurrentSession()
    {
        await using var context = CreateContext();
        var logger = new CapturingLogger<RevokeSessionHandler>();
        var user = CreateUser();
        var currentSession = CreateSession(user, createdAt: DateTime.UtcNow.AddMinutes(-1));
        var targetSession = CreateSession(user, createdAt: DateTime.UtcNow.AddMinutes(-12), deviceType: "mobile");

        context.Users.Add(user);
        context.UserSessions.AddRange(currentSession, targetSession);
        await context.SaveChangesAsync();

        var handler = CreateRevokeSessionHandler(context, logger);

        await handler.Handle(
            new RevokeSessionCommand(user.Id, currentSession.Id, targetSession.Id),
            CancellationToken.None);

        context.ChangeTracker.Clear();
        var sessions = await context.UserSessions
            .AsNoTracking()
            .Where(x => x.UserId == user.Id)
            .ToDictionaryAsync(x => x.Id);

        Assert.True(sessions[currentSession.Id].IsActive);
        Assert.False(sessions[targetSession.Id].IsActive);
        Assert.NotNull(sessions[targetSession.Id].RevokedAt);
        Assert.Contains(
            logger.Entries,
            entry => entry.Level == LogLevel.Information
                && entry.Message.Contains("revoked for User", StringComparison.Ordinal));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(2)]
    public async Task RevokeOtherSessionsHandler_LeavesCurrentSessionActive(int additionalSessionCount)
    {
        await using var context = CreateContext();
        var logger = new CapturingLogger<RevokeOtherSessionsHandler>();
        var user = CreateUser();
        var currentSession = CreateSession(user, createdAt: DateTime.UtcNow.AddMinutes(-1));
        var additionalSessions = Enumerable.Range(0, additionalSessionCount)
            .Select(index => CreateSession(user, createdAt: DateTime.UtcNow.AddMinutes(-(index + 5)), deviceType: $"device-{index}"))
            .ToArray();

        context.Users.Add(user);
        context.UserSessions.Add(currentSession);
        context.UserSessions.AddRange(additionalSessions);
        await context.SaveChangesAsync();

        var handler = CreateRevokeOtherSessionsHandler(context, logger);

        await handler.Handle(
            new RevokeOtherSessionsCommand(user.Id, currentSession.Id),
            CancellationToken.None);

        context.ChangeTracker.Clear();
        var sessions = await context.UserSessions
            .AsNoTracking()
            .Where(x => x.UserId == user.Id)
            .ToListAsync();

        var persistedCurrent = Assert.Single(sessions, session => session.Id == currentSession.Id);
        Assert.True(persistedCurrent.IsActive);
        Assert.Null(persistedCurrent.RevokedAt);
        Assert.All(
            sessions.Where(session => session.Id != currentSession.Id),
            session =>
            {
                Assert.False(session.IsActive);
                Assert.NotNull(session.RevokedAt);
            });
        Assert.Contains(
            logger.Entries,
            entry => entry.Level == LogLevel.Information
                && entry.Message.Contains("All other sessions revoked", StringComparison.Ordinal));
    }

    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public async Task UserSessionRepository_IsActiveAsync_ReturnsFalse_WhenOwningUserIsInactiveOrSoftDeleted(
        bool deactivateUser,
        bool softDeleteUser)
    {
        await using var context = CreateContext();
        var repository = new UserSessionRepository(context, NullLogger<UserSessionRepository>.Instance);
        var user = CreateUser();
        var session = CreateSession(user);

        if (deactivateUser)
        {
            user.IsActive = false;
        }

        if (softDeleteUser)
        {
            user.DeletedAt = DateTime.UtcNow;
        }

        context.Users.Add(user);
        context.UserSessions.Add(session);
        await context.SaveChangesAsync();

        var isActive = await repository.IsActiveAsync(session.Id, CancellationToken.None);

        Assert.False(isActive);
    }


    [Fact]
    public void AuthController_DeclaresSecurityRoutesAndAuthorization()
    {
        AssertRouteAndAuthorization(
            nameof(AuthController.GetSecurityOverview),
            typeof(HttpGetAttribute),
            "security");
        AssertRouteAndAuthorization(
            nameof(AuthController.ChangePassword),
            typeof(HttpPostAttribute),
            "change-password");
        AssertRouteAndAuthorization(
            nameof(AuthController.DeleteAccount),
            typeof(HttpPostAttribute),
            "delete-account");
        AssertRouteAndAuthorization(
            nameof(AuthController.RevokeSession),
            typeof(HttpDeleteAttribute),
            "sessions/{sessionId:guid}");
        AssertRouteAndAuthorization(
            nameof(AuthController.RevokeOtherSessions),
            typeof(HttpPostAttribute),
            "sessions/revoke-others");
    }

    [Fact]
    public async Task AuthController_GetSecurityOverview_SendsQueryUsingAuthenticatedClaims()
    {
        var userId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();
        var mediator = new SecurityMediator
        {
            SecurityOverview = new SecurityOverviewResponse
            {
                TwoFactorEnabled = true,
                PasswordChangedAt = new DateTime(2026, 4, 14, 12, 0, 0, DateTimeKind.Utc),
                Sessions = []
            }
        };
        var controller = CreateController(mediator, CreateClaimsPrincipal(userId, sessionId));

        var actionResult = await controller.GetSecurityOverview(CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(actionResult.Result);
        var payload = Assert.IsType<ApiResponse<SecurityOverviewResponse>>(ok.Value);
        var query = Assert.IsType<GetSecurityOverviewQuery>(mediator.LastRequest);

        Assert.True(payload.Success);
        Assert.Equal("Security overview retrieved successfully", payload.Message);
        Assert.Equal(userId, query.UserId);
        Assert.Equal(sessionId, query.CurrentSessionId);
    }

    [Fact]
    public async Task AuthController_GetSecurityOverview_ReturnsUnauthorized_WhenSessionClaimIsMissing()
    {
        var userId = Guid.NewGuid();
        var mediator = new SecurityMediator();
        var controller = CreateController(mediator, CreateClaimsPrincipal(userId, sessionId: null));

        var actionResult = await controller.GetSecurityOverview(CancellationToken.None);

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(actionResult.Result);
        var payload = Assert.IsType<ApiResponse<object>>(unauthorized.Value);

        Assert.False(payload.Success);
        Assert.Equal("Invalid user token", payload.Message);
        Assert.Null(mediator.LastRequest);
    }

    [Fact]
    public async Task AuthController_ChangePassword_SendsCommandUsingAuthenticatedClaims()
    {
        var userId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();
        var mediator = new SecurityMediator();
        var controller = CreateController(mediator, CreateClaimsPrincipal(userId, sessionId));

        var actionResult = await controller.ChangePassword(
            new ChangePasswordRequest
            {
                CurrentPassword = "Password1!",
                NewPassword = "BetterPass2@"
            },
            CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(actionResult.Result);
        var payload = Assert.IsType<ApiResponse<object>>(ok.Value);
        var command = Assert.IsType<ChangePasswordCommand>(mediator.LastRequest);

        Assert.True(payload.Success);
        Assert.Equal("Password changed successfully", payload.Message);
        Assert.Equal(userId, command.UserId);
        Assert.Equal(sessionId, command.CurrentSessionId);
        Assert.Equal("Password1!", command.CurrentPassword);
        Assert.Equal("BetterPass2@", command.NewPassword);
    }

    [Fact]
    public async Task AuthController_DeleteAccount_SendsCommandUsingAuthenticatedClaims()
    {
        var userId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();
        var mediator = new SecurityMediator();
        var controller = CreateController(
            mediator,
            CreateClaimsPrincipal(userId, sessionId),
            ipAddress: "203.0.113.25",
            userAgent: "xunit-browser");

        var actionResult = await controller.DeleteAccount(
            new DeleteAccountRequest
            {
                CurrentPassword = "Password1!"
            },
            CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(actionResult.Result);
        var payload = Assert.IsType<ApiResponse<object>>(ok.Value);
        var command = Assert.IsType<DeleteAccountCommand>(mediator.LastRequest);

        Assert.True(payload.Success);
        Assert.Equal("Account deleted successfully", payload.Message);
        Assert.Equal(userId, command.UserId);
        Assert.Equal("Password1!", command.CurrentPassword);
        Assert.Equal("203.0.113.25", command.IpAddress);
        Assert.Equal("xunit-browser", command.UserAgent);
    }

    private static ChangePasswordCommand CreateChangePasswordCommand(
        string currentPassword = "Password1!",
        string newPassword = "BetterPass2@")
    {
        return new ChangePasswordCommand(
            Guid.NewGuid(),
            Guid.NewGuid(),
            currentPassword,
            newPassword);
    }

    private static DeleteAccountCommand CreateDeleteAccountCommand(
        string currentPassword = "Password1!")
    {
        return new DeleteAccountCommand(
            Guid.NewGuid(),
            currentPassword,
            IpAddress: null,
            UserAgent: null);
    }

    private static ChangePasswordHandler CreateChangePasswordHandler(
        SanadDbContext context,
        IPasswordHashingService passwordHashingService,
        ILogger<ChangePasswordHandler>? logger = null)
    {
        return new ChangePasswordHandler(
            new UserRepository(context, NullLogger<UserRepository>.Instance),
            new UserSessionRepository(context, NullLogger<UserSessionRepository>.Instance),
            passwordHashingService,
            context,
            logger ?? NullLogger<ChangePasswordHandler>.Instance);
    }

    private static DeleteAccountHandler CreateDeleteAccountHandler(
        SanadDbContext context,
        IPasswordHashingService passwordHashingService,
        IUserSessionRepository? sessionRepository = null,
        ILogger<DeleteAccountHandler>? logger = null)
    {
        return new DeleteAccountHandler(
            new UserRepository(context, NullLogger<UserRepository>.Instance),
            sessionRepository ?? new UserSessionRepository(context, NullLogger<UserSessionRepository>.Instance),
            passwordHashingService,
            context,
            context,
            logger ?? NullLogger<DeleteAccountHandler>.Instance);
    }

    private static GetSecurityOverviewHandler CreateGetSecurityOverviewHandler(
        SanadDbContext context,
        ILogger<GetSecurityOverviewHandler>? logger = null)
    {
        return new GetSecurityOverviewHandler(
            new UserRepository(context, NullLogger<UserRepository>.Instance),
            new UserSessionRepository(context, NullLogger<UserSessionRepository>.Instance),
            logger ?? NullLogger<GetSecurityOverviewHandler>.Instance);
    }

    private static RevokeSessionHandler CreateRevokeSessionHandler(
        SanadDbContext context,
        ILogger<RevokeSessionHandler>? logger = null)
    {
        return new RevokeSessionHandler(
            new UserSessionRepository(context, NullLogger<UserSessionRepository>.Instance),
            context,
            logger ?? NullLogger<RevokeSessionHandler>.Instance);
    }

    private static RevokeOtherSessionsHandler CreateRevokeOtherSessionsHandler(
        SanadDbContext context,
        ILogger<RevokeOtherSessionsHandler>? logger = null)
    {
        return new RevokeOtherSessionsHandler(
            new UserSessionRepository(context, NullLogger<UserSessionRepository>.Instance),
            logger ?? NullLogger<RevokeOtherSessionsHandler>.Instance);
    }

    private static User CreateUser(
        string? passwordHash = null,
        string role = "patient",
        bool twoFactorEnabled = false,
        DateTime? passwordChangedAt = null)
    {
        var now = DateTime.UtcNow;

        return new User
        {
            Id = Guid.NewGuid(),
            Email = $"{Guid.NewGuid():N}@example.com",
            PasswordHash = passwordHash ?? "hashed-password",
            Role = role,
            PreferredLanguage = "fr",
            Timezone = "Africa/Tunis",
            IsActive = true,
            TwoFactorEnabled = twoFactorEnabled,
            PasswordChangedAt = passwordChangedAt,
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    private static Patient CreatePatient(User user)
    {
        var now = DateTime.UtcNow;

        return new Patient
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            FirstName = "Jane",
            LastName = "Patient",
            CountryCode = "TN",
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    private static Provider CreateProvider(User user)
    {
        var now = DateTime.UtcNow;

        return new Provider
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            FirstName = "Sam",
            LastName = "Provider",
            ServiceCategory = "nursing",
            CountryCode = "TN",
            Timezone = "Africa/Tunis",
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    private static UserSession CreateSession(
        User user,
        bool isActive = true,
        DateTime? createdAt = null,
        DateTime? expiresAt = null,
        DateTime? revokedAt = null,
        string? ipAddress = "127.0.0.1",
        string? deviceType = "desktop")
    {
        return new UserSession
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            TokenHash = Guid.NewGuid().ToString(),
            RefreshTokenHash = Guid.NewGuid().ToString(),
            IpAddress = ipAddress,
            UserAgent = "xunit",
            DeviceType = deviceType,
            IsActive = isActive,
            ExpiresAt = expiresAt ?? DateTime.UtcNow.AddDays(7),
            RevokedAt = revokedAt,
            CreatedAt = createdAt ?? DateTime.UtcNow
        };
    }

    private static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        return new SanadDbContext(options);
    }

    private static ClaimsPrincipal CreateClaimsPrincipal(Guid userId, Guid? sessionId)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new(ClaimTypes.Role, "patient")
        };

        if (sessionId.HasValue)
        {
            claims.Add(new Claim("session_id", sessionId.Value.ToString()));
        }

        return new ClaimsPrincipal(new ClaimsIdentity(claims, "TestAuth"));
    }

    private static AuthController CreateController(
        IMediator mediator,
        ClaimsPrincipal user,
        string ipAddress = "127.0.0.1",
        string userAgent = "xunit")
    {
        var httpContext = new DefaultHttpContext();
        httpContext.User = user;
        httpContext.Connection.RemoteIpAddress = IPAddress.Parse(ipAddress);
        httpContext.Request.Headers.UserAgent = userAgent;

        var controller = new AuthController(mediator, new ClaimsService())
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            }
        };

        return controller;
    }

    private static void AssertRouteAndAuthorization(
        string methodName,
        Type httpAttributeType,
        string expectedTemplate)
    {
        var method = typeof(AuthController).GetMethod(methodName);

        Assert.NotNull(method);
        Assert.NotNull(method!.GetCustomAttribute<AuthorizeAttribute>());
        Assert.Contains(
            method.GetParameters(),
            parameter => parameter.ParameterType == typeof(CancellationToken));

        var attribute = Assert.IsAssignableFrom<HttpMethodAttribute>(
            method.GetCustomAttributes(inherit: true).Single(a => httpAttributeType.IsInstanceOfType(a)));

        Assert.Equal(expectedTemplate, attribute.Template);
    }


    private sealed class SecurityMediator : IMediator
    {
        public object? LastRequest { get; private set; }

        public SecurityOverviewResponse? SecurityOverview { get; init; }

        public IAsyncEnumerable<object?> CreateStream(object request, CancellationToken cancellationToken = default)
            => throw new NotSupportedException();

        public IAsyncEnumerable<TResponse> CreateStream<TResponse>(
            IStreamRequest<TResponse> request,
            CancellationToken cancellationToken = default)
            => throw new NotSupportedException();

        public Task Publish(object notification, CancellationToken cancellationToken = default)
            => Task.CompletedTask;

        public Task Publish<TNotification>(TNotification notification, CancellationToken cancellationToken = default)
            where TNotification : INotification
            => Task.CompletedTask;

        public Task Send<TRequest>(TRequest request, CancellationToken cancellationToken = default)
            where TRequest : IRequest
        {
            LastRequest = request;
            return Task.CompletedTask;
        }

        public Task<object?> Send(object request, CancellationToken cancellationToken = default)
        {
            LastRequest = request;

            return request switch
            {
                GetSecurityOverviewQuery => Task.FromResult<object?>(SecurityOverview ?? new SecurityOverviewResponse()),
                _ => Task.FromResult<object?>(Unit.Value)
            };
        }

        public Task<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken = default)
        {
            LastRequest = request;

            if (typeof(TResponse) == typeof(Unit))
            {
                return Task.FromResult((TResponse)(object)Unit.Value);
            }

            if (request is GetSecurityOverviewQuery)
            {
                return Task.FromResult((TResponse)(object)(SecurityOverview ?? new SecurityOverviewResponse()));
            }

            throw new NotSupportedException($"Response type {typeof(TResponse).Name} is not supported by {nameof(SecurityMediator)}.");
        }
    }

    private sealed class CapturingLogger<T> : ILogger<T>
    {
        public List<LogEntry> Entries { get; } = [];

        public IDisposable BeginScope<TState>(TState state)
            where TState : notnull
        {
            return NullScope.Instance;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return true;
        }

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            Entries.Add(new LogEntry(logLevel, formatter(state, exception)));
        }
    }

    private sealed record LogEntry(LogLevel Level, string Message);

    private sealed class NullScope : IDisposable
    {
        public static readonly NullScope Instance = new();

        public void Dispose()
        {
        }
    }
}
