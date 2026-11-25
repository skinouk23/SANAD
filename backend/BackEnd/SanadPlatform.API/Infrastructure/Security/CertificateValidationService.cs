using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;
using System;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace SanadPlatform.API.Infrastructure.Security;

/// <summary>
/// Service for handling HTTPS/TLS certificate validation and pinning.
/// Ensures that only trusted certificates are used for data in transit security.
/// </summary>
public interface ICertificateValidationService
{
    /// <summary>
    /// Validates a server certificate against pinned certificates.
    /// </summary>
    /// <param name="certificate">The certificate to validate</param>
    /// <param name="chain">The certificate chain</param>
    /// <param name="sslPolicyErrors">Any SSL policy errors</param>
    /// <returns>True if the certificate is valid and trusted; otherwise false</returns>
    bool ValidateCertificate(
        X509Certificate2 certificate,
        X509Chain chain,
        System.Net.Security.SslPolicyErrors sslPolicyErrors);

    /// <summary>
    /// Gets the current pinned certificate thumbprints.
    /// </summary>
    /// <returns>Array of pinned certificate thumbprints</returns>
    string[] GetPinnedCertificateThumbprints();

    /// <summary>
    /// Adds a certificate thumbprint to the pinned certificates list.
    /// </summary>
    /// <param name="thumbprint">The certificate thumbprint to pin</param>
    void PinCertificateThumbprint(string thumbprint);

    /// <summary>
    /// Checks if a certificate is pinned.
    /// </summary>
    /// <param name="thumbprint">The certificate thumbprint to check</param>
    /// <returns>True if the certificate is pinned; otherwise false</returns>
    bool IsCertificatePinned(string thumbprint);
}

/// <summary>
/// Default implementation of certificate validation service.
/// </summary>
public class CertificateValidationService : ICertificateValidationService
{
    private readonly ILogger<CertificateValidationService> _logger;
    private HashSet<string> _pinnedCertificateThumbprints;

    public CertificateValidationService(
        ILogger<CertificateValidationService> logger,
        IOptions<SecuritySettings> securityOptions)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        var thumbprints = securityOptions?.Value?.CertificatePinning?.Thumbprints ?? Array.Empty<string>();
        _pinnedCertificateThumbprints = new HashSet<string>(thumbprints, StringComparer.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Validates a server certificate against pinned certificates.
    /// </summary>
    public bool ValidateCertificate(
        X509Certificate2 certificate,
        X509Chain chain,
        System.Net.Security.SslPolicyErrors sslPolicyErrors)
    {
        if (certificate == null)
        {
            _logger.LogError("Certificate validation failed: certificate is null");
            return false;
        }

        try
        {
            // Check for SSL policy errors
            if (sslPolicyErrors != System.Net.Security.SslPolicyErrors.None)
            {
                _logger.LogWarning(
                    "SSL policy errors detected. Subject: {Subject}, Errors: {Errors}",
                    certificate.Subject,
                    sslPolicyErrors);
                return false;
            }

            // Validate certificate is not expired
            if (DateTime.UtcNow < certificate.NotBefore || DateTime.UtcNow > certificate.NotAfter)
            {
                _logger.LogError(
                    "Certificate is outside valid date range. Subject: {Subject}, NotBefore: {NotBefore}, NotAfter: {NotAfter}",
                    certificate.Subject,
                    certificate.NotBefore,
                    certificate.NotAfter);
                return false;
            }

            // If certificate pinning is configured, validate against pinned certificates
            if (_pinnedCertificateThumbprints.Count > 0)
            {
                var thumbprint = certificate.Thumbprint;
                if (!IsCertificatePinned(thumbprint))
                {
                    _logger.LogError(
                        "Certificate is not pinned. Subject: {Subject}, Thumbprint: {Thumbprint}",
                        certificate.Subject,
                        thumbprint);
                    return false;
                }

                _logger.LogInformation(
                    "Certificate validation successful (pinned). Subject: {Subject}, Thumbprint: {Thumbprint}",
                    certificate.Subject,
                    thumbprint);
            }
            else
            {
                _logger.LogInformation(
                    "Certificate validation successful. Subject: {Subject}",
                    certificate.Subject);
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating certificate. Subject: {Subject}", certificate.Subject);
            return false;
        }
    }

    /// <summary>
    /// Gets the current pinned certificate thumbprints.
    /// </summary>
    public string[] GetPinnedCertificateThumbprints()
    {
        return _pinnedCertificateThumbprints.ToArray();
    }

    /// <summary>
    /// Adds a certificate thumbprint to the pinned certificates list.
    /// </summary>
    public void PinCertificateThumbprint(string thumbprint)
    {
        if (string.IsNullOrWhiteSpace(thumbprint))
        {
            throw new ArgumentException("Thumbprint cannot be null or empty", nameof(thumbprint));
        }

        if (_pinnedCertificateThumbprints.Add(thumbprint))
        {
            _logger.LogInformation("Certificate thumbprint pinned: {Thumbprint}", thumbprint);
        }
    }

    /// <summary>
    /// Checks if a certificate is pinned.
    /// </summary>
    public bool IsCertificatePinned(string thumbprint)
    {
        if (string.IsNullOrWhiteSpace(thumbprint))
        {
            return false;
        }

        return _pinnedCertificateThumbprints.Contains(thumbprint);
    }
}
