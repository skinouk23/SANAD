using System.Net.Http.Json;
using System.Xml.Linq;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;

namespace SanadPlatform.API.Features.Authentication.Services;

/// <summary>
/// Result returned by an SMS provider send attempt.
/// </summary>
public record SmsSendResult
{
    /// <summary>Whether the provider accepted the message.</summary>
    public bool Succeeded { get; init; }

    /// <summary>Provider-specific status code.</summary>
    public string? ProviderStatusCode { get; init; }

    /// <summary>Provider-specific message identifier.</summary>
    public string? ProviderMessageId { get; init; }

    /// <summary>Human-readable provider status or failure message.</summary>
    public string? ProviderMessage { get; init; }
}

/// <summary>
/// Sends authentication SMS messages.
/// </summary>
public interface ISmsSender
{
    /// <summary>Send a login OTP SMS.</summary>
    Task<SmsSendResult> SendLoginOtpAsync(
        string recipientPhoneNumber,
        string otp,
        int expirationSeconds,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// TunisieSMS sender for authentication SMS.
/// </summary>
public class TunisieSmsSender : ISmsSender
{
    private readonly HttpClient _httpClient;
    private readonly SmsOptions _options;
    private readonly ILogger<TunisieSmsSender> _logger;

    public TunisieSmsSender(
        HttpClient httpClient,
        IOptions<SmsOptions> options,
        ILogger<TunisieSmsSender> logger)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        _options = options?.Value ?? throw new ArgumentNullException(nameof(options));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<SmsSendResult> SendLoginOtpAsync(
        string recipientPhoneNumber,
        string otp,
        int expirationSeconds,
        CancellationToken cancellationToken = default)
    {
        if (!_options.Enabled)
        {
            return new SmsSendResult
            {
                Succeeded = false,
                ProviderStatusCode = "disabled",
                ProviderMessage = "SMS provider delivery is disabled."
            };
        }

        if (string.IsNullOrWhiteSpace(_options.ApiUrl)
            || string.IsNullOrWhiteSpace(_options.ClientId)
            || string.IsNullOrWhiteSpace(_options.ApiKey)
            || string.IsNullOrWhiteSpace(_options.SenderName))
        {
            return new SmsSendResult
            {
                Succeeded = false,
                ProviderStatusCode = "misconfigured",
                ProviderMessage = "SMS provider delivery is enabled but configuration is incomplete."
            };
        }

        var message = BuildOtpMessage(otp, expirationSeconds);
        var request = new
        {
            id = _options.ClientId,
            password = _options.ApiKey,
            sender = _options.SenderName,
            destination = recipientPhoneNumber,
            content = message
        };

        try
        {
            using var response = await _httpClient.PostAsJsonAsync(
                _options.ApiUrl,
                request,
                cancellationToken);
            var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
            var providerResult = ParseProviderResponse(responseBody);

            if (providerResult.Succeeded)
            {
                _logger.LogInformation(
                    "Login OTP SMS accepted by {Provider} for {Phone}",
                    _options.Provider,
                    MaskPhone(recipientPhoneNumber));
                return providerResult;
            }

            _logger.LogWarning(
                "Login OTP SMS rejected by {Provider} for {Phone}. Status: {StatusCode}, Message: {Message}",
                _options.Provider,
                MaskPhone(recipientPhoneNumber),
                providerResult.ProviderStatusCode,
                providerResult.ProviderMessage);
            return providerResult;
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or InvalidOperationException)
        {
            _logger.LogError(
                ex,
                "Login OTP SMS send failed for {Phone} via {Provider}",
                MaskPhone(recipientPhoneNumber),
                _options.Provider);

            return new SmsSendResult
            {
                Succeeded = false,
                ProviderStatusCode = "transport_error",
                ProviderMessage = ex.Message
            };
        }
    }

    private static string BuildOtpMessage(string otp, int expirationSeconds)
    {
        var expirationMinutes = Math.Max(1, expirationSeconds / 60);
        return $"Code Sanad: {otp}. Il expire dans {expirationMinutes} minute(s). Ne le partagez avec personne.";
    }

    private static SmsSendResult ParseProviderResponse(string responseBody)
    {
        if (string.IsNullOrWhiteSpace(responseBody))
        {
            return new SmsSendResult
            {
                Succeeded = false,
                ProviderStatusCode = "empty_response",
                ProviderMessage = "Provider returned an empty response."
            };
        }

        try
        {
            var document = XDocument.Parse(responseBody);
            var statusCode = document.Descendants("status_code").FirstOrDefault()?.Value;
            var statusMessage = document.Descendants("status_msg").FirstOrDefault()?.Value;
            var messageId = document.Descendants("message_id").FirstOrDefault()?.Value
                ?? document.Descendants("smessage_id").FirstOrDefault()?.Value;

            return new SmsSendResult
            {
                Succeeded = string.Equals(statusCode, "200", StringComparison.Ordinal),
                ProviderStatusCode = statusCode,
                ProviderMessage = statusMessage,
                ProviderMessageId = messageId
            };
        }
        catch (Exception ex) when (ex is InvalidOperationException or System.Xml.XmlException)
        {
            var trimmed = responseBody.Trim();
            var success = string.Equals(trimmed, "200", StringComparison.Ordinal);

            return new SmsSendResult
            {
                Succeeded = success,
                ProviderStatusCode = success ? "200" : "unparsed_response",
                ProviderMessage = success ? "ok" : trimmed
            };
        }
    }

    private static string MaskPhone(string phoneNumber)
    {
        if (phoneNumber.Length <= 4)
        {
            return "***";
        }

        return $"{phoneNumber[..4]} ** *** {phoneNumber[^3..]}";
    }
}
