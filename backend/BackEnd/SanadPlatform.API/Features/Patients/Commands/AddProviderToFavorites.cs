using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Patients.DTOs;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Patients.Repository;

namespace SanadPlatform.API.Features.Patients.Commands;

/// <summary>
/// Command to add a provider to a patient's favorites.
/// </summary>
public record AddProviderToFavoritesCommand(Guid UserId, Guid ProviderId) : IRequest<PatientFavoriteSlimResponse>;

/// <summary>
/// Handler for AddProviderToFavoritesCommand.
/// </summary>
public class AddProviderToFavoritesHandler : IRequestHandler<AddProviderToFavoritesCommand, PatientFavoriteSlimResponse>
{
    private readonly IPatientRepository _patientRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<AddProviderToFavoritesHandler> _logger;

    public AddProviderToFavoritesHandler(
        IPatientRepository patientRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<AddProviderToFavoritesHandler> logger)
    {
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<PatientFavoriteSlimResponse> Handle(AddProviderToFavoritesCommand command, CancellationToken cancellationToken)
    {
        var patient = await _patientRepository.GetByUserIdAsync(command.UserId, cancellationToken);
        if (patient == null)
        {
            _logger.LogWarning("Patient profile not found for user {UserId}", command.UserId);
            throw new KeyNotFoundException("Patient profile not found");
        }

        var favorite = new PatientFavorite
        {
            PatientId = patient.Id,
            ProviderId = command.ProviderId
        };

        try
        {
            var result = await _patientRepository.CreateFavoriteAsync(favorite, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<PatientFavoriteSlimResponse>(result);
        }
        catch (DbUpdateException ex) when (ex.InnerException is Npgsql.PostgresException pgEx)
        {
            switch (pgEx.SqlState)
            {
                case Npgsql.PostgresErrorCodes.ForeignKeyViolation:
                    _logger.LogWarning("Provider {ProviderId} not found", command.ProviderId);
                    throw new KeyNotFoundException("Provider not found");

                case Npgsql.PostgresErrorCodes.UniqueViolation:
                    _logger.LogInformation("Provider {ProviderId} already in favorites for patient {PatientId}",
                        command.ProviderId, patient.Id);
                    throw new InvalidOperationException("Provider is already in favorites");

                default:
                    throw; // Re-throw unexpected DB errors
            }
        }
    }
}
