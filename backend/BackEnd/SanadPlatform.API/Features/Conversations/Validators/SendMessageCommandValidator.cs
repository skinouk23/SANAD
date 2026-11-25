using FluentValidation;
using SanadPlatform.API.Features.Conversations.Commands;

namespace SanadPlatform.API.Features.Conversations.Validators;

/// <summary>
/// Validates <see cref="SendMessageCommand"/>.
/// Enforces content requirements based on message type:
/// content is required for text and system messages (max 5 000 chars),
/// attachmentUrl is required for image/file, latitude/longitude for location.
/// </summary>
public class SendMessageCommandValidator : AbstractValidator<SendMessageCommand>
{
    private static readonly string[] AllowedMessageTypes = ["text", "image", "file", "location", "system"];

    /// <summary>
    /// Initializes a new instance of <see cref="SendMessageCommandValidator"/>.
    /// </summary>
    public SendMessageCommandValidator()
    {
        RuleFor(x => x.ConversationId)
            .NotEmpty()
            .WithMessage("Conversation ID is required.");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("Authenticated user ID is required.");

        RuleFor(x => x.MessageType)
            .NotEmpty()
            .WithMessage("Message type is required.")
            .Must(t => AllowedMessageTypes.Contains(t, StringComparer.OrdinalIgnoreCase))
            .WithMessage($"MessageType must be one of: {string.Join(", ", AllowedMessageTypes)}.");

        // Content is required for text and system messages
        RuleFor(x => x.Content)
            .NotEmpty()
            .WithMessage("Message content is required.")
            .MaximumLength(5000)
            .WithMessage("Message cannot exceed 5000 characters.")
            .When(x => x.MessageType is "text" or "system");

        // AttachmentUrl is required for image and file messages
        RuleFor(x => x.AttachmentUrl)
            .NotEmpty()
            .WithMessage("Attachment URL is required when messageType is image or file.")
            .When(x => x.MessageType is "image" or "file");

        // AttachmentUrl must be a valid HTTP(S) URL when provided
        RuleFor(x => x.AttachmentUrl)
            .MaximumLength(2000)
            .WithMessage("Attachment URL cannot exceed 2000 characters.")
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out var uri)
                         && uri.Scheme is "http" or "https")
            .WithMessage("Attachment URL must be a valid absolute HTTP or HTTPS URL.")
            .When(x => !string.IsNullOrWhiteSpace(x.AttachmentUrl));

        // Latitude is required for location messages
        RuleFor(x => x.Latitude)
            .NotNull()
            .WithMessage("Latitude is required when messageType is location.")
            .InclusiveBetween(-90m, 90m)
            .WithMessage("Latitude must be between -90 and 90.")
            .When(x => x.MessageType == "location");

        // Longitude is required for location messages
        RuleFor(x => x.Longitude)
            .NotNull()
            .WithMessage("Longitude is required when messageType is location.")
            .InclusiveBetween(-180m, 180m)
            .WithMessage("Longitude must be between -180 and 180.")
            .When(x => x.MessageType == "location");

        RuleFor(x => x.AttachmentName)
            .MaximumLength(200)
            .When(x => x.AttachmentName != null);

        RuleFor(x => x.AttachmentMimeType)
            .MaximumLength(100)
            .When(x => x.AttachmentMimeType != null);
    }
}
