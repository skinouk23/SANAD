using MediatR;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Features.Authentication.DTOs;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Authentication.Repository;
using SanadPlatform.API.Features.Authentication.Services;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Authentication.Commands;

/// <summary>
/// Command for requesting an email or SMS login OTP.
/// </summary>
public record RequestLoginOtpCommand(
    string Channel,
    string Email,
    string? PhoneNumber,
    bool RememberMe,
    string? DeviceFingerprint,
    string? IpAddress,
    string? UserAgent) : IRequest<RequestLoginOtpResponse>, ISensitiveRequest;

/// <summary>
/// Handler for <see cref="RequestLoginOtpCommand"/>.
/// </summary>
public class RequestLoginOtpHandler : IRequestHandler<RequestLoginOtpCommand, RequestLoginOtpResponse>
{
    private const string EmailChannel = "email";
    private const string SmsChannel = "sms";

    private readonly IUserRepository _userRepository;
    private readonly ILoginOtpChallengeRepository _challengeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILoginOtpCodeGenerator _codeGenerator;
    private readonly ILoginOtpCodeHasher _codeHasher;
    private readonly IEmailSender _emailSender;
    private readonly ISmsSender _smsSender;
    private readonly ITunisiaPhoneNumberNormalizer _phoneNumberNormalizer;
    private readonly LoginOtpSettings _settings;
    private readonly SmsOptions _smsOptions;
    private readonly ILogger<RequestLoginOtpHandler> _logger;

    public RequestLoginOtpHandler(
        IUserRepository userRepository,
        ILoginOtpChallengeRepository challengeRepository,
        IUnitOfWork unitOfWork,
        ILoginOtpCodeGenerator codeGenerator,
        ILoginOtpCodeHasher codeHasher,
        IEmailSender emailSender,
        ISmsSender smsSender,
        ITunisiaPhoneNumberNormalizer phoneNumberNormalizer,
        IOptions<LoginOtpSettings> options,
        IOptions<SmsOptions> smsOptions,
        ILogger<RequestLoginOtpHandler> logger)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _challengeRepository = challengeRepository ?? throw new ArgumentNullException(nameof(challengeRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _codeGenerator = codeGenerator ?? throw new ArgumentNullException(nameof(codeGenerator));
        _codeHasher = codeHasher ?? throw new ArgumentNullException(nameof(codeHasher));
        _emailSender = emailSender ?? throw new ArgumentNullException(nameof(emailSender));
        _smsSender = smsSender ?? throw new ArgumentNullException(nameof(smsSender));
        _phoneNumberNormalizer = phoneNumberNormalizer ?? throw new ArgumentNullException(nameof(phoneNumberNormalizer));
        _settings = options?.Value ?? throw new ArgumentNullException(nameof(options));
        _smsOptions = smsOptions?.Value ?? throw new ArgumentNullException(nameof(smsOptions));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<RequestLoginOtpResponse> Handle(
        RequestLoginOtpCommand command,
        CancellationToken cancellationToken)
    {
        var normalizedChannel = command.Channel.Trim().ToLowerInvariant();

        return normalizedChannel switch
        {
            EmailChannel => await HandleEmailRequestAsync(command, cancellationToken),
            SmsChannel => await HandleSmsRequestAsync(command, cancellationToken),
            _ => throw new InvalidOperationException("Unsupported OTP channel.")
        };
    }

    private async Task<RequestLoginOtpResponse> HandleEmailRequestAsync(
        RequestLoginOtpCommand command,
        CancellationToken cancellationToken)
    {
        var normalizedEmail = command.Email.Trim().ToLowerInvariant();
        var genericChallengeId = Guid.NewGuid();
        var genericResponse = BuildResponse(genericChallengeId, EmailChannel, normalizedEmail);

        var user = await _userRepository.GetByEmailWithProfilesAsync(normalizedEmail, cancellationToken);
        if (user == null || !CanReceiveLoginOtp(user))
        {
            _logger.LogInformation("Login OTP request processed for email destination");
            return genericResponse;
        }

        await _challengeRepository.ConsumeActiveChallengesForUserAsync(
            user.Id,
            EmailChannel,
            cancellationToken);

        var challengeId = Guid.NewGuid();
        var code = _codeGenerator.GenerateNumericCode(_settings.CodeLength);
        var now = DateTime.UtcNow;

        var challenge = new LoginOtpChallenge
        {
            Id = challengeId,
            UserId = user.Id,
            Channel = EmailChannel,
            DestinationHash = _codeHasher.HashDestination(EmailChannel, normalizedEmail),
            CodeHash = _codeHasher.HashCode(challengeId, code),
            ExpiresAt = now.AddSeconds(_settings.ExpirationSeconds),
            ConsumedAt = null,
            FailedAttempts = 0,
            LastSentAt = now,
            IpAddress = command.IpAddress,
            UserAgent = command.UserAgent,
            DeviceFingerprint = NormalizeDeviceFingerprint(command.DeviceFingerprint)
        };

        await _challengeRepository.CreateAsync(challenge, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _emailSender.SendLoginOtpAsync(
            normalizedEmail,
            code,
            _settings.ExpirationSeconds,
            cancellationToken);

        _logger.LogInformation(
            "Login OTP challenge {ChallengeId} sent to user {UserId}",
            challenge.Id,
            user.Id);

        return BuildResponse(challenge.Id, EmailChannel, normalizedEmail);
    }

    private async Task<RequestLoginOtpResponse> HandleSmsRequestAsync(
        RequestLoginOtpCommand command,
        CancellationToken cancellationToken)
    {
        var normalizedPhoneNumber = _phoneNumberNormalizer.Normalize(command.PhoneNumber ?? string.Empty);
        var genericChallengeId = Guid.NewGuid();
        var genericResponse = BuildResponse(genericChallengeId, SmsChannel, normalizedPhoneNumber);

        var user = await _userRepository.GetByPhoneWithProfilesAsync(normalizedPhoneNumber, cancellationToken);
        if (user == null)
        {
            _logger.LogInformation(
                "[SMS OTP] No user matched normalized phone {Phone}",
                MaskPhone(normalizedPhoneNumber));

            _logger.LogInformation("Login OTP request processed for SMS destination");
            return genericResponse;
        }

        if (!CanReceiveLoginOtp(user))
        {
            _logger.LogInformation(
                "[SMS OTP] User {UserId} matched phone {Phone} but is not eligible for OTP login",
                user.Id,
                MaskPhone(normalizedPhoneNumber));

            _logger.LogInformation("Login OTP request processed for SMS destination");
            return genericResponse;
        }

        await _challengeRepository.ConsumeActiveChallengesForUserAsync(
            user.Id,
            SmsChannel,
            cancellationToken);

        var challengeId = Guid.NewGuid();
        var code = _codeGenerator.GenerateNumericCode(_settings.CodeLength);
        var now = DateTime.UtcNow;

        var challenge = new LoginOtpChallenge
        {
            Id = challengeId,
            UserId = user.Id,
            Channel = SmsChannel,
            DestinationHash = _codeHasher.HashDestination(SmsChannel, normalizedPhoneNumber),
            CodeHash = _codeHasher.HashCode(challengeId, code),
            ExpiresAt = now.AddSeconds(_settings.ExpirationSeconds),
            ConsumedAt = null,
            FailedAttempts = 0,
            LastSentAt = now,
            IpAddress = command.IpAddress,
            UserAgent = command.UserAgent,
            DeviceFingerprint = NormalizeDeviceFingerprint(command.DeviceFingerprint)
        };

        await _challengeRepository.CreateAsync(challenge, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        if (_smsOptions.Enabled)
        {
            var sendResult = await _smsSender.SendLoginOtpAsync(
                normalizedPhoneNumber,
                code,
                _settings.ExpirationSeconds,
                cancellationToken);

            if (!sendResult.Succeeded)
            {
                challenge.ConsumedAt = DateTime.UtcNow;
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                _logger.LogWarning(
                    "Login OTP SMS challenge {ChallengeId} for user {UserId} was consumed after provider delivery failure. Status: {Status}, Message: {Message}",
                    challenge.Id,
                    user.Id,
                    sendResult.ProviderStatusCode,
                    sendResult.ProviderMessage);
            }
        }
        else
        {
            _logger.LogInformation(
                "[SMS OTP] Challenge {ChallengeId} for {Phone}: {Otp}",
                challenge.Id,
                MaskPhone(normalizedPhoneNumber),
                code);
        }

        _logger.LogInformation(
            "Login OTP challenge {ChallengeId} prepared for SMS user {UserId}",
            challenge.Id,
            user.Id);

        return BuildResponse(challenge.Id, SmsChannel, normalizedPhoneNumber);
    }

    private RequestLoginOtpResponse BuildResponse(Guid challengeId, string channel, string destination)
    {
        return new RequestLoginOtpResponse
        {
            ChallengeId = challengeId,
            Channel = channel,
            MaskedDestination = MaskDestination(channel, destination),
            ExpiresIn = _settings.ExpirationSeconds,
            ResendAvailableIn = _settings.ResendCooldownSeconds
        };
    }

    private static bool CanReceiveLoginOtp(User user)
    {
        if (!user.IsActive || user.IsSuspended)
        {
            return false;
        }

        if (string.Equals(user.Role, "provider", StringComparison.OrdinalIgnoreCase))
        {
            return user.Provider is { IsApproved: true };
        }

        return true;
    }

    private static string MaskEmail(string email)
    {
        var atIndex = email.IndexOf('@', StringComparison.Ordinal);
        if (atIndex <= 0)
        {
            return "***";
        }

        var local = email[..atIndex];
        var domain = email[(atIndex + 1)..];
        var first = local[0];
        return $"{first}***@{domain}";
    }

    private static string MaskDestination(string channel, string destination)
    {
        return string.Equals(channel, SmsChannel, StringComparison.Ordinal)
            ? MaskPhone(destination)
            : MaskEmail(destination);
    }

    private static string MaskPhone(string phoneNumber)
    {
        if (phoneNumber.Length <= 4)
        {
            return "***";
        }

        return $"{phoneNumber[..4]} ** *** {phoneNumber[^3..]}";
    }

    private static string? NormalizeDeviceFingerprint(string? deviceFingerprint)
    {
        return string.IsNullOrWhiteSpace(deviceFingerprint)
            ? null
            : deviceFingerprint.Trim();
    }
}
