namespace SanadPlatform.API.Features.Insurance.DTOs;

/// <summary>
/// Single coverage item within a section.
/// </summary>
public record CoverageItemResponse(
    string Text,
    string Limit);

/// <summary>
/// Coverage section response.
/// </summary>
public record CoverageSectionResponse(
    string Category,
    IReadOnlyList<CoverageItemResponse> Items);

/// <summary>
/// Insurance claim response.
/// </summary>
public record InsuranceClaimResponse(
    Guid Id,
    string Date,
    string Type,
    string Status,
    decimal Amount,
    string Description);

/// <summary>
/// Insurance document response.
/// </summary>
public record InsuranceDocumentResponse(
    string Name,
    string Size,
    string Date);

/// <summary>
/// Insurance stats response.
/// </summary>
public record InsuranceStatsResponse(
    string Status,
    string ValidUntil,
    string MaxCoverage,
    int ClaimsCount,
    string Franchise);
