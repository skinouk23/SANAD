using System.Text.Json;
using AutoMapper;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Entities;

namespace SanadPlatform.API.Features.Services.Mappings;

/// <summary>
/// AutoMapper profile for the Services feature.
/// Maps Service and ServiceAddon entities to their DTO counterparts.
/// Used by handlers via IMapper to eliminate manual mapping duplication.
/// </summary>
public class ServiceMappingProfile : Profile
{
    /// <summary>
    /// Initializes Service feature mappings.
    /// </summary>
    public ServiceMappingProfile()
    {
        // ==================== ServiceAddon -> SubServiceResponse ====================
        CreateMap<ServiceAddon, SubServiceResponse>();

        // ==================== Service -> ServiceDetailResponse ====================
        CreateMap<Service, ServiceDetailResponse>()
            .ForMember(dest => dest.TypeConfig, opt => opt.MapFrom(src => DeserializeMetadata(src.Metadata)))
            .ForMember(dest => dest.SubServices, opt => opt.MapFrom(src => src.Addons))
            .ForMember(dest => dest.GalleryFileIds, opt => opt.MapFrom(src => src.Photos
                .Where(photo => !photo.IsMain)
                .OrderBy(photo => photo.SortOrder)
                .Select(photo => photo.FileId)
                .ToArray()));

        // ==================== Service -> ServiceSummaryResponse ====================
        CreateMap<Service, ServiceSummaryResponse>()
            .ForMember(dest => dest.TypeConfig, opt => opt.MapFrom(src => DeserializeMetadata(src.Metadata)))
            .ForMember(dest => dest.SubServiceCount, opt => opt.MapFrom(src => src.Addons.Count));
    }

    // ==================== Private Helpers ====================

    /// <summary>
    /// Deserializes the Metadata JSON string into a <see cref="JsonElement"/> so it
    /// serializes as a native JSON object in responses rather than a double-encoded string.
    /// Returns <c>null</c> when the metadata is null or empty.
    /// </summary>
    private static object? DeserializeMetadata(string? metadata)
    {
        if (string.IsNullOrWhiteSpace(metadata))
            return null;

        try
        {
            return JsonSerializer.Deserialize<JsonElement>(metadata);
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
