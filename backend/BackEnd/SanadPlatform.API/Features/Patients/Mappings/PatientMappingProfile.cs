using AutoMapper;
using SanadPlatform.API.Features.Patients.Commands;
using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Patients.Mappings;

/// <summary>
/// AutoMapper profile for Patient entity and DTO mappings
/// Defines transformations between Patient entities and DTOs
/// </summary>
public class PatientMappingProfile : Profile
{
    /// <summary>
    /// Configures all mappings for patient-related objects
    /// </summary>
    public PatientMappingProfile()
    {
        // ==================== FamilyMember -> FamilyMemberResponse ====================
        CreateMap<FamilyMember, FamilyMemberResponse>()
            .ForMember(dest => dest.MedicalHistory, opt => opt.MapFrom(src => src.MedicalConditions))
            .ForMember(dest => dest.AddedAt, opt => opt.MapFrom(src => src.CreatedAt));

        // ==================== AddFamilyMemberRequest -> FamilyMember ====================
        CreateMap<AddFamilyMemberCommand, FamilyMember>()
            .ForMember(dest => dest.MedicalConditions, opt => opt.MapFrom(src => src.MedicalHistory))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email));

        // ==================== PatientFavorite -> PatientFavoriteResponse ====================
        CreateMap<PatientFavorite, PatientFavoriteResponse>()
            .ForMember(dest => dest.AddedAt, opt => opt.MapFrom(src => src.CreatedAt));

        // ==================== PatientFavorite -> PatientFavoriteSlimResponse ====================
        CreateMap<PatientFavorite, PatientFavoriteSlimResponse>()
            .ForMember(dest => dest.AddedAt, opt => opt.MapFrom(src => src.CreatedAt));

        // ==================== Provider -> FavoriteProviderDto ====================
        CreateMap<Provider, FavoriteProviderDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
            .ForMember(dest => dest.ServiceType, opt => opt.MapFrom(src => src.ServiceCategory))
            .ForMember(dest => dest.Specialties, opt => opt.MapFrom(src => src.Specializations ?? new List<string>()))
            .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.RatingAverage))
            .ForMember(dest => dest.ReviewCount, opt => opt.MapFrom(src => src.RatingCount))
            .ForMember(dest => dest.AvatarFileId, opt => opt.MapFrom(src => src.AvatarFileId))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City));

        // ==================== UpdatePatientProfileRequest -> Patient ====================
        CreateMap<UpdatePatientProfileCommand, Patient>()
            .ForMember(dest => dest.AddressLine1, opt => opt.MapFrom(src => src.Address))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City))
            .ForMember(dest => dest.PostalCode, opt => opt.MapFrom(src => src.PostalCode))
            .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
            .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
            .ForMember(dest => dest.MedicalConditions, opt => opt.MapFrom(src => src.MedicalHistory))
            .ForMember(dest => dest.InsurancePolicyNumber, opt => opt.MapFrom(src => src.InsuranceNumber))
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // ==================== Patient -> MyPatientProfileResponse ====================
        CreateMap<Patient, MyPatientProfileResponse>()
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.AddressLine1))
            .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City))
            .ForMember(dest => dest.PostalCode, opt => opt.MapFrom(src => src.PostalCode))
            .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
            .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
            .ForMember(dest => dest.MedicalHistory, opt => opt.MapFrom(src => src.MedicalConditions))
            .ForMember(dest => dest.InsuranceNumber, opt => opt.MapFrom(src => src.InsurancePolicyNumber))
            .ForMember(dest => dest.Gender, opt => opt.MapFrom(src =>
                src.Gender.HasValue ? src.Gender.Value.ToString().ToLowerInvariant() : null))
            .ForMember(dest => dest.EmergencyContact, opt => opt.MapFrom(src => new EmergencyContactDto(
                src.EmergencyContactName,
                src.EmergencyContactPhone,
                src.EmergencyContactRelationship
            )));

        // ==================== PatientPreferencesRequest -> PatientPreferences ====================
        CreateMap<UpdatePatientPreferencesCommand, PatientPreferences>()
            .ForMember(dest => dest.EmailNotifications, opt =>
            {
                opt.PreCondition(src => src.EmailNotifications.HasValue);
                opt.MapFrom(src => src.EmailNotifications!.Value);
            })
            .ForMember(dest => dest.SmsNotifications, opt =>
            {
                opt.PreCondition(src => src.SmsNotifications.HasValue);
                opt.MapFrom(src => src.SmsNotifications!.Value);
            })
            .ForMember(dest => dest.PushNotifications, opt =>
            {
                opt.PreCondition(src => src.PushNotifications.HasValue);
                opt.MapFrom(src => src.PushNotifications!.Value);
            })
            .ForMember(dest => dest.MarketingEmails, opt =>
            {
                opt.PreCondition(src => src.MarketingEmails.HasValue);
                opt.MapFrom(src => src.MarketingEmails!.Value);
            })
            .ForMember(dest => dest.AutoValidationEnabled, opt =>
            {
                opt.PreCondition(src => src.AutoValidationEnabled.HasValue);
                opt.MapFrom(src => src.AutoValidationEnabled!.Value);
            })
            .ForMember(dest => dest.ValidationReminderHours, opt =>
            {
                opt.PreCondition(src => src.ValidationReminderHours.HasValue);
                opt.MapFrom(src => src.ValidationReminderHours!.Value);
            })
            .ForMember(dest => dest.ShareWithFamily, opt =>
            {
                opt.PreCondition(src => src.ShareWithFamily.HasValue);
                opt.MapFrom(src => src.ShareWithFamily!.Value);
            })
            .ForMember(dest => dest.AllowProviderMessages, opt =>
            {
                opt.PreCondition(src => src.AllowProviderMessages.HasValue);
                opt.MapFrom(src => src.AllowProviderMessages!.Value);
            });

        // ==================== PatientPreferences -> PatientPreferencesResponse ====================
        CreateMap<PatientPreferences, PatientPreferencesResponse>();
    }
}
