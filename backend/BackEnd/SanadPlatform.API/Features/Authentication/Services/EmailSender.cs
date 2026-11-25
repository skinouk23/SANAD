using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using SanadPlatform.API.Common.Options;

namespace SanadPlatform.API.Features.Authentication.Services;

/// <summary>
/// Sends authentication emails.
/// </summary>
public interface IEmailSender
{
    /// <summary>Send a login OTP email.</summary>
    Task SendLoginOtpAsync(
        string recipientEmail,
        string otp,
        int expirationSeconds,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// SMTP email sender for authentication emails.
/// </summary>
public class SmtpEmailSender : IEmailSender
{
    private readonly EmailOptions _options;
    private readonly ILogger<SmtpEmailSender> _logger;

    public SmtpEmailSender(IOptions<EmailOptions> options, ILogger<SmtpEmailSender> logger)
    {
        _options = options?.Value ?? throw new ArgumentNullException(nameof(options));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task SendLoginOtpAsync(
        string recipientEmail,
        string otp,
        int expirationSeconds,
        CancellationToken cancellationToken = default)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_options.SenderName, _options.SenderEmail));
        message.To.Add(new MailboxAddress(recipientEmail, recipientEmail));
        message.Subject = "Sanad - Votre code de connexion";
        message.Body = new BodyBuilder
        {
            HtmlBody = BuildOtpHtml(recipientEmail, otp, expirationSeconds),
            TextBody = BuildOtpText(otp, expirationSeconds)
        }.ToMessageBody();

        using var client = new SmtpClient();
        var socketOptions = _options.UseStartTls
            ? SecureSocketOptions.StartTls
            : SecureSocketOptions.Auto;

        await client.ConnectAsync(
            _options.SmtpServer,
            _options.SmtpPort,
            socketOptions,
            cancellationToken);
        await client.AuthenticateAsync(
            _options.SenderEmail,
            _options.SenderPassword,
            cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);

        _logger.LogInformation("Login OTP email sent to {Email}", recipientEmail);
    }

    private static string BuildOtpText(string otp, int expirationSeconds)
    {
        var expirationMinutes = Math.Max(1, expirationSeconds / 60);
        return $"""
Sanad - Code de connexion

Votre code de connexion est : {otp}

Ce code expire dans {expirationMinutes} minute(s). Ne le partagez avec personne.

Si vous n'avez pas demandé ce code, ignorez cet e-mail.
""";
    }

    private static string BuildOtpHtml(string recipientEmail, string otp, int expirationSeconds)
    {
        var expirationMinutes = Math.Max(1, expirationSeconds / 60);
        return $"""
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code de connexion Sanad</title>
</head>
<body style="margin:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;box-shadow:0 18px 45px rgba(15,23,42,0.12);overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 12px;text-align:center;">
              <p style="margin:0 0 8px;color:#0891b2;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Sanad</p>
              <h1 style="margin:0;color:#0f172a;font-size:24px;line-height:1.25;">Votre code de connexion</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 28px 0;color:#475569;font-size:15px;line-height:1.6;">
              <p style="margin:0;">Bonjour,</p>
              <p style="margin:12px 0 0;">Utilisez le code ci-dessous pour vous connecter à votre compte Sanad.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:28px;">
              <div style="display:inline-block;padding:18px 28px;border-radius:14px;background:#eef7ff;color:#0f7fd1;font-size:42px;font-weight:800;letter-spacing:10px;">{otp}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 24px;color:#475569;font-size:15px;line-height:1.6;">
              <p style="margin:0;">Ce code expire dans <strong>{expirationMinutes} minute(s)</strong>.</p>
              <p style="margin:12px 0 0;color:#b42318;">Ne partagez jamais ce code avec une autre personne.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.5;text-align:center;">
              <p style="margin:0;">Si vous n'avez pas demandé ce code, ignorez cet e-mail.</p>
              <p style="margin:8px 0 0;">Envoyé à {recipientEmail}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
""";
    }
}
