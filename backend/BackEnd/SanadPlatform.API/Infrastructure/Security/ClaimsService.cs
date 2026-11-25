using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SanadPlatform.API.Infrastructure.Security;

/// <summary>
/// Represents an authorization requirement for role-based access control.
/// </summary>
public class RoleRequirement
{
    public IEnumerable<string> AllowedRoles { get; }

    public RoleRequirement(params string[] allowedRoles)
    {
        AllowedRoles = allowedRoles ?? throw new ArgumentNullException(nameof(allowedRoles));
    }
}

/// <summary>
/// Represents an authorization requirement for specific permissions.
/// </summary>
public class PermissionRequirement
{
    public string Permission { get; }

    public PermissionRequirement(string permission)
    {
        Permission = permission ?? throw new ArgumentNullException(nameof(permission));
    }
}

/// <summary>
/// Service for managing claims-based authorization.
/// </summary>
public interface IClaimsService
{
    /// <summary>
    /// Generates JWT claims for a user based on roles and permissions.
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="email">The user email</param>
    /// <param name="roles">The user roles</param>
    /// <param name="permissions">The user permissions</param>
    /// <param name="additionalClaims">Additional custom claims</param>
    /// <returns>Collection of claims to include in JWT token</returns>
    IEnumerable<Claim> GenerateClaims(
        Guid userId,
        string email,
        IEnumerable<string> roles,
        IEnumerable<string> permissions,
        Dictionary<string, object>? additionalClaims = null);

    /// <summary>
    /// Checks if a user has a specific permission.
    /// </summary>
    /// <param name="user">The claims principal representing the user</param>
    /// <param name="permission">The permission to check</param>
    /// <returns>True if user has permission, false otherwise</returns>
    bool HasPermission(ClaimsPrincipal user, string permission);

    /// <summary>
    /// Checks if a user has any of the specified roles.
    /// </summary>
    /// <param name="user">The claims principal representing the user</param>
    /// <param name="roles">The roles to check</param>
    /// <returns>True if user has any of the roles, false otherwise</returns>
    bool HasRole(ClaimsPrincipal user, params string[] roles);

    /// <summary>
    /// Extracts the user ID from claims.
    /// </summary>
    /// <param name="user">The claims principal</param>
    /// <returns>The user ID or null if not found</returns>
    Guid? GetUserId(ClaimsPrincipal user);

    /// <summary>
    /// Extracts the user email from claims.
    /// </summary>
    /// <param name="user">The claims principal</param>
    /// <returns>The email or null if not found</returns>
    string? GetEmail(ClaimsPrincipal user);

    /// <summary>
    /// Extracts the <c>session_id</c> claim from the JWT.
    /// Returns <c>null</c> if the claim is absent or cannot be parsed as a <see cref="Guid"/>.
    /// </summary>
    /// <param name="user">The claims principal</param>
    /// <returns>The session ID or null if not found</returns>
    Guid? GetSessionId(ClaimsPrincipal user);

    /// <summary>
    /// Extracts the role from the authenticated user's claims.
    /// </summary>
    /// <param name="user">The claims principal</param>
    /// <returns>The role string, or null if the claim is not present</returns>
    string? GetRole(ClaimsPrincipal user);
}

/// <summary>
/// Implementation of claims-based authorization service.
/// </summary>
public class ClaimsService : IClaimsService
{
    private const string PermissionsClaimType = "permissions";
    private const string SubscriptionTierClaimType = "subscription_tier";

    /// <summary>
    /// Generates claims for JWT token.
    /// </summary>
    public IEnumerable<Claim> GenerateClaims(
        Guid userId,
        string email,
        IEnumerable<string> roles,
        IEnumerable<string> permissions,
        Dictionary<string, object>? additionalClaims = null)
    {
        var claims = new List<Claim>
        {
            // Standard claims
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email)
        };

        claims.AddRange(GetNormalizedRoleTokens(roles)
            .Select(role => new Claim(ClaimTypes.Role, role)));

        // Custom permissions claim (JSON array)
        claims.Add(new Claim(
            PermissionsClaimType,
            System.Text.Json.JsonSerializer.Serialize(permissions ?? Array.Empty<string>())));

        // Add additional custom claims
        if (additionalClaims != null)
        {
            foreach (var claim in additionalClaims)
            {
                claims.Add(new Claim(claim.Key, claim.Value?.ToString() ?? string.Empty));
            }
        }

        return claims;
    }

    /// <summary>
    /// Checks if user has a specific permission.
    /// </summary>
    public bool HasPermission(ClaimsPrincipal user, string permission)
    {
        if (user == null || string.IsNullOrWhiteSpace(permission))
        {
            return false;
        }

        var permissionsClaim = user.FindFirst(PermissionsClaimType);
        if (permissionsClaim == null)
        {
            return false;
        }

        try
        {
            var permissions = System.Text.Json.JsonSerializer.Deserialize<string[]>(permissionsClaim.Value);
            return permissions?.Contains(permission, StringComparer.OrdinalIgnoreCase) ?? false;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Checks if user has any of the specified roles.
    /// </summary>
    public bool HasRole(ClaimsPrincipal user, params string[] roles)
    {
        if (user == null || roles == null || roles.Length == 0)
        {
            return false;
        }

        var rolesToMatch = GetNormalizedRoleTokens(roles)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        if (rolesToMatch.Count == 0)
        {
            return false;
        }

        return GetRoleTokens(user).Any(rolesToMatch.Contains);
    }

    /// <summary>
    /// Extracts user ID from claims.
    /// </summary>
    public Guid? GetUserId(ClaimsPrincipal user)
    {
        var userIdClaim = user?.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return userId;
        }

        return null;
    }

    /// <summary>
    /// Extracts email from claims.
    /// </summary>
    public string? GetEmail(ClaimsPrincipal user)
    {
        return user?.FindFirst(ClaimTypes.Email)?.Value;
    }

    /// <summary>
    /// Extracts the <c>session_id</c> custom claim from the JWT.
    /// </summary>
    public Guid? GetSessionId(ClaimsPrincipal user)
    {
        var sessionIdClaim = user?.FindFirst("session_id");
        if (sessionIdClaim != null && Guid.TryParse(sessionIdClaim.Value, out var sessionId))
        {
            return sessionId;
        }

        return null;
    }

    /// <inheritdoc />
    public string? GetRole(ClaimsPrincipal user)
    {
        return GetRoleTokens(user).FirstOrDefault();
    }

    private static IEnumerable<string> GetRoleTokens(ClaimsPrincipal? user)
    {
        if (user == null)
        {
            return Array.Empty<string>();
        }

        return GetNormalizedRoleTokens(user.FindAll(ClaimTypes.Role).Select(claim => claim.Value));
    }

    private static IEnumerable<string> GetNormalizedRoleTokens(IEnumerable<string>? roleValues)
    {
        if (roleValues == null)
        {
            yield break;
        }

        var seenRoles = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var roleValue in roleValues)
        {
            foreach (var roleToken in SplitRoleValue(roleValue))
            {
                if (seenRoles.Add(roleToken))
                {
                    yield return roleToken;
                }
            }
        }
    }

    private static IEnumerable<string> SplitRoleValue(string? roleValue)
    {
        if (string.IsNullOrWhiteSpace(roleValue))
        {
            yield break;
        }

        foreach (var roleToken in roleValue.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            if (!string.IsNullOrWhiteSpace(roleToken))
            {
                yield return roleToken;
            }
        }
    }
}
