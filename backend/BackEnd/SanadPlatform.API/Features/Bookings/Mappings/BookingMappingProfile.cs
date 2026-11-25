using AutoMapper;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Equipment.Entities;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Services.Entities;

namespace SanadPlatform.API.Features.Bookings.Mappings;

/// <summary>
/// AutoMapper profile for the Bookings feature.
/// </summary>
public class BookingMappingProfile : Profile
{
    public BookingMappingProfile()
    {
        CreateMap<Booking, BookingResponse>()
            .ForMember(dest => dest.PrimaryServiceId,
                opt => opt.MapFrom(src => src.ServiceId))
            .ForMember(dest => dest.DailyStartTime,
                opt => opt.MapFrom(src => src.DailyStartTime.ToTimeSpan()))
            .ForMember(dest => dest.DailyEndTime,
                opt => opt.MapFrom(src => src.DailyEndTime.HasValue ? src.DailyEndTime.Value.ToTimeSpan() : (TimeSpan?)null))
            .ForMember(dest => dest.DayCount,
                opt => opt.MapFrom(src => src.EndDate.DayNumber - src.StartDate.DayNumber + 1))
            .ForMember(dest => dest.PaymentId,
                opt => opt.MapFrom(src => src.Payment != null ? src.Payment.Id : (Guid?)null))
            .ForMember(dest => dest.PaymentStatus,
                opt => opt.MapFrom(src => src.Payment != null ? src.Payment.Status : null))
            .ForMember(dest => dest.PaymentMethodType,
                opt => opt.MapFrom(src => src.Payment != null ? src.Payment.MethodType : null))
            .ForMember(dest => dest.PaymentReferenceNumber,
                opt => opt.MapFrom(src => src.Payment != null ? src.Payment.ReferenceNumber : null))
            .ForMember(dest => dest.PatientPhoneNumber,
                opt => opt.MapFrom(src => src.PatientPhone))
            .ForMember(dest => dest.ProviderName,
                opt => opt.MapFrom(src => src.Provider != null
                    ? src.Provider.FirstName + " " + src.Provider.LastName
                    : string.Empty))
            .ForMember(dest => dest.ProviderPhoneNumber,
                opt => opt.MapFrom(src => src.Provider != null && src.Provider.User != null
                    && (src.Status == BookingStatus.Confirmed
                        || src.Status == BookingStatus.ProviderOnWay
                        || src.Status == BookingStatus.InProgress
                        || src.Status == BookingStatus.Completed
                        || src.Status == BookingStatus.Validated)
                    ? src.Provider.User.Phone
                    : null))
            .ForMember(dest => dest.ProviderProfilePhotoUrl,
                opt => opt.Ignore())
            .ForMember(dest => dest.ServiceName,
                opt => opt.MapFrom(src => src.Service != null ? src.Service.Name : string.Empty))
            .ForMember(dest => dest.EstimatedCost,
                opt => opt.MapFrom(src => src.Service != null ? (decimal?)src.Service.Price : null))
            .ForMember(dest => dest.ServiceModality,
                opt => opt.MapFrom(src => src.ServiceLocation ?? string.Empty))
            .ForMember(dest => dest.ServiceCategory,
                opt => opt.MapFrom(src => src.Service != null ? src.Service.Category : null))
            .ForMember(dest => dest.PerDaySubtotal,
                opt => opt.MapFrom(src => src.ServicePrice + src.AddonsPrice))
            .ForMember(dest => dest.IsProviderConfirmed,
                opt => opt.MapFrom(src => src.ProviderAcceptedAt != null))
            .ForMember(dest => dest.ProviderConfirmedAt,
                opt => opt.MapFrom(src => src.ProviderAcceptedAt))
            .ForMember(dest => dest.IsRescheduleRequested,
                opt => opt.MapFrom(src => src.RescheduleCount > 0))
            .ForMember(dest => dest.Patient,
                opt => opt.MapFrom(src => src.Patient))
            .ForMember(dest => dest.Provider,
                opt => opt.MapFrom(src => src.Provider))
            .ForMember(dest => dest.Service,
                opt => opt.MapFrom(src => src.Service))
            .ForMember(dest => dest.LineItems,
                opt => opt.MapFrom(src => src.LineItems))
            .ForMember(dest => dest.SessionCounts,
                opt => opt.Ignore())
            .ForMember(dest => dest.Sessions,
                opt => opt.Ignore());

        CreateMap<Patient, BookingResponse.PatientSummary>()
            .ForMember(dest => dest.ProfilePhotoUrl,
                opt => opt.Ignore());

        CreateMap<Provider, BookingResponse.ProviderSummary>()
            .ForMember(dest => dest.ProfilePhotoUrl,
                opt => opt.Ignore())
            .ForMember(dest => dest.AverageRating,
                opt => opt.MapFrom(src => src.RatingAverage))
            .ForMember(dest => dest.TotalReviews,
                opt => opt.MapFrom(src => src.RatingCount));

        CreateMap<Service, BookingResponse.ServiceSummary>()
            .ForMember(dest => dest.EstimatedDurationMinutes,
                opt => opt.MapFrom(src => src.DurationMinutes ?? 0));

        CreateMap<Booking, UpdateBookingResponse>()
            .ForMember(dest => dest.Address,
                opt => opt.MapFrom(src => src.AddressLine1 == null
                    ? null
                    : new UpdateBookingAddressResponse
                    {
                        Line1 = src.AddressLine1,
                        City = src.City,
                        PostalCode = src.PostalCode
                    }));

        CreateMap<Booking, BookingListItemResponse>()
            .ForMember(dest => dest.SessionId,
                opt => opt.Ignore())
            .ForMember(dest => dest.SessionStatus,
                opt => opt.Ignore())
            .ForMember(dest => dest.Status,
                opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.Type,
                opt => opt.MapFrom(src => src.ServiceLocation ?? "home"))
            .ForMember(dest => dest.ScheduledAt,
                opt => opt.MapFrom(src => new DateTime(
                    src.StartDate.Year,
                    src.StartDate.Month,
                    src.StartDate.Day,
                    src.DailyStartTime.Hour,
                    src.DailyStartTime.Minute,
                    src.DailyStartTime.Second,
                    DateTimeKind.Utc)))
            .ForMember(dest => dest.DailyStartTime,
                opt => opt.MapFrom(src => src.DailyStartTime.ToTimeSpan()))
            .ForMember(dest => dest.DailyEndTime,
                opt => opt.MapFrom(src => src.DailyEndTime.HasValue ? src.DailyEndTime.Value.ToTimeSpan() : (TimeSpan?)null))
            .ForMember(dest => dest.DayCount,
                opt => opt.MapFrom(src => src.EndDate.DayNumber - src.StartDate.DayNumber + 1))
            .ForMember(dest => dest.PaymentId,
                opt => opt.MapFrom(src => src.Payment != null ? src.Payment.Id : (Guid?)null))
            .ForMember(dest => dest.PaymentStatus,
                opt => opt.MapFrom(src => src.Payment != null ? src.Payment.Status : null))
            .ForMember(dest => dest.PaymentMethodType,
                opt => opt.MapFrom(src => src.Payment != null ? src.Payment.MethodType : null))
            .ForMember(dest => dest.PaymentReferenceNumber,
                opt => opt.MapFrom(src => src.Payment != null ? src.Payment.ReferenceNumber : null))
            .ForMember(dest => dest.PerDaySubtotal,
                opt => opt.MapFrom(src => src.ServicePrice + src.AddonsPrice))
            .ForMember(dest => dest.Address,
                opt => opt.MapFrom(src => string.IsNullOrWhiteSpace(src.AddressLine1)
                    ? null
                    : string.IsNullOrWhiteSpace(src.City)
                        ? src.AddressLine1
                        : src.AddressLine1 + ", " + src.City))
            .ForMember(dest => dest.Location,
                opt => opt.MapFrom(src => src))
            .ForMember(dest => dest.Notes,
                opt => opt.MapFrom(src => src.PatientNotes))
            .ForMember(dest => dest.ValidationCode,
                opt => opt.MapFrom(src => (src.Status == BookingStatus.Completed || src.Status == BookingStatus.Validated)
                    ? src.ValidationCode
                    : null))
            .ForMember(dest => dest.Rating,
                opt => opt.Ignore())
            .ForMember(dest => dest.ReviewComment,
                opt => opt.Ignore())
            .ForMember(dest => dest.Provider,
                opt => opt.MapFrom(src => src))
            .ForMember(dest => dest.Patient,
                opt => opt.MapFrom(src => src))
            .ForMember(dest => dest.Service,
                opt => opt.MapFrom(src => src.Service))
            .ForMember(dest => dest.EquipmentRental,
                opt => opt.MapFrom(src => src.EquipmentRental))
            .ForMember(dest => dest.LineItems,
                opt => opt.MapFrom(src => src.LineItems))
            .ForMember(dest => dest.SessionCounts,
                opt => opt.Ignore());

        CreateMap<Booking, ProviderPlanningBookingResponse>()
            .ForMember(dest => dest.BookingId,
                opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.SessionId,
                opt => opt.Ignore())
            .ForMember(dest => dest.SessionStatus,
                opt => opt.Ignore())
            .ForMember(dest => dest.Status,
                opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.Type,
                opt => opt.MapFrom(src => src.ServiceLocation ?? "home"))
            .ForMember(dest => dest.ScheduledAt,
                opt => opt.MapFrom(src => new DateTime(
                    src.StartDate.Year,
                    src.StartDate.Month,
                    src.StartDate.Day,
                    src.DailyStartTime.Hour,
                    src.DailyStartTime.Minute,
                    src.DailyStartTime.Second,
                    DateTimeKind.Utc)))
            .ForMember(dest => dest.DailyStartTime,
                opt => opt.MapFrom(src => src.DailyStartTime.ToTimeSpan()))
            .ForMember(dest => dest.DailyEndTime,
                opt => opt.MapFrom(src => src.DailyEndTime.HasValue ? src.DailyEndTime.Value.ToTimeSpan() : (TimeSpan?)null))
            .ForMember(dest => dest.DayCount,
                opt => opt.MapFrom(src => src.EndDate.DayNumber - src.StartDate.DayNumber + 1))
            .ForMember(dest => dest.Address,
                opt => opt.MapFrom(src => string.IsNullOrWhiteSpace(src.AddressLine1)
                    ? null
                    : string.IsNullOrWhiteSpace(src.City)
                        ? src.AddressLine1
                        : src.AddressLine1 + ", " + src.City))
            .ForMember(dest => dest.Location,
                opt => opt.MapFrom(src => src))
            .ForMember(dest => dest.Notes,
                opt => opt.MapFrom(src => src.PatientNotes))
            .ForMember(dest => dest.Patient,
                opt => opt.MapFrom(src => src))
            .ForMember(dest => dest.Service,
                opt => opt.MapFrom(src => src.Service));

        CreateMap<Booking, ProviderBookingDeliveryLocationResponse>()
            .ForMember(dest => dest.Lat,
                opt => opt.MapFrom(src => src.Latitude))
            .ForMember(dest => dest.Lng,
                opt => opt.MapFrom(src => src.Longitude))
            .ForMember(dest => dest.Address,
                opt => opt.MapFrom(src => string.IsNullOrWhiteSpace(src.AddressLine1)
                    ? (string.IsNullOrWhiteSpace(src.City) ? null : src.City)
                    : string.IsNullOrWhiteSpace(src.City)
                        ? src.AddressLine1
                        : src.AddressLine1 + ", " + src.City));

        CreateMap<Booking, BookingListProviderDto>()
            .ForMember(dest => dest.Id,
                opt => opt.MapFrom(src => src.ProviderId))
            .ForMember(dest => dest.Name,
                opt => opt.MapFrom(src => src.Provider != null
                    ? (src.Provider.FirstName + " " + src.Provider.LastName).Trim()
                    : string.Empty))
            .ForMember(dest => dest.Phone,
                opt => opt.MapFrom(src => (src.Status == BookingStatus.Confirmed
                        || src.Status == BookingStatus.ProviderOnWay
                        || src.Status == BookingStatus.InProgress
                        || src.Status == BookingStatus.Completed
                        || src.Status == BookingStatus.Validated)
                    && src.Provider != null
                    && src.Provider.User != null
                    ? src.Provider.User.Phone
                    : null))
            .ForMember(dest => dest.Rating,
                opt => opt.MapFrom(src => src.Provider != null ? src.Provider.RatingAverage : 0m));

        CreateMap<Booking, BookingListPatientDto>()
            .ForMember(dest => dest.Id,
                opt => opt.MapFrom(src => src.PatientId))
            .ForMember(dest => dest.Name,
                opt => opt.MapFrom(src => src.PatientName))
            .ForMember(dest => dest.Phone,
                opt => opt.MapFrom(src => src.Status != BookingStatus.Cancelled ? src.PatientPhone : null));

        CreateMap<Service, BookingListServiceDto>();

        CreateMap<BookingLineItem, BookingLineItemResponse>();

        CreateMap<EquipmentRental, EquipmentRentalResponse>()
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.RentalEndDate))
            .ForMember(dest => dest.ActualReturnDate, opt => opt.MapFrom(src => src.ActualReturnDate))
            .ForMember(dest => dest.RentalDurationType, opt => opt.MapFrom(src => src.RentalDurationType))
            .ForMember(dest => dest.PeriodRate, opt => opt.MapFrom(src => src.PeriodRate))
            .ForMember(dest => dest.DepositAmount, opt => opt.MapFrom(src => src.DepositAmount ?? 0m))
            .ForMember(dest => dest.DepositStatus, opt => opt.MapFrom(src =>
                src.DepositReturned
                    ? PaymentStatuses.Released
                    : (src.DepositPaid ? PaymentStatuses.Held : PaymentStatuses.Pending)))
            .ForMember(dest => dest.PeriodCount, opt => opt.MapFrom(src => src.PeriodCount));
    }
}
