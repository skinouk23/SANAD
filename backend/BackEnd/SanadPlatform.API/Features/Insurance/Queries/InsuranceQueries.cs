using MediatR;
using SanadPlatform.API.Features.Insurance.DTOs;
using SanadPlatform.API.Features.Insurance.Repository;

namespace SanadPlatform.API.Features.Insurance.Queries;

// ==================== GetInsuranceCoverage ====================

public record GetInsuranceCoverageQuery(Guid ProviderId) : IRequest<IReadOnlyList<CoverageSectionResponse>>;

public class GetInsuranceCoverageQueryHandler : IRequestHandler<GetInsuranceCoverageQuery, IReadOnlyList<CoverageSectionResponse>>
{
    private readonly IInsuranceRepository _repository;

    public GetInsuranceCoverageQueryHandler(IInsuranceRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<IReadOnlyList<CoverageSectionResponse>> Handle(
        GetInsuranceCoverageQuery request,
        CancellationToken cancellationToken)
    {
        var coverage = await _repository.GetCoverageAsync(request.ProviderId, cancellationToken);

        return coverage.Select(c => new CoverageSectionResponse(
            c.Category,
            c.Items.Select(i => new CoverageItemResponse(i.Text, i.Limit)).ToList().AsReadOnly()
        )).ToList().AsReadOnly();
    }
}

// ==================== GetInsuranceClaims ====================

public record GetInsuranceClaimsQuery(Guid ProviderId, string? Status) : IRequest<IReadOnlyList<InsuranceClaimResponse>>;

public class GetInsuranceClaimsQueryHandler : IRequestHandler<GetInsuranceClaimsQuery, IReadOnlyList<InsuranceClaimResponse>>
{
    private readonly IInsuranceRepository _repository;

    public GetInsuranceClaimsQueryHandler(IInsuranceRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<IReadOnlyList<InsuranceClaimResponse>> Handle(
        GetInsuranceClaimsQuery request,
        CancellationToken cancellationToken)
    {
        var claims = await _repository.GetClaimsAsync(request.ProviderId, request.Status, cancellationToken);

        return claims.Select(c => new InsuranceClaimResponse(
            c.Id,
            c.ServiceDate.ToString("yyyy-MM-dd"),
            MapClaimType(c.ServiceDescription),
            MapClaimStatus(c.Status),
            c.ClaimedAmount,
            c.ServiceDescription
        )).ToList().AsReadOnly();
    }

    private static string MapClaimType(string serviceDescription)
    {
        return serviceDescription switch
        {
            string s when s.Contains("Dommage", StringComparison.OrdinalIgnoreCase) => "Dommage matériel",
            string s when s.Contains("juridique", StringComparison.OrdinalIgnoreCase) => "Défense juridique",
            _ => serviceDescription.Length > 30 ? serviceDescription[..30] + "..." : serviceDescription
        };
    }

    private static string MapClaimStatus(string status)
    {
        return status.ToLowerInvariant() switch
        {
            "draft" or "submitted" => "pending",
            "in_review" or "under_review" => "in-progress",
            "approved" or "rejected" or "paid" or "resolved" => "resolved",
            _ => "pending"
        };
    }
}

// ==================== GetInsuranceDocuments ====================

public record GetInsuranceDocumentsQuery(Guid ProviderId) : IRequest<IReadOnlyList<InsuranceDocumentResponse>>;

public class GetInsuranceDocumentsQueryHandler : IRequestHandler<GetInsuranceDocumentsQuery, IReadOnlyList<InsuranceDocumentResponse>>
{
    private readonly IInsuranceRepository _repository;

    public GetInsuranceDocumentsQueryHandler(IInsuranceRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<IReadOnlyList<InsuranceDocumentResponse>> Handle(
        GetInsuranceDocumentsQuery request,
        CancellationToken cancellationToken)
    {
        var documents = await _repository.GetDocumentsAsync(request.ProviderId, cancellationToken);

        return documents.Select(d => new InsuranceDocumentResponse(
            d.Name,
            d.Size,
            d.Date.ToString("yyyy-MM-dd")
        )).ToList().AsReadOnly();
    }
}

// ==================== GetInsuranceStats ====================

public record GetInsuranceStatsQuery(Guid ProviderId) : IRequest<InsuranceStatsResponse>;

public class GetInsuranceStatsQueryHandler : IRequestHandler<GetInsuranceStatsQuery, InsuranceStatsResponse>
{
    private readonly IInsuranceRepository _repository;

    public GetInsuranceStatsQueryHandler(IInsuranceRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<InsuranceStatsResponse> Handle(
        GetInsuranceStatsQuery request,
        CancellationToken cancellationToken)
    {
        var claimsCount = await _repository.GetClaimsCountAsync(request.ProviderId, cancellationToken);

        return new InsuranceStatsResponse(
            "Active",
            "2024-12-31",
            "500K TND",
            claimsCount,
            "0 TND");
    }
}
