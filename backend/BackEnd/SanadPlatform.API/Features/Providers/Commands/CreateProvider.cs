using AutoMapper;
using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Admin command to create a new provider record.
/// </summary>
public record CreateProviderCommand(
    string ServiceCategory,
    bool IsIndividual,
    string? BusinessName,
    string? FirstName,
    string? LastName,
    string? Bio,
    string? ShortDescription,
    string? AddressLine1,
    string? City,
    string CountryCode) : IRequest<ProviderResponse>;

/// <summary>
/// Handler for <see cref="CreateProviderCommand"/>.
/// Stages a new <see cref="Provider"/> in the EF change tracker and persists via IUnitOfWork.
/// </summary>
public class CreateProviderCommandHandler : IRequestHandler<CreateProviderCommand, ProviderResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<CreateProviderCommandHandler> _logger;

    public CreateProviderCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<CreateProviderCommandHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderResponse> Handle(CreateProviderCommand command, CancellationToken cancellationToken)
    {
        var provider = _mapper.Map<Provider>(command);

        await _providerRepository.CreateAsync(provider, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Admin created provider {ProviderId}", provider.Id);

        return _mapper.Map<ProviderResponse>(provider);
    }
}
