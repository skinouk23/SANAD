using System.Text.Json;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;

namespace SanadPlatform.API.Features.Bookings.Services.Policies;

// ==================== Context ====================

/// <summary>
/// Plain-data context passed to <see cref="IBookingCategoryPolicy.Validate"/> and
/// <see cref="IBookingCategoryPolicy.Process"/>. Contains only scalar values.
/// </summary>
public sealed record BookingCategoryContext(
    string CategoryCode,
    DateOnly StartDate,
    JsonElement? TypeConfig,
    string? AddressLine1,
    string ServiceLocation,
    string? ServiceMetadata,
    decimal BasePrice,
    int? AvailableQuantity,
    bool RequiresPrescription,
    string? PatientLocationChoice,
    Guid? PrescriptionFileId);

// ==================== Result ====================

/// <summary>
/// Computed result returned by <see cref="IBookingCategoryPolicy.Process"/>.
/// </summary>
public sealed record BookingCategoryResult(
    decimal ServicePrice,
    string? ServiceLocationOverride,
    int StockDelta,
    object? CategoryData);

// ==================== Apply Context ====================

/// <summary>
/// Handler-owned values that policies need for entity or response mapping.
/// </summary>
public sealed record BookingApplyContext(
    string ServiceName,
    decimal PlatformFee);

// ==================== Cancellation Context ====================

/// <summary>
/// Plain-data context passed to <see cref="IBookingCategoryPolicy.ProcessCancellation"/>.
/// </summary>
public sealed record BookingCancellationContext(
    string CategoryCode,
    int? AvailableQuantity);

// ==================== Cancellation Result ====================

/// <summary>
/// Computed result returned by <see cref="IBookingCategoryPolicy.ProcessCancellation"/>.
/// </summary>
public sealed record BookingCancellationResult(
    int StockDelta);

// ==================== Equipment Rental Draft ====================

/// <summary>
/// Typed draft data for the <c>equipment_rental</c> category.
/// </summary>
public sealed record EquipmentRentalDraft(
    DateOnly RentalStartDate,
    DateOnly RentalEndDate,
    string RentalDurationType,
    decimal PeriodRate,
    int PeriodCount,
    decimal DepositAmount);

// ==================== Interface ====================

/// <summary>
/// Defines category-specific validation, processing, and entity or response mapping
/// for booking creation.
/// </summary>
public interface IBookingCategoryPolicy
{
    string CategoryCode { get; }

    void Validate(BookingCategoryContext context);

    BookingCategoryResult Process(BookingCategoryContext context);

    void ApplyToBooking(BookingCategoryResult result, Booking booking, BookingApplyContext applyContext);

    void ApplyToResponse(BookingCategoryResult result, CreateBookingResponse response, BookingApplyContext applyContext);

    BookingCancellationResult ProcessCancellation(BookingCancellationContext context);
}
