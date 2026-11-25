namespace SanadPlatform.API.Common.Storage;

/// <summary>
/// Product-level visibility for a stored file.
/// Storage access is still mediated by the API for every value.
/// </summary>
public enum FileVisibility
{
    Private,
    Public,
    Restricted
}
