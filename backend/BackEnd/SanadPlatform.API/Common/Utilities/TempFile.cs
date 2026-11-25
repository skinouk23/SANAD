namespace SanadPlatform.API.Common.Utilities;

/// <summary>
/// A lightweight <see cref="IDisposable"/> wrapper around a temporary file.
/// Creates a temp file on construction and guarantees cleanup on disposal,
/// even when exceptions occur during processing.
/// </summary>
public sealed class TempFile : IDisposable
{
    /// <summary>
    /// Gets the absolute path to the temporary file.
    /// </summary>
    public string Path { get; }

    /// <summary>
    /// Creates a new temporary file via <see cref="System.IO.Path.GetTempFileName"/>.
    /// </summary>
    public TempFile()
    {
        Path = System.IO.Path.GetTempFileName();
    }

    /// <summary>
    /// Deletes the temporary file if it still exists on disk.
    /// Swallows <see cref="IOException"/> to avoid masking the original exception
    /// when called from a <c>finally</c> / <c>using</c> block.
    /// </summary>
    public void Dispose()
    {
        try
        {
            if (File.Exists(Path))
            {
                File.Delete(Path);
            }
        }
        catch (IOException)
        {
            // Best-effort cleanup — the OS will reclaim the file eventually.
        }
    }
}
