using System.Diagnostics;
using System.Net.Sockets;
using System.Text;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Common.Storage;

namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// Scanner boundary implementation. The current adapter is no-op only when explicitly allowed;
/// non-development production configuration must select a real scanner provider.
/// </summary>
public class ConfiguredFileScanner : IFileScanner
{
    private readonly FileScannerOptions _options;

    public ConfiguredFileScanner(IOptions<FileScannerOptions> options)
    {
        _options = options?.Value ?? throw new ArgumentNullException(nameof(options));
    }

    /// <inheritdoc />
    public async Task<FileScanResult> ScanAsync(FileScanRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var stopwatch = Stopwatch.StartNew();
        if (string.Equals(_options.Provider, "NoopDevelopment", StringComparison.OrdinalIgnoreCase)
            && _options.AllowUnsafeNoopScanner)
        {
            stopwatch.Stop();
            return new FileScanResult(
                FileScanVerdict.Clean,
                "Development no-op scanner was explicitly enabled.",
                "noop-development",
                "1.0",
                stopwatch.Elapsed,
                ThreatName: null,
                request.DetectedContentType);
        }

        if (string.Equals(_options.Provider, "ClamAv", StringComparison.OrdinalIgnoreCase))
        {
            return await ScanWithClamAvAsync(request, stopwatch, cancellationToken);
        }

        stopwatch.Stop();
        return new FileScanResult(
            FileScanVerdict.Failed,
            $"Unsupported scanner provider '{_options.Provider}'.",
            _options.Provider,
            "unconfigured",
            stopwatch.Elapsed,
            ThreatName: null,
            request.DetectedContentType);
    }

    private async Task<FileScanResult> ScanWithClamAvAsync(
        FileScanRequest request,
        Stopwatch stopwatch,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.ClamAvHost))
        {
            stopwatch.Stop();
            return new FileScanResult(
                FileScanVerdict.Failed,
                "ClamAV host is not configured.",
                "clamav",
                "unknown",
                stopwatch.Elapsed,
                ThreatName: null,
                request.DetectedContentType);
        }

        if (request.SizeBytes > _options.MaxScanBytes)
        {
            stopwatch.Stop();
            return new FileScanResult(
                FileScanVerdict.Unsupported,
                "File exceeds configured ClamAV scan size limit.",
                "clamav",
                "unknown",
                stopwatch.Elapsed,
                ThreatName: null,
                request.DetectedContentType);
        }

        using var timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        timeoutCts.CancelAfter(TimeSpan.FromSeconds(_options.TimeoutSeconds));

        try
        {
            using var client = new TcpClient();
            await client.ConnectAsync(_options.ClamAvHost, _options.ClamAvPort, timeoutCts.Token);
            await using var networkStream = client.GetStream();

            var command = Encoding.ASCII.GetBytes("zINSTREAM\0");
            await networkStream.WriteAsync(command, timeoutCts.Token);

            var buffer = new byte[8192];
            int read;
            while ((read = await request.Content.ReadAsync(buffer, timeoutCts.Token)) > 0)
            {
                var lengthPrefix = BitConverter.GetBytes(System.Net.IPAddress.HostToNetworkOrder(read));
                await networkStream.WriteAsync(lengthPrefix, timeoutCts.Token);
                await networkStream.WriteAsync(buffer.AsMemory(0, read), timeoutCts.Token);
            }

            await networkStream.WriteAsync(new byte[4], timeoutCts.Token);
            await networkStream.FlushAsync(timeoutCts.Token);

            var responseBuffer = new byte[4096];
            var responseLength = await networkStream.ReadAsync(responseBuffer, timeoutCts.Token);
            var response = Encoding.UTF8.GetString(responseBuffer, 0, responseLength).Trim('\0', '\r', '\n', ' ');

            stopwatch.Stop();
            return ParseClamAvResponse(response, stopwatch.Elapsed, request.DetectedContentType);
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            stopwatch.Stop();
            return new FileScanResult(
                FileScanVerdict.TimedOut,
                "ClamAV scan timed out.",
                "clamav",
                "unknown",
                stopwatch.Elapsed,
                ThreatName: null,
                request.DetectedContentType);
        }
        catch (Exception ex) when (!cancellationToken.IsCancellationRequested)
        {
            stopwatch.Stop();
            return new FileScanResult(
                FileScanVerdict.Failed,
                ex.Message,
                "clamav",
                "unknown",
                stopwatch.Elapsed,
                ThreatName: null,
                request.DetectedContentType);
        }
    }

    private static FileScanResult ParseClamAvResponse(
        string response,
        TimeSpan elapsed,
        string? detectedContentType)
    {
        if (response.EndsWith("OK", StringComparison.OrdinalIgnoreCase))
        {
            return new FileScanResult(
                FileScanVerdict.Clean,
                response,
                "clamav",
                "daemon",
                elapsed,
                ThreatName: null,
                detectedContentType);
        }

        var foundIndex = response.IndexOf(" FOUND", StringComparison.OrdinalIgnoreCase);
        if (foundIndex >= 0)
        {
            var prefix = response[..foundIndex];
            var colonIndex = prefix.LastIndexOf(':');
            var threatName = colonIndex >= 0 ? prefix[(colonIndex + 1)..].Trim() : prefix.Trim();
            return new FileScanResult(
                FileScanVerdict.Infected,
                response,
                "clamav",
                "daemon",
                elapsed,
                string.IsNullOrWhiteSpace(threatName) ? null : threatName,
                detectedContentType);
        }

        return new FileScanResult(
            FileScanVerdict.Failed,
            response,
            "clamav",
            "daemon",
            elapsed,
            ThreatName: null,
            detectedContentType);
    }
}
