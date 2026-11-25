using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Exceptions;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Features.Authentication.Commands;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Authentication.Helpers;
using SanadPlatform.API.Features.Authentication.Queries;
using SanadPlatform.API.Features.Authentication.Repository;
using SanadPlatform.API.Features.Authentication.Services;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Infrastructure.Database;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Storage;
using Serilog;
using Serilog.Core;
using Serilog.Events;

namespace SanadPlatform.API.Tests.Features.Authentication;

public class UpdateAccountProfileTests
{
    [Fact]
    public async Task Handler_StoresPhoneAndObjectKey_AndReturnsEnrichedResponse()
    {
        await using var context = CreateContext();
        var minio = new TrackingMinioStorageService("https://cdn.example.com/providers/avatar.png");
        var user = CreateProviderUser(profilePictureObjectKey: null, phone: "+21620000000");
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var handler = CreateUpdateAccountProfileHandler(context, minio);
        var newObjectKey = $"{user.Id}/avatars/profile.png";

        var response = await handler.Handle(
            new UpdateAccountProfileCommand(
                user.Id,
                "provider",
                new UpdateAccountProfileRequest
                {
                    Phone = "+21651112223",
                    ProfilePictureObjectKey = newObjectKey
                }),
            CancellationToken.None);

        context.ChangeTracker.Clear();
        var persistedUser = await context.Users
            .Include(x => x.Provider)
            .SingleAsync(x => x.Id == user.Id);

        Assert.Equal("+21651112223", persistedUser.Phone);
        Assert.Equal(newObjectKey, persistedUser.Provider!.ProfilePictureUrl);
        Assert.Equal("+21651112223", response.PhoneNumber);
        Assert.Equal("https://cdn.example.com/providers/avatar.png", response.Avatar);
        Assert.Collection(
            minio.DownloadRequests,
            request =>
            {
                Assert.Equal(MinioSettings.ProvidersBucket, request.Bucket);
                Assert.Equal(newObjectKey, request.ObjectKey);
                Assert.Equal(3600, request.ExpirySeconds);
            });
    }

    [Fact]
    public async Task Handler_RejectsObjectKeyOutsideAuthenticatedNamespace()
    {
        await using var context = CreateContext();
        var minio = new TrackingMinioStorageService();
        var user = CreatePatientUser(profilePictureObjectKey: null, phone: "+21620000000");
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var handler = CreateUpdateAccountProfileHandler(context, minio);
        var invalidObjectKey = $"{Guid.NewGuid()}/avatars/other-user.png";

        var exception = await Assert.ThrowsAsync<ForbiddenAccessException>(() => handler.Handle(
            new UpdateAccountProfileCommand(
                user.Id,
                "patient",
                new UpdateAccountProfileRequest
                {
                    Phone = "+21654445556",
                    ProfilePictureObjectKey = invalidObjectKey
                }),
            CancellationToken.None));

        context.ChangeTracker.Clear();
        var persistedUser = await context.Users
            .Include(x => x.Patient)
            .SingleAsync(x => x.Id == user.Id);

        Assert.Equal("Object key does not belong to the authenticated user.", exception.Message);
        Assert.Equal("+21620000000", persistedUser.Phone);
        Assert.Null(persistedUser.Patient!.ProfilePictureUrl);
        Assert.Empty(minio.DownloadRequests);
    }

    [Fact]
    public async Task Handler_ThrowsWhenUserIsMissing()
    {
        await using var context = CreateContext();
        var handler = CreateUpdateAccountProfileHandler(context, new TrackingMinioStorageService());

        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(
            new UpdateAccountProfileCommand(
                Guid.NewGuid(),
                "patient",
                new UpdateAccountProfileRequest
                {
                    Phone = "+21650000000"
                }),
            CancellationToken.None));

        Assert.Contains("User with id", exception.Message);
    }

    [Fact]
    public async Task Handler_IgnoresEmptyObjectKey_ForPartialUpdate()
    {
        await using var context = CreateContext();
        var minio = new TrackingMinioStorageService("https://cdn.example.com/patients/existing-avatar.png");
        var existingObjectKey = $"{Guid.NewGuid()}/avatars/existing.png";
        var user = CreatePatientUser(profilePictureObjectKey: existingObjectKey, phone: "+21620000000");
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var handler = CreateUpdateAccountProfileHandler(context, minio);

        var response = await handler.Handle(
            new UpdateAccountProfileCommand(
                user.Id,
                "patient",
                new UpdateAccountProfileRequest
                {
                    Phone = "+21657778889",
                    ProfilePictureObjectKey = "   "
                }),
            CancellationToken.None);

        context.ChangeTracker.Clear();
        var persistedUser = await context.Users
            .Include(x => x.Patient)
            .SingleAsync(x => x.Id == user.Id);

        Assert.Equal("+21657778889", persistedUser.Phone);
        Assert.Equal(existingObjectKey, persistedUser.Patient!.ProfilePictureUrl);
        Assert.Equal("https://cdn.example.com/patients/existing-avatar.png", response.Avatar);
        Assert.Collection(
            minio.DownloadRequests,
            request => Assert.Equal(existingObjectKey, request.ObjectKey));
    }

    [Fact]
    public async Task GetUserProfileHandler_ReturnsResolvedAvatarUrl()
    {
        await using var context = CreateContext();
        var minio = new TrackingMinioStorageService("https://cdn.example.com/patients/profile.png");
        var user = CreatePatientUser(profilePictureObjectKey: null);
        user.Patient!.ProfilePictureUrl = $"{user.Id}/avatars/profile.png";
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var handler = CreateGetUserProfileHandler(context, minio);

        var response = await handler.Handle(new GetUserProfileQuery(user.Id), CancellationToken.None);

        Assert.Equal("https://cdn.example.com/patients/profile.png", response.Avatar);
        Assert.Equal(user.Patient.FirstName, response.FirstName);
        Assert.Equal(user.Patient.LastName, response.LastName);
        Assert.Collection(
            minio.DownloadRequests,
            request =>
            {
                Assert.Equal(MinioSettings.PatientsBucket, request.Bucket);
                Assert.Equal(user.Patient.ProfilePictureUrl, request.ObjectKey);
                Assert.Equal(3600, request.ExpirySeconds);
            });
    }

    [Fact]
    public async Task LoginUserHandler_ReturnsResolvedAvatarUrl()
    {
        await using var context = CreateContext();
        var minio = new TrackingMinioStorageService("https://cdn.example.com/patients/login-avatar.png");
        var passwordHasher = new PasswordHashingService(NullLogger<PasswordHashingService>.Instance);
        var jwtOptions = CreateJwtOptions();
        var user = CreatePatientUser(
            passwordHash: passwordHasher.HashPassword("Password1!"),
            profilePictureObjectKey: null);
        user.Patient!.ProfilePictureUrl = $"{user.Id}/avatars/login.png";
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var handler = CreateLoginHandler(context, minio, passwordHasher, jwtOptions);

        var response = await handler.Handle(
            new LoginUserCommand(user.Email, "Password1!", false, "127.0.0.1", "xunit"),
            CancellationToken.None);

        Assert.Equal("https://cdn.example.com/patients/login-avatar.png", response.User.Avatar);
        Assert.Single(await context.UserSessions.ToListAsync());
        Assert.Collection(
            minio.DownloadRequests,
            request => Assert.Equal(MinioSettings.PatientsBucket, request.Bucket));
    }

    [Fact]
    public async Task RefreshTokenHandler_ReturnsResolvedAvatarUrl()
    {
        await using var context = CreateContext();
        var minio = new TrackingMinioStorageService("https://cdn.example.com/providers/refresh-avatar.png");
        var jwtOptions = CreateJwtOptions();
        var jwtTokenService = new JwtTokenService(jwtOptions, NullLogger<JwtTokenService>.Instance);
        var passwordHasher = new PasswordHashingService(NullLogger<PasswordHashingService>.Instance);
        var user = CreateProviderUser(
            passwordHash: passwordHasher.HashPassword("Password1!"),
            profilePictureObjectKey: null);
        user.Provider!.ProfilePictureUrl = $"{user.Id}/avatars/refresh.png";

        var rawRefreshToken = jwtTokenService.GenerateRefreshToken();
        var sessionId = Guid.NewGuid();
        var session = new UserSession
        {
            Id = sessionId,
            UserId = user.Id,
            User = user,
            TokenHash = sessionId.ToString(),
            RefreshTokenHash = jwtTokenService.HashToken(rawRefreshToken),
            IpAddress = "127.0.0.1",
            UserAgent = "xunit",
            IsActive = true,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        };

        context.Users.Add(user);
        context.UserSessions.Add(session);
        await context.SaveChangesAsync();

        var handler = CreateRefreshHandler(context, minio, jwtOptions);

        var response = await handler.Handle(
            new RefreshTokenCommand(rawRefreshToken, "127.0.0.1", "xunit"),
            CancellationToken.None);

        context.ChangeTracker.Clear();
        var sessions = await context.UserSessions.AsNoTracking().ToListAsync();

        Assert.Equal("https://cdn.example.com/providers/refresh-avatar.png", response.User.Avatar);
        Assert.Equal(2, sessions.Count);
        Assert.Single(sessions, x => x.IsActive);
        Assert.Contains(sessions, x => x.Id == sessionId && !x.IsActive);
        Assert.Collection(
            minio.DownloadRequests,
            request => Assert.Equal(MinioSettings.ProvidersBucket, request.Bucket));
    }

    [Fact]
    public async Task RefreshTokenHandler_ThrowsAndRevokesAllSessions_WhenTokenIsReplayed()
    {
        await using var context = CreateContext();
        var minio = new TrackingMinioStorageService();
        var jwtOptions = CreateJwtOptions();
        var jwtTokenService = new JwtTokenService(jwtOptions, NullLogger<JwtTokenService>.Instance);
        var passwordHasher = new PasswordHashingService(NullLogger<PasswordHashingService>.Instance);
        var user = CreateProviderUser(
            passwordHash: passwordHasher.HashPassword("Password1!"),
            profilePictureObjectKey: null);

        // Create a refresh token and its hash
        var rawRefreshToken = jwtTokenService.GenerateRefreshToken();
        var tokenHash = jwtTokenService.HashToken(rawRefreshToken);

        // Create revoked session with the token hash
        var revokedSessionId = Guid.NewGuid();
        var revokedSession = new UserSession
        {
            Id = revokedSessionId,
            UserId = user.Id,
            User = user,
            TokenHash = revokedSessionId.ToString(),
            RefreshTokenHash = tokenHash,
            IpAddress = "192.168.1.100",
            UserAgent = "stolen-client",
            IsActive = false,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        };

        // Create active session for the same user
        var activeSessionId = Guid.NewGuid();
        var activeSession = new UserSession
        {
            Id = activeSessionId,
            UserId = user.Id,
            User = user,
            TokenHash = activeSessionId.ToString(),
            RefreshTokenHash = jwtTokenService.HashToken(jwtTokenService.GenerateRefreshToken()),
            IpAddress = "127.0.0.1",
            UserAgent = "xunit",
            IsActive = true,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        };

        context.Users.Add(user);
        context.UserSessions.Add(revokedSession);
        context.UserSessions.Add(activeSession);
        await context.SaveChangesAsync();

        var handler = CreateRefreshHandler(context, minio, jwtOptions);

        // Act: attempt to replay the revoked token
        var exception = await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(
            new RefreshTokenCommand(rawRefreshToken, "10.0.0.1", "attacker-bot"),
            CancellationToken.None));

        // Assert exception message matches current invalid/expired token behavior
        Assert.Equal("Invalid or expired refresh token.", exception.Message);

        // Assert all sessions for the user are now revoked (token-family invalidation)
        context.ChangeTracker.Clear();
        var sessions = await context.UserSessions.AsNoTracking()
            .Where(s => s.UserId == user.Id)
            .ToListAsync();

        Assert.NotEmpty(sessions);
        Assert.All(sessions, s => Assert.False(s.IsActive, $"Session {s.Id} should be revoked but IsActive={s.IsActive}"));
    }

    [Fact]
    public async Task Handler_LogsSuccessfulAccountProfileUpdate()
    {
        await using var context = CreateContext();
        var minio = new TrackingMinioStorageService();
        var logger = new CapturingLogger<UpdateAccountProfileHandler>();
        var user = CreatePatientUser(profilePictureObjectKey: null);
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var handler = new UpdateAccountProfileHandler(
            new UserRepository(context, NullLogger<UserRepository>.Instance),
            context,
            minio,
            logger);

        await handler.Handle(
            new UpdateAccountProfileCommand(
                user.Id,
                "patient",
                new UpdateAccountProfileRequest
                {
                    Phone = "+21658889990"
                }),
            CancellationToken.None);

        Assert.Contains(
            logger.Entries,
            entry => entry.Level == LogLevel.Information
                && entry.Message.Contains("Account profile updated for User", StringComparison.Ordinal));
    }

    [Fact]
    public async Task AvatarUrlResolver_ReturnsNull_WhenMinioFails()
    {
        var minio = new TrackingMinioStorageService(
            downloadException: new InvalidOperationException("MinIO unavailable"));
        var sink = new CollectingSerilogSink();
        var originalLogger = Log.Logger;

        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Verbose()
            .WriteTo.Sink(sink)
            .CreateLogger();

        try
        {
            var avatar = await AvatarUrlResolver.ResolveAsync(
                minio,
                "patient",
                "user-id/avatar.png",
                CancellationToken.None);

            Assert.Null(avatar);
            Assert.Collection(
                minio.DownloadRequests,
                request =>
                {
                    Assert.Equal(MinioSettings.PatientsBucket, request.Bucket);
                    Assert.Equal("user-id/avatar.png", request.ObjectKey);
                    Assert.Equal(3600, request.ExpirySeconds);
                });

            var warningEvent = Assert.Single(sink.Events, evt => evt.Level == LogEventLevel.Warning);
            Assert.Equal(
                "Avatar URL resolution failed for role {UserRole}, bucket {Bucket}, and object key {ObjectKey}",
                warningEvent.MessageTemplate.Text);
            Assert.Equal("patient", warningEvent.Properties["UserRole"].ToString().Trim('"'));
            Assert.Equal(MinioSettings.PatientsBucket, warningEvent.Properties["Bucket"].ToString().Trim('"'));
            Assert.Equal("user-id/avatar.png", warningEvent.Properties["ObjectKey"].ToString().Trim('"'));
        }
        finally
        {
            Log.Logger = originalLogger;
        }
    }

    [Fact]
    public async Task AvatarUrlResolver_ReturnsNull_WithoutCallingMinio_WhenObjectKeyIsEmpty()
    {
        var minio = new TrackingMinioStorageService();
        var sink = new CollectingSerilogSink();
        var originalLogger = Log.Logger;

        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Verbose()
            .WriteTo.Sink(sink)
            .CreateLogger();

        try
        {
            var avatar = await AvatarUrlResolver.ResolveAsync(
                minio,
                "patient",
                "   ",
                CancellationToken.None);

            Assert.Null(avatar);
            Assert.Empty(minio.DownloadRequests);
            Assert.Empty(sink.Events);
        }
        finally
        {
            Log.Logger = originalLogger;
        }
    }

    private static UpdateAccountProfileHandler CreateUpdateAccountProfileHandler(
        SanadDbContext context,
        IMinioStorageService minioStorageService)
    {
        return new UpdateAccountProfileHandler(
            new UserRepository(context, NullLogger<UserRepository>.Instance),
            context,
            minioStorageService,
            NullLogger<UpdateAccountProfileHandler>.Instance);
    }

    private static GetUserProfileHandler CreateGetUserProfileHandler(
        SanadDbContext context,
        IMinioStorageService minioStorageService)
    {
        return new GetUserProfileHandler(
            new UserRepository(context, NullLogger<UserRepository>.Instance),
            minioStorageService,
            NullLogger<GetUserProfileHandler>.Instance);
    }

    private static LoginUserHandler CreateLoginHandler(
        SanadDbContext context,
        IMinioStorageService minioStorageService,
        IPasswordHashingService passwordHashingService,
        IOptions<JwtSettings> jwtOptions)
    {
        return new LoginUserHandler(
            new UserRepository(context, NullLogger<UserRepository>.Instance),
            new UserSessionRepository(context, NullLogger<UserSessionRepository>.Instance),
            context,
            passwordHashingService,
            new JwtTokenService(jwtOptions, NullLogger<JwtTokenService>.Instance),
            minioStorageService,
            jwtOptions,
            NullLogger<LoginUserHandler>.Instance);
    }

    private static RefreshTokenHandler CreateRefreshHandler(
        SanadDbContext context,
        IMinioStorageService minioStorageService,
        IOptions<JwtSettings> jwtOptions)
    {
        return new RefreshTokenHandler(
            new UserSessionRepository(context, NullLogger<UserSessionRepository>.Instance),
            new UserRepository(context, NullLogger<UserRepository>.Instance),
            context,
            new JwtTokenService(jwtOptions, NullLogger<JwtTokenService>.Instance),
            minioStorageService,
            jwtOptions,
            NullLogger<RefreshTokenHandler>.Instance);
    }

    private static IOptions<JwtSettings> CreateJwtOptions()
    {
        return Options.Create(new JwtSettings
        {
            SecretKey = "this-is-a-test-secret-key-with-32-chars",
            Issuer = "SanadPlatform.Tests",
            Audience = "SanadPlatform.Tests",
            ExpiryMinutes = 60,
            RefreshTokenExpiryDays = 7
        });
    }

    private static User CreatePatientUser(
        string? passwordHash = null,
        string? profilePictureObjectKey = null,
        string phone = "+21620123456")
    {
        var now = DateTime.UtcNow;
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = $"{Guid.NewGuid():N}@example.com",
            PasswordHash = passwordHash ?? "hashed-password",
            Phone = phone,
            Role = "patient",
            PreferredLanguage = "fr",
            Timezone = "Africa/Tunis",
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = now
        };

        user.Patient = new Patient
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            FirstName = "Amal",
            LastName = "Ben Ali",
            CountryCode = "TN",
            ProfilePictureUrl = profilePictureObjectKey,
            CreatedAt = now,
            UpdatedAt = now
        };

        return user;
    }

    private static User CreateProviderUser(
        string? passwordHash = null,
        string? profilePictureObjectKey = null,
        string phone = "+21620123456")
    {
        var now = DateTime.UtcNow;
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = $"{Guid.NewGuid():N}@example.com",
            PasswordHash = passwordHash ?? "hashed-password",
            Phone = phone,
            Role = "provider",
            PreferredLanguage = "fr",
            Timezone = "Africa/Tunis",
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = now
        };

        user.Provider = new Provider
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            ServiceCategory = "doctor",
            BusinessName = "Dr. Test Provider",
            FirstName = "Youssef",
            LastName = "Khaled",
            CountryCode = "TN",
            ProfilePictureUrl = profilePictureObjectKey,
            IsApproved = true,
            IsVerified = true,
            IsAvailable = true,
            AvailabilityStatus = "available",
            Timezone = "Africa/Tunis",
            CreatedAt = now,
            UpdatedAt = now
        };

        return user;
    }

    private static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        return new SanadDbContext(options);
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

        public record LogEntry(LogLevel Level, string Message);

        private sealed class NullScope : IDisposable
        {
            public static readonly NullScope Instance = new();

            public void Dispose()
            {
            }
        }
    }

    private sealed class CollectingSerilogSink : ILogEventSink
    {
        public List<LogEvent> Events { get; } = [];

        public void Emit(LogEvent logEvent)
        {
            Events.Add(logEvent);
        }
    }

    private sealed class TrackingMinioStorageService : IMinioStorageService
    {
        private readonly string _downloadUrl;
        private readonly Exception? _downloadException;

        public TrackingMinioStorageService(
            string downloadUrl = "https://cdn.example.com/avatar.png",
            Exception? downloadException = null)
        {
            _downloadUrl = downloadUrl;
            _downloadException = downloadException;
        }

        public List<DownloadRequest> DownloadRequests { get; } = [];

        public Task<string> GeneratePresignedUploadUrlAsync(
            string bucket,
            string objectKey,
            string contentType,
            int? expirySeconds = null,
            CancellationToken ct = default)
        {
            throw new NotSupportedException();
        }

        public Task<string> GeneratePresignedDownloadUrlAsync(
            string bucket,
            string objectKey,
            int? expirySeconds = null,
            CancellationToken ct = default)
        {
            DownloadRequests.Add(new DownloadRequest(bucket, objectKey, expirySeconds));

            if (_downloadException != null)
            {
                throw _downloadException;
            }

            return Task.FromResult(_downloadUrl);
        }

        public Task<ObjectMetadataResult> VerifyObjectExistsAsync(
            string bucket,
            string objectKey,
            CancellationToken ct = default)
        {
            throw new NotSupportedException();
        }

        public Task DeleteObjectAsync(
            string bucket,
            string objectKey,
            CancellationToken ct = default)
        {
            return Task.CompletedTask;
        }

        public Task GetObjectToStreamAsync(
            string bucket,
            string objectKey,
            Stream targetStream,
            CancellationToken ct = default)
        {
            throw new NotSupportedException();
        }

        public Task UploadStreamAsync(
            string bucket,
            string objectKey,
            Stream sourceStream,
            long size,
            string contentType,
            CancellationToken ct = default)
        {
            throw new NotSupportedException();
        }

        public record DownloadRequest(string Bucket, string ObjectKey, int? ExpirySeconds);
    }
}
