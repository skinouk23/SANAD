using AutoMapper;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers;
using SanadPlatform.API.Features.Providers.Commands;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Reviews.Entities;

namespace SanadPlatform.API.Features.Providers.Mappings;

/// <summary>
/// AutoMapper profile for the Providers feature.
/// Owns all mappings for Provider entities, Service entities, and Review→ProviderReviewDto
/// projections used by Provider query handlers.
/// </summary>
public class ProviderMappingProfile : Profile
{
    public ProviderMappingProfile()
    {
        // ==================== Command → Entity ====================

        CreateMap<CreateProviderCommand, Provider>();

        CreateMap<UpdateProviderCommand, Provider>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // Self-service update: maps flattened command properties onto the tracked Provider entity.
        // Null command members are skipped to support partial updates.
        CreateMap<UpdateProviderProfileCommand, Provider>()
            .ForMember(dest => dest.AddressLine1, opt => opt.MapFrom(src => src.Address))
            .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
            .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
            .ForMember(dest => dest.ServiceRadiusKm, opt =>
            {
                opt.PreCondition(src => src.ServiceRadius.HasValue);
                opt.MapFrom(src => src.ServiceRadius!.Value);
            })
            .ForMember(dest => dest.Specializations, opt =>
            {
                opt.PreCondition(src => src.Specialization != null);
                opt.MapFrom(src => !string.IsNullOrWhiteSpace(src.Specialization)
                    ? src.Specialization.Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(s => s.Trim())
                        .ToList()
                    : new List<string>());
            })
            .ForMember(dest => dest.NutritionProviderSubtype, opt => opt.Ignore())
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // ==================== ProviderPreferencesRequest -> ProviderPreferences ====================

        CreateMap<UpdateProviderPreferencesCommand, ProviderPreferences>()
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
            .ForMember(dest => dest.AllowPatientMessages, opt =>
            {
                opt.PreCondition(src => src.AllowPatientMessages.HasValue);
                opt.MapFrom(src => src.AllowPatientMessages!.Value);
            })
            .ForMember(dest => dest.ProfileVisibility, opt =>
            {
                opt.PreCondition(src => !string.IsNullOrWhiteSpace(src.ProfileVisibility));
                opt.MapFrom(src => src.ProfileVisibility!.Trim().ToLowerInvariant());
            });

        // ==================== Entity → Response ====================

        CreateMap<Provider, ProviderResponse>()
            .ForMember(dest => dest.NutritionProviderSubtype,
                       opt => opt.MapFrom(src => src.NutritionProviderSubtype.HasValue
                           ? src.NutritionProviderSubtype.Value.ToString()
                           : null))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.Ignore())
            .ForMember(dest => dest.Specialties,
                       opt => opt.MapFrom(src => src.Specializations ?? new List<string>()));

        // Maps Provider entity to the authenticated provider's self-service profile response.
        // CompletionRate is computed in AfterMap because it depends on two counters
        // and cannot be expressed as a single source property reference.
        CreateMap<Provider, ProviderProfileResponse>()
            .ForMember(dest => dest.ServiceType, opt => opt.MapFrom(src => src.ServiceCategory))
            .ForMember(dest => dest.NutritionProviderSubtype,
                opt => opt.MapFrom(src => src.NutritionProviderSubtype.HasValue
                    ? src.NutritionProviderSubtype.Value.ToString()
                    : null))
            .ForMember(dest => dest.Specialization, opt => opt.MapFrom(src =>
                src.Specializations != null && src.Specializations.Count > 0
                    ? string.Join(", ", src.Specializations)
                    : null))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.AddressLine1))
            .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Latitude))
            .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Longitude))
            .ForMember(dest => dest.ServiceRadius, opt => opt.MapFrom(src => src.ServiceRadiusKm))
            .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.RatingAverage))
            .ForMember(dest => dest.TotalReviews, opt => opt.MapFrom(src => src.RatingCount))
            .ForMember(dest => dest.ApprovalDate, opt => opt.MapFrom(src => src.ApprovedAt))
            .ForMember(dest => dest.IsOnline, opt => opt.MapFrom(src => src.IsAvailable))
            .ForMember(dest => dest.AverageResponseTimeMinutes, opt => opt.MapFrom(src => src.ResponseTimeMinutes))
            .AfterMap((src, dest) =>
            {
                dest.CanRequestVerification = ProviderConstants.CanRequestVerification(src.VerificationStatus);
                dest.CompletionRate = src.TotalBookings > 0
                    ? Math.Round((decimal)src.CompletedBookings / src.TotalBookings * 100, 2)
                    : 0;
            });

        CreateMap<ProviderPreferences, ProviderPreferencesResponse>();

        // ==================== Review → DTO ====================

        // Maps Patient to the brief summary embedded in each ProviderReviewDto.
        CreateMap<Patient, PatientBriefDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.Avatar, opt => opt.Ignore());

        // Projects a Review entity to the DTO returned by GetProviderReviewsQuery.
        // Requires the Patient navigation property to be loaded (via Include or projection).
        CreateMap<Review, ProviderReviewDto>()
            .ForMember(dest => dest.ProfessionalismRating, opt => opt.MapFrom(src => src.RatingProfessionalism))
            .ForMember(dest => dest.PunctualityRating, opt => opt.MapFrom(src => src.RatingPunctuality))
            .ForMember(dest => dest.QualityRating, opt => opt.MapFrom(src => src.RatingQuality));

        // ==================== Availability History → DTO ====================

        CreateMap<ProviderAvailabilityHistory, ProviderAvailabilityHistoryDto>();
    }
}
