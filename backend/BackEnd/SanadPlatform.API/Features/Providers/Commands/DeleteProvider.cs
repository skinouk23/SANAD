using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Commands;

/// <summary>
/// Admin command to delete a provider by its ID.
/// </summary>
public record DeleteProviderCommand(Guid Id) : IRequest;

/// <summary>
/// Handler for <see cref="DeleteProviderCommand"/>.
/// Throws <see cref="KeyNotFoundException"/> (→ 404) when the provider does not exist.
/// Because Provider implements ISoftDeletable, the deletion is a soft delete:
/// the AuditableEntityInterceptor sets DeletedAt = UtcNow instead of issuing a DELETE statement.
/// </summary>
public class DeleteProviderCommandHandler : IRequestHandler<DeleteProviderCommand>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeleteProviderCommandHandler> _logger;

    public DeleteProviderCommandHandler(
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        ILogger<DeleteProviderCommandHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task Handle(DeleteProviderCommand command, CancellationToken cancellationToken)
    {
        var deleted = await _providerRepository.DeleteAsync(command.Id, cancellationToken);
        if (!deleted)
            throw new KeyNotFoundException($"Provider {command.Id} not found.");

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Admin deleted provider {ProviderId}", command.Id);
    }
}
