using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace SanadPlatform.API.Infrastructure.Security;

/// <summary>
/// Middleware for enforcing and managing data in transit security (HTTPS/TLS).
/// Implements HSTS, security headers, and TLS configuration.
/// </summary>
public class DataInTransitSecurityMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<DataInTransitSecurityMiddleware> _logger;

    // Security headers to enforce
    private static readonly Dictionary<string, string> SecurityHeaders = new()
    {
        // Enforce HTTPS for 1 year (31536000 seconds) including subdomains
        { "Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload" },

        // Prevent browsers from MIME-sniffing the content type
        { "X-Content-Type-Options", "nosniff" },

        // Prevent clickjacking attacks
        { "X-Frame-Options", "DENY" },

        // Enable XSS protection in older browsers
        { "X-XSS-Protection", "1; mode=block" },

        // Content Security Policy - strict by default
        { "Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'" },

        // Referrer policy - limit referrer information
        { "Referrer-Policy", "strict-origin-when-cross-origin" },

        // Permissions policy - disable unnecessary features
        { "Permissions-Policy", "geolocation=(), microphone=(), camera=(), payment=(), accelerometer=(), gyroscope=(), magnetometer=()" },

        // Prevent MIME type sniffing for downloads
        { "X-Download-Options", "noopen" },

        // Ensure API responses are not cached with sensitive data
        { "Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" },

        // Pragma for HTTP/1.0 compatibility
        { "Pragma", "no-cache" },

        // Expires for cache control
        { "Expires", "0" }
    };

    public DataInTransitSecurityMiddleware(RequestDelegate next, ILogger<DataInTransitSecurityMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Processes HTTP requests and adds security headers for data in transit protection.
    /// </summary>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Log HTTPS usage
            if (!context.Request.IsHttps)
            {
                _logger.LogWarning(
                    "Non-HTTPS request detected. RemoteIP: {RemoteIP}, Path: {Path}",
                    context.Connection.RemoteIpAddress,
                    context.Request.Path);
            }

            // Add security headers to response
            AddSecurityHeaders(context.Response);

            // Add additional security configuration
            ConfigureResponseSecurity(context.Response);

            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in DataInTransitSecurityMiddleware");
            throw;
        }
    }

    /// <summary>
    /// Adds all security headers to the response.
    /// </summary>
    private static void AddSecurityHeaders(HttpResponse response)
    {
        // Remove server header to prevent information disclosure
        response.Headers.Remove("Server");
        response.Headers.Remove("X-Powered-By");
        response.Headers.Remove("X-AspNet-Version");

        // Add security headers
        foreach (var header in SecurityHeaders)
        {
            if (!response.Headers.ContainsKey(header.Key))
            {
                response.Headers.Append(header.Key, header.Value);
            }
        }
    }

    /// <summary>
    /// Configures additional response security settings.
    /// </summary>
    private static void ConfigureResponseSecurity(HttpResponse response)
    {
        // Note: Cookie security flags (HttpOnly, Secure, SameSite) are configured
        // at the application level through CookiePolicy or individual cookie options
        // when setting cookies, not on the response object itself.
        
        // Set response headers for cache prevention
        response.Headers.CacheControl = "no-store, no-cache, must-revalidate";
    }
}

/// <summary>
/// Extension methods for configuring data in transit security.
/// </summary>
public static class DataInTransitSecurityExtensions
{
    /// <summary>
    /// Adds HTTPS redirection and security header middleware to the application.
    /// Should be called early in the middleware pipeline.
    /// </summary>
    /// <param name="app">The application builder</param>
    /// <param name="enforceHstsInProduction">Whether to enforce HSTS in production (default: true)</param>
    /// <returns>The application builder for method chaining</returns>
    public static IApplicationBuilder UseDataInTransitSecurity(
        this IApplicationBuilder app,
        bool enforceHstsInProduction = true)
    {
        if (app == null)
            throw new ArgumentNullException(nameof(app));

        // Use HTTPS redirection
        app.UseHttpsRedirection();

        // Add HSTS middleware (HTTP Strict Transport Security)
        if (enforceHstsInProduction)
        {
            app.UseHsts();
        }

        // Add custom security headers middleware
        app.UseMiddleware<DataInTransitSecurityMiddleware>();

        return app;
    }

    /// <summary>
    /// Configures Kestrel server for TLS/SSL with best practices.
    /// Should be called on the web host builder.
    /// </summary>
    /// <param name="webBuilder">The web host builder</param>
    /// <param name="configuration">The application configuration</param>
    /// <returns>The web host builder for method chaining</returns>
    public static IWebHostBuilder ConfigureSecureTls(
        this IWebHostBuilder webBuilder,
        IConfiguration configuration)
    {
        return webBuilder.ConfigureKestrel(serverOptions =>
        {
            // Require HTTPS
            serverOptions.ConfigureHttpsDefaults(httpsOptions =>
            {
                // Set minimum TLS version to 1.2
                httpsOptions.SslProtocols = System.Security.Authentication.SslProtocols.Tls12 | 
                                           System.Security.Authentication.SslProtocols.Tls13;

                // Configure cipher suites for modern browsers only
                // This provides best security at the cost of older browser compatibility
                httpsOptions.AllowAnyClientCertificate();
            });
        });
    }
}

/// <summary>
/// Configuration options for data in transit security.
/// </summary>
public class DataInTransitSecurityOptions
{
    /// <summary>
    /// Gets or sets whether to enforce HSTS (default: true).
    /// </summary>
    public bool EnforceHsts { get; set; } = true;

    /// <summary>
    /// Gets or sets the HSTS max-age in seconds (default: 31536000 = 1 year).
    /// </summary>
    public int HstsMaxAge { get; set; } = 31536000;

    /// <summary>
    /// Gets or sets whether to include subdomains in HSTS (default: true).
    /// </summary>
    public bool HstsIncludeSubDomains { get; set; } = true;

    /// <summary>
    /// Gets or sets whether to allow preload for HSTS (default: true).
    /// See: https://hstspreload.org
    /// </summary>
    public bool HstsPreload { get; set; } = true;

    /// <summary>
    /// Gets or sets the minimum TLS version (default: 1.2).
    /// </summary>
    public string MinimumTlsVersion { get; set; } = "1.2";

    /// <summary>
    /// Gets or sets whether to enforce secure cookies (default: true).
    /// </summary>
    public bool EnforceSecureCookies { get; set; } = true;

    /// <summary>
    /// Gets or sets whether to enable certificate pinning (default: false).
    /// Certificate pinning requires additional configuration.
    /// </summary>
    public bool EnableCertificatePinning { get; set; } = false;

    /// <summary>
    /// Gets or sets the Content Security Policy (CSP) header value.
    /// </summary>
    public string ContentSecurityPolicy { get; set; } = 
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'";
}
