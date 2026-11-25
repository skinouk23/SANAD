using AutoMapper;
using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Admin command to update an existing provider by its ID.
/// This is distinct from <see cref="UpdateProviderProfileCommand"/> which is the
/// self-service command used by the authenticated provider to update their own profile.
/// </summary>
public record UpdateProviderCommand(
    Guid Id,
    string? BusinessName,
    string? FirstName,
    string? LastName,
    string? Bio,
    string? ShortDescription,
    string? AddressLine1,
    string? AddressLine2,
    string? City,
    string? StateProvince,
    string? PostalCode,
    string? CountryCode) : IRequest<ProviderResponse>;

/// <summary>
/// Handler for <see cref="UpdateProviderCommand"/>.
/// Uses a tracked read to preserve the xmin concurrency token so that a concurrent
/// update causes <see cref="Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException"/>
/// (mapped to 409 by <c>GlobalExceptionHandlingMiddleware</c>) rather than silently
/// overwriting the conflicting write.
/// Throws <see cref="KeyNotFoundException"/> (→ 404) when the provider does not exist.
/// </summary>
public class UpdateProviderCommandHandler : IRequestHandler<UpdateProviderCommand, ProviderResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<UpdateProviderCommandHandler> _logger;

    public UpdateProviderCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<UpdateProviderCommandHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderResponse> Handle(UpdateProviderCommand command, CancellationToken cancellationToken)
    {
        // Tracked read — xmin value is retained in the change tracker for optimistic concurrency.
        var provider = await _providerRepository.GetByIdForUpdateAsync(command.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider {command.Id} not found.");

        _mapper.Map(command, provider);

        await _providerRepository.UpdateAsync(provider, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Admin updated provider {ProviderId}", provider.Id);

        return _mapper.Map<ProviderResponse>(provider);
    }
}
