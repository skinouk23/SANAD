using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Files.Entities;

namespace SanadPlatform.API.Features.Authentication.Helpers;

/// <summary>
/// Resolves avatar files into API content paths based on file visibility.
/// </summary>
public static class AvatarUrlResolver
{
    /// <summary>
    /// Resolves an avatar file into a private or public API content path.
    /// </summary>
    /// <param name="file">The avatar file.</param>
    /// <returns>An API content path, or <c>null</c> if no ready avatar is attached.</returns>
    public static string? Resolve(StoredFile? file)
    {
        if (file is null || file.Status != StoredFileStatus.Ready)
        {
            return null;
        }

        var contentEndpoint = file.Visibility == FileVisibility.Public ? "public-content" : "content";
        return $"/api/v1/files/{file.Id:D}/{contentEndpoint}";
    }
}
