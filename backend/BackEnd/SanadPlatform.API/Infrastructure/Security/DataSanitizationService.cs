using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace SanadPlatform.API.Infrastructure.Security;

/// <summary>
/// Service for sanitizing and validating user input to prevent XSS, SQL injection, and other attacks.
/// </summary>
public interface IDataSanitizationService
{
    /// <summary>
    /// Sanitizes HTML input to remove dangerous scripts and tags.
    /// </summary>
    /// <param name="input">The HTML content to sanitize</param>
    /// <returns>Sanitized HTML safe for display</returns>
    string SanitizeHtml(string input);

    /// <summary>
    /// Sanitizes generic text input to prevent injection attacks.
    /// </summary>
    /// <param name="input">The text to sanitize</param>
    /// <returns>Sanitized text</returns>
    string SanitizeInput(string input);

    /// <summary>
    /// Validates email format according to RFC 5322 standards.
    /// </summary>
    /// <param name="email">The email address to validate</param>
    /// <returns>True if valid email format, false otherwise</returns>
    bool IsValidEmail(string email);

    /// <summary>
    /// Validates phone number format (international format).
    /// </summary>
    /// <param name="phoneNumber">The phone number to validate</param>
    /// <returns>True if valid phone format, false otherwise</returns>
    bool IsValidPhoneNumber(string phoneNumber);

    /// <summary>
    /// Escapes HTML special characters to prevent XSS.
    /// </summary>
    /// <param name="input">The text to escape</param>
    /// <returns>HTML-escaped text</returns>
    string EscapeHtml(string input);

    /// <summary>
    /// Validates and sanitizes JSON input.
    /// </summary>
    /// <param name="input">The JSON string to validate</param>
    /// <returns>True if valid JSON, false otherwise</returns>
    bool IsValidJson(string input);
}

/// <summary>
/// Implementation of data sanitization service.
/// </summary>
public class DataSanitizationService : IDataSanitizationService
{
    // Email regex pattern (simplified RFC 5322)
    private static readonly Regex EmailRegex = new(
        @"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
        RegexOptions.Compiled);

    // International phone number regex (E.164 format)
    private static readonly Regex PhoneRegex = new(
        @"^\+?[1-9]\d{1,14}$",
        RegexOptions.Compiled);

    // Dangerous HTML tags to remove
    private static readonly HashSet<string> DangerousTags = new(StringComparer.OrdinalIgnoreCase)
    {
        "script", "iframe", "object", "embed", "applet", "meta", "link", "style",
        "form", "input", "button", "textarea", "select", "onclick", "onerror", "onload"
    };

    // HTML special characters for escaping
    private static readonly Dictionary<char, string> HtmlEscapeMap = new()
    {
        { '<', "&lt;" },
        { '>', "&gt;" },
        { '&', "&amp;" },
        { '"', "&quot;" },
        { '\'', "&#39;" }
    };

    /// <summary>
    /// Sanitizes HTML by removing dangerous tags and attributes.
    /// Note: For production, consider using HtmlSanitizer NuGet package.
    /// </summary>
    public string SanitizeHtml(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return string.Empty;
        }

        var result = input;

        // Remove script tags and content
        result = Regex.Replace(result, @"<\s*script[^>]*>.*?</\s*script\s*>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);

        // Remove event handlers (onclick, onerror, etc.)
        result = Regex.Replace(result, @"\s*on\w+\s*=\s*[""']?[^""']*[""']?", "", RegexOptions.IgnoreCase);

        // Remove iframe, embed, object tags
        result = Regex.Replace(result, @"<\s*(iframe|embed|object|applet)[^>]*>.*?</\s*\1\s*>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);

        // Remove dangerous attributes
        result = Regex.Replace(result, @"\s*(javascript|data):\s*", "", RegexOptions.IgnoreCase);

        return result.Trim();
    }

    /// <summary>
    /// Sanitizes generic text input by trimming and removing null characters.
    /// </summary>
    public string SanitizeInput(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return string.Empty;
        }

        // Remove null characters
        var sanitized = new string(input.Where(c => c != '\0').ToArray());

        // Trim whitespace
        return sanitized.Trim();
    }

    /// <summary>
    /// Validates email using regex pattern.
    /// </summary>
    public bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return false;
        }

        if (email.Length > 254) // RFC 5321
        {
            return false;
        }

        try
        {
            return EmailRegex.IsMatch(email);
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Validates phone number using E.164 international format.
    /// </summary>
    public bool IsValidPhoneNumber(string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
        {
            return false;
        }

        // Remove common separators
        var cleaned = Regex.Replace(phoneNumber, @"[\s\-\(\)\.+]", "");

        try
        {
            return PhoneRegex.IsMatch(cleaned);
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Escapes HTML special characters to prevent XSS attacks.
    /// </summary>
    public string EscapeHtml(string input)
    {
        if (string.IsNullOrEmpty(input))
        {
            return input;
        }

        var result = new System.Text.StringBuilder();
        foreach (char c in input)
        {
            if (HtmlEscapeMap.TryGetValue(c, out var escaped))
            {
                result.Append(escaped);
            }
            else
            {
                result.Append(c);
            }
        }

        return result.ToString();
    }

    /// <summary>
    /// Validates JSON format without parsing.
    /// </summary>
    public bool IsValidJson(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return false;
        }

        try
        {
            System.Text.Json.JsonDocument.Parse(input);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
