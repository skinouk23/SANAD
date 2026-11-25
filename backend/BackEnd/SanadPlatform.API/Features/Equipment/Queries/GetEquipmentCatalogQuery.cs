using MediatR;
using SanadPlatform.API.Features.Equipment.DTOs;
using SanadPlatform.API.Features.Equipment.Repository;

namespace SanadPlatform.API.Features.Equipment.Queries;

/// <summary>
/// Returns a paginated equipment catalog.
/// </summary>
public record GetEquipmentCatalogQuery(
    int Page,
    int Limit,
    string? Category,
    string? Search,
    string? SortBy,
    bool SortDesc,
    bool? Available,
    decimal? MinPrice,
    decimal? MaxPrice) : IRequest<EquipmentCatalogResponse>;

/// <summary>
/// Handles <see cref="GetEquipmentCatalogQuery"/> by building an
/// <see cref="EquipmentCatalogSpecification"/> and delegating to the repository.
/// </summary>
public class GetEquipmentCatalogHandler : IRequestHandler<GetEquipmentCatalogQuery, EquipmentCatalogResponse>
{
    private readonly IEquipmentRepository _repository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetEquipmentCatalogHandler"/> class.
    /// </summary>
    public GetEquipmentCatalogHandler(IEquipmentRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    /// <summary>
    /// Builds the specification from flattened query parameters and returns a paginated catalog.
    /// </summary>
    public async Task<EquipmentCatalogResponse> Handle(GetEquipmentCatalogQuery query, CancellationToken ct)
    {
        // Reconstruct the DTO for the specification (keeps spec signature stable)
        var request = new GetEquipmentRequest
        {
            Page = query.Page,
            Limit = query.Limit,
            Category = query.Category,
            Search = query.Search,
            SortBy = query.SortBy,
            SortDesc = query.SortDesc,
            Available = query.Available,
            MinPrice = query.MinPrice,
            MaxPrice = query.MaxPrice
        };

        var spec = new EquipmentCatalogSpecification(request);
        return await _repository.GetCatalogAsync(spec, ct);
    }
}