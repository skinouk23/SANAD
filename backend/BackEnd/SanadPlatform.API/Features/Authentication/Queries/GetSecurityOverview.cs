using MediatR;
using SanadPlatform.API.Features.Authentication.DTOs;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Authentication.Repository;

namespace SanadPlatform.API.Features.Authentication.Queries;

/// <summary>
/// Query to retrieve the authenticated user's current security overview.
/// </summary>
public record GetSecurityOverviewQuery(Guid UserId, Guid CurrentSessionId) : IRequest<SecurityOverviewResponse>;

/// <summary>
/// Handler for <see cref="GetSecurityOverviewQuery"/>.
/// </summary>
public class GetSecurityOverviewHandler : IRequestHandler<GetSecurityOverviewQuery, SecurityOverviewResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserSessionRepository _userSessionRepository;
    private readonly ILogger<GetSecurityOverviewHandler> _logger;

    public GetSecurityOverviewHandler(
        IUserRepository userRepository,
        IUserSessionRepository userSessionRepository,
        ILogger<GetSecurityOverviewHandler> logger)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _userSessionRepository = userSessionRepository ?? throw new ArgumentNullException(nameof(userSessionRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<SecurityOverviewResponse> Handle(
        GetSecurityOverviewQuery query,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(query.UserId, cancellationToken);

        if (user == null)
        {
            _logger.LogWarning("Security overview request failed: User not found for ID {UserId}", query.UserId);
            throw new KeyNotFoundException($"User with id {query.UserId} not found");
        }

        var sessions = await _userSessionRepository.GetActiveSessionsByUserIdAsync(query.UserId, cancellationToken);

        var response = new SecurityOverviewResponse
        {
            TwoFactorEnabled = user.TwoFactorEnabled,
            PasswordChangedAt = user.PasswordChangedAt,
            Sessions = sessions
                .Select(session => CreateSessionSummary(session, query.CurrentSessionId))
                .ToList()
        };

        _logger.LogInformation("Security overview retrieved for User {UserId}", query.UserId);

        return response;
    }

    private static SessionSummary CreateSessionSummary(UserSession session, Guid currentSessionId)
    {
        var displayInfo = SessionUserAgentDisplayInfo.Parse(session.UserAgent);

        return new SessionSummary
        {
            Id = session.Id,
            IpAddress = session.IpAddress,
            DeviceType = session.DeviceType,
            DisplayName = displayInfo.DisplayName,
            BrowserName = displayInfo.BrowserName,
            OperatingSystem = displayInfo.OperatingSystem,
            CreatedAt = session.CreatedAt,
            ExpiresAt = session.ExpiresAt,
            IsCurrent = session.Id == currentSessionId
        };
    }
}

/// <summary>
/// Display-safe browser and operating-system labels derived from a user-agent string.
/// </summary>
file sealed record SessionUserAgentDisplayInfo(string? DisplayName, string? BrowserName, string? OperatingSystem)
{
    /// <summary>
    /// Parses a user-agent string into display-safe session labels.
    /// </summary>
    public static SessionUserAgentDisplayInfo Parse(string? userAgent)
    {
        if (string.IsNullOrWhiteSpace(userAgent))
        {
            return new SessionUserAgentDisplayInfo(null, null, null);
        }

        var browserName = GetBrowserName(userAgent);
        var operatingSystem = GetOperatingSystem(userAgent);
        var displayName = CreateDisplayName(browserName, operatingSystem);

        return new SessionUserAgentDisplayInfo(displayName, browserName, operatingSystem);
    }

    private static string? GetBrowserName(string userAgent)
    {
        if (Contains(userAgent, "Edg/") || Contains(userAgent, "EdgiOS/") || Contains(userAgent, "EdgA/"))
        {
            return "Edge";
        }

        if (Contains(userAgent, "OPR/") || Contains(userAgent, "Opera") || Contains(userAgent, "OPiOS/"))
        {
            return "Opera";
        }

        if (Contains(userAgent, "Firefox/") || Contains(userAgent, "FxiOS/"))
        {
            return "Firefox";
        }

        if (Contains(userAgent, "Chrome/") || Contains(userAgent, "CriOS/"))
        {
            return "Chrome";
        }

        if (Contains(userAgent, "Safari/") || Contains(userAgent, "Version/"))
        {
            return "Safari";
        }

        return null;
    }

    private static string? GetOperatingSystem(string userAgent)
    {
        if (Contains(userAgent, "iPad"))
        {
            return "iPad";
        }

        if (Contains(userAgent, "iPhone"))
        {
            return "iPhone";
        }

        if (Contains(userAgent, "Android"))
        {
            return "Android";
        }

        if (Contains(userAgent, "Windows NT") || Contains(userAgent, "Windows"))
        {
            return "Windows";
        }

        if (Contains(userAgent, "Mac OS X") || Contains(userAgent, "Macintosh"))
        {
            return "macOS";
        }

        if (Contains(userAgent, "Linux"))
        {
            return "Linux";
        }

        return null;
    }

    private static string? CreateDisplayName(string? browserName, string? operatingSystem)
    {
        return (browserName, operatingSystem) switch
        {
            ({ Length: > 0 }, { Length: > 0 }) => $"{browserName} on {operatingSystem}",
            ({ Length: > 0 }, _) => browserName,
            (_, { Length: > 0 }) => operatingSystem,
            _ => null
        };
    }

    private static bool Contains(string value, string match)
    {
        return value.Contains(match, StringComparison.OrdinalIgnoreCase);
    }
}
