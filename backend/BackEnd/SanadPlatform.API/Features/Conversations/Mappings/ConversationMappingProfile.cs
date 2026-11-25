using AutoMapper;
using SanadPlatform.API.Features.Conversations.Commands;
using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Entities;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Conversations.Mappings;

/// <summary>
/// AutoMapper profile for the Conversations feature.
/// Maps between entities, commands, and DTOs.
/// </summary>
public class ConversationMappingProfile : Profile
{
    /// <summary>
    /// Initializes a new instance of <see cref="ConversationMappingProfile"/>.
    /// </summary>
    public ConversationMappingProfile()
    {
        // ==================== Conversation -> ConversationResponse ====================

        CreateMap<Conversation, ConversationResponse>()
            .ForMember(d => d.UnreadCount, o => o.Ignore()) // Computed per-role in repository projections
            .ForMember(d => d.Patient, o => o.MapFrom(s => s.Patient))
            .ForMember(d => d.Provider, o => o.MapFrom(s => s.Provider));

        // ==================== Patient -> ConversationPatientResponse ====================

        CreateMap<Patient, ConversationPatientResponse>()
            .ForMember(d => d.FullName, o => o.MapFrom(s => s.FirstName + " " + s.LastName))
            .ForMember(d => d.AvatarUrl, o => o.Ignore());

        // ==================== Provider -> ConversationProviderResponse ====================

        CreateMap<Provider, ConversationProviderResponse>()
            .ForMember(d => d.FullName, o => o.MapFrom(s =>
                !string.IsNullOrEmpty(s.BusinessName)
                    ? s.BusinessName
                    : s.FirstName + " " + s.LastName))
            .ForMember(d => d.Specialty, o => o.MapFrom(s => s.ServiceCategory))
            .ForMember(d => d.AvatarUrl, o => o.Ignore());

        // ==================== Message -> MessageResponse ====================

        CreateMap<Message, MessageResponse>()
            .ForMember(d => d.Sender, o => o.MapFrom(s => s.Sender));

        // ==================== User -> MessageSenderResponse ====================
        // User has no FirstName/LastName — resolved from the linked Patient or Provider profile.

        CreateMap<SanadPlatform.API.Features.Authentication.Entities.User, MessageSenderResponse>()
            .ForMember(d => d.FullName, o => o.MapFrom(s =>
                s.Role == "provider"
                    ? (!string.IsNullOrEmpty(s.Provider!.BusinessName)
                        ? s.Provider.BusinessName
                        : s.Provider.FirstName + " " + s.Provider.LastName)
                    : s.Patient!.FirstName + " " + s.Patient.LastName))
            .ForMember(d => d.Role, o => o.MapFrom(s => s.Role))
            .ForMember(d => d.AvatarUrl, o => o.Ignore());

        // ==================== SendMessageCommand -> Message ====================

        CreateMap<SendMessageCommand, Message>()
            .ForMember(d => d.Id, o => o.MapFrom(_ => Guid.NewGuid()))
            .ForMember(d => d.ConversationId, o => o.MapFrom(s => s.ConversationId))
            .ForMember(d => d.MessageType, o => o.MapFrom(s => s.MessageType))
            .ForMember(d => d.Content, o => o.MapFrom(s => s.Content ?? string.Empty))
            .ForMember(d => d.AttachmentUrl, o => o.MapFrom(s => s.AttachmentUrl))
            .ForMember(d => d.AttachmentName, o => o.MapFrom(s => s.AttachmentName))
            .ForMember(d => d.AttachmentSizeBytes, o => o.MapFrom(s => s.AttachmentSizeBytes))
            .ForMember(d => d.AttachmentMimeType, o => o.MapFrom(s => s.AttachmentMimeType))
            .ForMember(d => d.Latitude, o => o.MapFrom(s => s.Latitude))
            .ForMember(d => d.Longitude, o => o.MapFrom(s => s.Longitude))
            .ForMember(d => d.IsRead, o => o.MapFrom(_ => false))
            .ForMember(d => d.ReadAt, o => o.Ignore())
            .ForMember(d => d.Metadata, o => o.Ignore())
            .ForMember(d => d.CreatedAt, o => o.Ignore()) // Set by AuditableEntityInterceptor
            .ForMember(d => d.Conversation, o => o.Ignore())
            .ForMember(d => d.Sender, o => o.Ignore())
            // SenderId is resolved in the handler after participant verification
            .ForMember(d => d.SenderId, o => o.Ignore());
    }
}
