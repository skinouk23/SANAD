using AutoMapper;
using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Bookings.Commands;

// ==================== Command ====================

/// <summary>
/// Command to update the delivery address and/or patient notes for a pending/confirmed booking.
/// Only the booking's patient may call this.
/// </summary>
public record UpdateBookingCommand(
    Guid BookingId,
    Guid CallerUserId,
    string? AddressLine1,
    string? City,
    string? PostalCode,
    string? PatientNotes) : IRequest<UpdateBookingResponse>, ISensitiveRequest;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="UpdateBookingCommand"/>.
/// Enforces patient ownership and status guard (Pending or Confirmed only).
/// </summary>
public class UpdateBookingHandler : IRequestHandler<UpdateBookingCommand, UpdateBookingResponse>
{
    private readonly IBookingRepository _repository;
    private readonly IPatientRepository _patientRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<UpdateBookingHandler> _logger;

    public UpdateBookingHandler(
        IBookingRepository repository,
        IPatientRepository patientRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<UpdateBookingHandler> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<UpdateBookingResponse> Handle(
        UpdateBookingCommand command,
        CancellationToken cancellationToken)
    {
        // ==================== Load Tracked Booking ====================
        var booking = await _repository.GetByIdForUpdateAsync(command.BookingId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking {command.BookingId} was not found.");

        // ==================== Ownership Check ====================
        // Efficiently resolve patient ID via projection (Guid?)
        var patientId = await _patientRepository.GetPatientIdByUserIdAsync(command.CallerUserId, cancellationToken)
            ?? throw new KeyNotFoundException($"Patient profile not found for user {command.CallerUserId}.");

        if (booking.PatientId != patientId)
            throw new UnauthorizedAccessException("You do not have permission to update this booking.");

        // ==================== Status Guard ====================
        if (booking.Status != BookingStatus.Pending && booking.Status != BookingStatus.Confirmed)
            throw new InvalidOperationException(
                $"Booking cannot be updated in its current status '{booking.Status}'. " +
                "Only Pending or Confirmed bookings may be modified.");

        // ==================== Apply Changes ====================
        if (command.AddressLine1 != null)
        {
            booking.AddressLine1 = command.AddressLine1;
            booking.City = command.City;
            booking.PostalCode = command.PostalCode;
        }

        if (command.PatientNotes != null)
        {
            booking.PatientNotes = command.PatientNotes;
        }

        // ==================== Persist ====================
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Booking {BookingId} updated by patient {PatientId} (address/notes change)",
            command.BookingId, command.CallerUserId);

        // ==================== Build Response ====================
        return _mapper.Map<UpdateBookingResponse>(booking);
    }
}
