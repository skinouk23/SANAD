using MediatR;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve the authenticated provider's booking payment history.
/// </summary>
public record GetMyProviderPaymentHistoryQuery(
    Guid UserId,
    string? Status = null,
    string? Search = null,
    DateTime? DateFrom = null,
    DateTime? DateTo = null,
    int Page = 1,
    int Limit = 10,
    string? Sort = null) : IRequest<ProviderPaymentHistoryResponse>;

/// <summary>
/// Handles <see cref="GetMyProviderPaymentHistoryQuery"/>.
/// </summary>
public class GetMyProviderPaymentHistoryHandler
    : IRequestHandler<GetMyProviderPaymentHistoryQuery, ProviderPaymentHistoryResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IProviderPaymentHistoryRepository _paymentHistoryRepository;
    private readonly ILogger<GetMyProviderPaymentHistoryHandler> _logger;

    public GetMyProviderPaymentHistoryHandler(
        IProviderRepository providerRepository,
        IProviderPaymentHistoryRepository paymentHistoryRepository,
        ILogger<GetMyProviderPaymentHistoryHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _paymentHistoryRepository = paymentHistoryRepository ?? throw new ArgumentNullException(nameof(paymentHistoryRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderPaymentHistoryResponse> Handle(
        GetMyProviderPaymentHistoryQuery request,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(request.UserId, cancellationToken)
            ?? throw new KeyNotFoundException("Provider profile not found.");

        var normalizedRequest = new GetMyProviderPaymentHistoryRequest
        {
            Status = request.Status,
            Search = request.Search,
            DateFrom = request.DateFrom,
            DateTo = request.DateTo,
            Page = request.Page,
            Limit = request.Limit,
            Sort = request.Sort
        };

        _logger.LogDebug(
            "Retrieving payment history for provider {ProviderId} (page {Page}, limit {Limit})",
            providerId,
            normalizedRequest.Page,
            normalizedRequest.Limit);

        var (items, total) = await _paymentHistoryRepository.GetPaymentHistoryAsync(
            providerId,
            normalizedRequest,
            cancellationToken);

        var page = normalizedRequest.Page > 0 ? normalizedRequest.Page : 1;
        var limit = normalizedRequest.Limit > 0 ? normalizedRequest.Limit : 10;

        return new ProviderPaymentHistoryResponse
        {
            Items = items,
            Pagination = new PaginationMetadata
            {
                Page = page,
                Limit = limit,
                Total = total,
                TotalPages = (int)Math.Ceiling(total / (double)limit)
            }
        };
    }
}
