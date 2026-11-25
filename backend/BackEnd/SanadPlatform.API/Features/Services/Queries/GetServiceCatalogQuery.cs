using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Repository;
using SanadPlatform.API.Features.Services.Specifications;

namespace SanadPlatform.API.Features.Services.Queries;

/// <summary>
/// Returns a paginated, patient-facing service catalog.
/// </summary>
public record GetServiceCatalogQuery(
    string? DisplayGroup,
    string? Category,
    Guid? ProviderId,
    string? Search,
    decimal? MinPrice,
    decimal? MaxPrice,
    string? SortBy,
    bool SortDesc,
    int Page,
    int Limit) : IRequest<PatientServiceCatalogResponse>;

/// <summary>
/// Handles <see cref="GetServiceCatalogQuery"/> by resolving display-group codes,
/// building a <see cref="ServiceCatalogSpecification"/>, and delegating to the repository.
/// </summary>
public class GetServiceCatalogHandler
    : IRequestHandler<GetServiceCatalogQuery, PatientServiceCatalogResponse>
{
    private readonly IServiceRepository _repository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetServiceCatalogHandler"/> class.
    /// </summary>
    public GetServiceCatalogHandler(IServiceRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    /// <summary>
    /// Resolves category codes for the requested display group (if any),
    /// builds the specification, and returns a paginated catalog.
    /// </summary>
    public async Task<PatientServiceCatalogResponse> Handle(
        GetServiceCatalogQuery query,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<string>? categoryCodes = null;

        // Resolve display group → category codes (loose join)
        if (!string.IsNullOrWhiteSpace(query.DisplayGroup)
            && Enum.TryParse<DisplayGroup>(query.DisplayGroup, ignoreCase: true, out var displayGroup))
        {
            categoryCodes = await _repository.GetCategoryCodesByDisplayGroupAsync(
                displayGroup, cancellationToken);
        }

        // Reconstruct the DTO for the specification (keeps spec signature stable)
        var request = new GetServiceCatalogRequest
        {
            DisplayGroup = query.DisplayGroup,
            Category = query.Category,
            ProviderId = query.ProviderId,
            Search = query.Search,
            MinPrice = query.MinPrice,
            MaxPrice = query.MaxPrice,
            SortBy = query.SortBy,
            SortDesc = query.SortDesc,
            Page = query.Page,
            Limit = query.Limit
        };

        var spec = new ServiceCatalogSpecification(request, categoryCodes);

        return await _repository.GetCatalogAsync(spec, cancellationToken);
    }
}
