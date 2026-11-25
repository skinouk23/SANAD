using MediatR;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve public provider listing filter options.
/// </summary>
public record GetProviderFilterOptionsQuery(string? ServiceCategory) : IRequest<ProviderFilterOptionsResponse>;

/// <summary>
/// Handler for <see cref="GetProviderFilterOptionsQuery"/>.
/// </summary>
public class GetProviderFilterOptionsQueryHandler
    : IRequestHandler<GetProviderFilterOptionsQuery, ProviderFilterOptionsResponse>
{
    private readonly IProviderRepository _repository;
    private readonly ILogger<GetProviderFilterOptionsQueryHandler> _logger;

    public GetProviderFilterOptionsQueryHandler(
        IProviderRepository repository,
        ILogger<GetProviderFilterOptionsQueryHandler> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderFilterOptionsResponse> Handle(
        GetProviderFilterOptionsQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogDebug(
            "Fetching provider filter options for service category {ServiceCategory}",
            query.ServiceCategory);

        return await _repository.GetFilterOptionsAsync(query.ServiceCategory, cancellationToken);
    }
}
