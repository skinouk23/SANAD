using AutoMapper;
using SanadPlatform.API.Features.Authentication.DTOs;
using SanadPlatform.API.Features.Authentication.Entities;


namespace SanadPlatform.API.Common.Mapping;

/// <summary>
/// AutoMapper profile for shared, cross-feature entity to DTO mappings.
/// Feature-specific mappings belong in each feature's own mapping profile
/// (e.g. ProviderMappingProfile, PatientMappingProfile).
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserResponse>();
        //categorie
        
    }
}
