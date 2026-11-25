using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Insurance.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Insurance.Repository;

/// <summary>
/// EF Core implementation of <see cref="IInsuranceRepository"/>.
/// </summary>
public class InsuranceRepository : IInsuranceRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<InsuranceRepository> _logger;

    public InsuranceRepository(
        SanadDbContext context,
        ILogger<InsuranceRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IReadOnlyList<InsuranceCoverage>> GetCoverageAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        var coverage = await _context.InsuranceCoverages
            .AsNoTracking()
            .Include(c => c.Items)
            .Where(c => c.ProviderId == providerId)
            .ToListAsync(cancellationToken);

        _logger.LogDebug(
            "Retrieved {Count} coverage sections for provider {ProviderId}",
            coverage.Count, providerId);

        return coverage.AsReadOnly();
    }

    public async Task<IReadOnlyList<InsuranceClaim>> GetClaimsAsync(
        Guid providerId,
        string? status,
        CancellationToken cancellationToken = default)
    {
        var query = _context.InsuranceClaims
            .AsNoTracking()
            .Where(c => c.ProviderId == providerId);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(c => c.Status == status);

        var claims = await query
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);

        _logger.LogDebug(
            "Retrieved {Count} claims for provider {ProviderId} with status '{Status}'",
            claims.Count, providerId, status ?? "(any)");

        return claims.AsReadOnly();
    }

    public async Task<IReadOnlyList<InsuranceDocument>> GetDocumentsAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        var documents = await _context.InsuranceDocuments
            .AsNoTracking()
            .Where(d => d.ProviderId == providerId)
            .OrderByDescending(d => d.Date)
            .ToListAsync(cancellationToken);

        _logger.LogDebug(
            "Retrieved {Count} documents for provider {ProviderId}",
            documents.Count, providerId);

        return documents.AsReadOnly();
    }

    public async Task<int> GetClaimsCountAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        return await _context.InsuranceClaims
            .AsNoTracking()
            .Where(c => c.ProviderId == providerId)
            .CountAsync(cancellationToken);
    }
}
