using SanadPlatform.API.Common.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SanadPlatform.API.Features.Equipment.DTOs;

public record EquipmentCategoryResponse
{
    public Guid Id { get; init; }
    public string Code { get; init; } = string.Empty;
    public string Label { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Icon { get; init; }
    public string? Color { get; init; }
}
public record EquipmentCatalogResponse
{
    public IReadOnlyList<EquipmentResponse> Items { get; init; } = Array.Empty<EquipmentResponse>();
    public PaginationMetadata Pagination { get; init; } = new();
}
public record GetEquipmentRequest
{
    public int Page { get; init; } = 1;
    public int Limit { get; init; } = 12;
    public string? Category { get; init; }
    public string? Search { get; init; }
    public string? SortBy { get; init; } = "createdAt";
    public bool SortDesc { get; init; } = true;
    public bool? Available { get; init; }
    public decimal? MinPrice { get; init; }
    public decimal? MaxPrice { get; init; }
}

public record EquipmentResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string CategoryCode { get; init; } = string.Empty;
    public string CategoryName { get; init; } = string.Empty;
    public string Brand { get; init; } = string.Empty;
    public string ImageUrl { get; init; } = string.Empty;
    public decimal PricePerDay { get; init; }
    public int AvailableQuantity { get; init; }
    public EquipmentProviderDto Provider { get; init; } = null!;
    public decimal Rating { get; init; }
    public int ReviewCount { get; init; }
}

public record EquipmentProviderDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
}
public record EquipmentDetailResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string CategoryCode { get; init; } = string.Empty;
    public string CategoryName { get; init; } = string.Empty;
    public string Brand { get; init; } = string.Empty;
    public string Model { get; init; } = string.Empty;
    public IReadOnlyList<string> Images { get; init; } = Array.Empty<string>();
    public decimal PricePerDay { get; init; }
    public decimal PricePerWeek { get; init; }
    public decimal PricePerMonth { get; init; }
    public decimal Deposit { get; init; }
    public int AvailableQuantity { get; init; }
    public Dictionary<string, JsonElement>? Specifications { get; init; }
    public IReadOnlyList<string> Features { get; init; } = Array.Empty<string>();
    public EquipmentProviderDetailDto Provider { get; init; } = null!;
    public decimal Rating { get; init; }
    public int ReviewCount { get; init; }
}

public record EquipmentProviderDetailDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public decimal Rating { get; init; }
    public bool Verified { get; init; }
    public string? Phone { get; init; }
}
