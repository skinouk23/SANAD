using System.Text.Json;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Funeral.Entities;

namespace SanadPlatform.API.Features.Bookings.Services.Policies;

/// <summary>
/// Configuration deserialized from <c>CreateBookingCommand.TypeConfig</c> for funeral bookings.
/// </summary>
internal sealed class FuneralBookingConfig
{
    public string? DeceasedName { get; set; }
    public string? DeceasedAge { get; set; }
    public string? DeceasedBirthDate { get; set; }
    public string? DeceasedDeathDate { get; set; }
    public string? DeathPlace { get; set; }
    public string? Religion { get; set; }
    public string? ContactName { get; set; }
    public string? ContactPhone { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactRelationship { get; set; }
    public string? CeremonyType { get; set; }
    public string? CeremonyLocation { get; set; }
    public string? BurialType { get; set; }
    public bool FloralService { get; set; }
    public bool TransportService { get; set; }
    public bool AdminAssistance { get; set; }
    public bool GriefSupport { get; set; }
    public bool RequiresRepatriation { get; set; }
    public string? RepatriationCountry { get; set; }
    public string? SpecialRequests { get; set; }
}

/// <summary>
/// Typed draft data for the <c>funeral</c> category.
/// Created by <see cref="FuneralBookingCategoryPolicy.Process"/> and consumed
/// by <see cref="FuneralBookingCategoryPolicy.ApplyToBooking"/>.
/// </summary>
public sealed record FuneralBookingDraft(
    string DeceasedName,
    string? DeceasedAge,
    string? DeceasedBirthDate,
    string? DeceasedDeathDate,
    string? DeathPlace,
    string? Religion,
    string ContactName,
    string ContactPhone,
    string? ContactEmail,
    string? ContactRelationship,
    string? CeremonyType,
    string? CeremonyLocation,
    string? BurialType,
    bool FloralService,
    bool TransportService,
    bool AdminAssistance,
    bool GriefSupport,
    bool RequiresRepatriation,
    string? RepatriationCountry,
    string? SpecialRequests);

/// <summary>
/// Booking category policy for the <c>funeral</c> category.
/// Validates funeral-specific constraints, preserves structured intake inputs,
/// and builds the <see cref="FuneralBooking"/> child entity via <see cref="ApplyToBooking"/>.
/// </summary>
public class FuneralBookingCategoryPolicy : IBookingCategoryPolicy
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly ILogger<FuneralBookingCategoryPolicy> _logger;

    public FuneralBookingCategoryPolicy(ILogger<FuneralBookingCategoryPolicy> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public string CategoryCode => ServiceCategories.Funeral;

    // ==================== Validate ====================

    /// <inheritdoc />
    public void Validate(BookingCategoryContext context)
    {
        var config = DeserializeConfig(context.TypeConfig);
        var missingFields = GetMissingRequiredFields(config);

        if (missingFields.Count > 0)
        {
            _logger.LogWarning(
                "Funeral booking validation failed because required fields were missing: {MissingFields}",
                missingFields);

            throw new InvalidOperationException(BuildMissingFieldsMessage(
                "Funeral bookings require ",
                missingFields));
        }

        _logger.LogInformation(
            "Validated funeral booking config with hasDeceasedName {HasDeceasedName}, hasDeceasedAge {HasDeceasedAge}, hasDeceasedBirthDate {HasDeceasedBirthDate}, hasDeceasedDeathDate {HasDeceasedDeathDate}, hasDeathPlace {HasDeathPlace}, hasReligion {HasReligion}, hasContactName {HasContactName}, hasContactPhone {HasContactPhone}, hasContactEmail {HasContactEmail}, hasContactRelationship {HasContactRelationship}, hasCeremonyType {HasCeremonyType}, hasCeremonyLocation {HasCeremonyLocation}, hasBurialType {HasBurialType}, hasFloralService {HasFloralService}, hasTransportService {HasTransportService}, hasAdminAssistance {HasAdminAssistance}, hasGriefSupport {HasGriefSupport}, requiresRepatriation {RequiresRepatriation}, hasRepatriationCountry {HasRepatriationCountry}, hasSpecialRequests {HasSpecialRequests}",
            true,
            !string.IsNullOrWhiteSpace(config.DeceasedAge),
            !string.IsNullOrWhiteSpace(config.DeceasedBirthDate),
            !string.IsNullOrWhiteSpace(config.DeceasedDeathDate),
            !string.IsNullOrWhiteSpace(config.DeathPlace),
            !string.IsNullOrWhiteSpace(config.Religion),
            true,
            true,
            !string.IsNullOrWhiteSpace(config.ContactEmail),
            !string.IsNullOrWhiteSpace(config.ContactRelationship),
            !string.IsNullOrWhiteSpace(config.CeremonyType),
            !string.IsNullOrWhiteSpace(config.CeremonyLocation),
            !string.IsNullOrWhiteSpace(config.BurialType),
            config.FloralService,
            config.TransportService,
            config.AdminAssistance,
            config.GriefSupport,
            config.RequiresRepatriation,
            !string.IsNullOrWhiteSpace(config.RepatriationCountry),
            !string.IsNullOrWhiteSpace(config.SpecialRequests));
    }

    // ==================== Process ====================

    /// <inheritdoc />
    public BookingCategoryResult Process(BookingCategoryContext context)
    {
        var config = DeserializeConfig(context.TypeConfig);
        EnsureRequiredFields(config);

        var draft = new FuneralBookingDraft(
            DeceasedName: config.DeceasedName!.Trim(),
            DeceasedAge: NullIfWhiteSpace(config.DeceasedAge),
            DeceasedBirthDate: NullIfWhiteSpace(config.DeceasedBirthDate),
            DeceasedDeathDate: NullIfWhiteSpace(config.DeceasedDeathDate),
            DeathPlace: NullIfWhiteSpace(config.DeathPlace),
            Religion: NullIfWhiteSpace(config.Religion),
            ContactName: config.ContactName!.Trim(),
            ContactPhone: config.ContactPhone!.Trim(),
            ContactEmail: NullIfWhiteSpace(config.ContactEmail),
            ContactRelationship: NullIfWhiteSpace(config.ContactRelationship),
            CeremonyType: NullIfWhiteSpace(config.CeremonyType),
            CeremonyLocation: NullIfWhiteSpace(config.CeremonyLocation),
            BurialType: NullIfWhiteSpace(config.BurialType),
            FloralService: config.FloralService,
            TransportService: config.TransportService,
            AdminAssistance: config.AdminAssistance,
            GriefSupport: config.GriefSupport,
            RequiresRepatriation: config.RequiresRepatriation,
            RepatriationCountry: NullIfWhiteSpace(config.RepatriationCountry),
            SpecialRequests: NullIfWhiteSpace(config.SpecialRequests));

        _logger.LogInformation(
            "Processed funeral booking config into a draft with hasDeceasedAge {HasDeceasedAge}, hasDeceasedBirthDate {HasDeceasedBirthDate}, hasDeceasedDeathDate {HasDeceasedDeathDate}, hasDeathPlace {HasDeathPlace}, hasReligion {HasReligion}, hasContactEmail {HasContactEmail}, hasContactRelationship {HasContactRelationship}, hasCeremonyType {HasCeremonyType}, hasCeremonyLocation {HasCeremonyLocation}, hasBurialType {HasBurialType}, hasFloralService {HasFloralService}, hasTransportService {HasTransportService}, hasAdminAssistance {HasAdminAssistance}, hasGriefSupport {HasGriefSupport}, requiresRepatriation {RequiresRepatriation}, hasRepatriationCountry {HasRepatriationCountry}, hasSpecialRequests {HasSpecialRequests}",
            draft.DeceasedAge is not null,
            draft.DeceasedBirthDate is not null,
            draft.DeceasedDeathDate is not null,
            draft.DeathPlace is not null,
            draft.Religion is not null,
            draft.ContactEmail is not null,
            draft.ContactRelationship is not null,
            draft.CeremonyType is not null,
            draft.CeremonyLocation is not null,
            draft.BurialType is not null,
            draft.FloralService,
            draft.TransportService,
            draft.AdminAssistance,
            draft.GriefSupport,
            draft.RequiresRepatriation,
            draft.RepatriationCountry is not null,
            draft.SpecialRequests is not null);

        return new BookingCategoryResult(
            ServicePrice: context.BasePrice,
            ServiceLocationOverride: null,
            StockDelta: 0,
            CategoryData: draft);
    }

    // ==================== Apply to Booking ====================

    /// <inheritdoc />
    public void ApplyToBooking(BookingCategoryResult result, Booking booking, BookingApplyContext applyContext)
    {
        var draft = (FuneralBookingDraft)result.CategoryData!;

        booking.FuneralBooking = new FuneralBooking
        {
            Id = Guid.NewGuid(),
            BookingId = booking.Id,
            DeceasedName = draft.DeceasedName,
            DeceasedAge = draft.DeceasedAge,
            DeceasedBirthDate = draft.DeceasedBirthDate,
            DeceasedDeathDate = draft.DeceasedDeathDate,
            DeathPlace = draft.DeathPlace,
            Religion = draft.Religion,
            ContactName = draft.ContactName,
            ContactPhone = draft.ContactPhone,
            ContactEmail = draft.ContactEmail,
            ContactRelationship = draft.ContactRelationship,
            CeremonyType = draft.CeremonyType,
            CeremonyLocation = draft.CeremonyLocation,
            BurialType = draft.BurialType,
            FloralService = draft.FloralService,
            TransportService = draft.TransportService,
            AdminAssistance = draft.AdminAssistance,
            GriefSupport = draft.GriefSupport,
            RequiresRepatriation = draft.RequiresRepatriation,
            RepatriationCountry = draft.RepatriationCountry,
            SpecialRequests = draft.SpecialRequests,
        };
    }

    // ==================== Apply to Response ====================

    /// <inheritdoc />
    public void ApplyToResponse(BookingCategoryResult result, CreateBookingResponse response, BookingApplyContext applyContext)
    {
        // Funeral bookings do not enrich the booking creation response with additional blocks.
        // The patient sees the standard booking confirmation.
    }

    // ==================== Cancellation ====================

    /// <inheritdoc />
    public BookingCancellationResult ProcessCancellation(BookingCancellationContext context)
    {
        // Funeral bookings have no stock inventory to restore.
        return new BookingCancellationResult(StockDelta: 0);
    }

    // ==================== Private Helpers ====================

    /// <summary>
    /// Deserializes and validates the <c>TypeConfig</c> JSON element into a
    /// <see cref="FuneralBookingConfig"/>.
    /// </summary>
    private FuneralBookingConfig DeserializeConfig(JsonElement? typeConfig)
    {
        if (typeConfig is null || typeConfig.Value.ValueKind == JsonValueKind.Null)
        {
            _logger.LogWarning(
                "Funeral booking config was missing from the create booking payload.");

            throw new InvalidOperationException(
                "Funeral bookings require a typeConfig payload with deceasedName, contactName, and contactPhone.");
        }

        var raw = typeConfig.Value.GetRawText();

        FuneralBookingConfig? config;
        try
        {
            config = JsonSerializer.Deserialize<FuneralBookingConfig>(raw, JsonOptions);
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(
                ex,
                "Funeral booking config deserialization failed.");

            throw new InvalidOperationException(
                "Invalid typeConfig format for funeral booking.",
                ex);
        }

        if (config is null)
        {
            _logger.LogWarning(
                "Funeral booking config deserialized to null.");

            throw new InvalidOperationException(
                "typeConfig deserialized to null. Provide deceasedName, contactName, and contactPhone for a funeral booking.");
        }

        return config;
    }

    private void EnsureRequiredFields(FuneralBookingConfig config)
    {
        var missingFields = GetMissingRequiredFields(config);
        if (missingFields.Count == 0)
        {
            return;
        }

        _logger.LogWarning(
            "Funeral booking processing failed because required fields were missing: {MissingFields}",
            missingFields);

        throw new InvalidOperationException(BuildMissingFieldsMessage(
            "Funeral bookings require ",
            missingFields));
    }

    private static List<string> GetMissingRequiredFields(FuneralBookingConfig config)
    {
        var missingFields = new List<string>();

        if (string.IsNullOrWhiteSpace(config.DeceasedName))
        {
            missingFields.Add("typeConfig.deceasedName");
        }

        if (string.IsNullOrWhiteSpace(config.ContactName))
        {
            missingFields.Add("typeConfig.contactName");
        }

        if (string.IsNullOrWhiteSpace(config.ContactPhone))
        {
            missingFields.Add("typeConfig.contactPhone");
        }

        return missingFields;
    }

    private static string BuildMissingFieldsMessage(string prefix, IReadOnlyList<string> missingFields)
    {
        if (missingFields.Count == 1)
        {
            return prefix + missingFields[0] + ".";
        }

        if (missingFields.Count == 2)
        {
            return prefix + missingFields[0] + " and " + missingFields[1] + ".";
        }

        return prefix + string.Join(", ", missingFields.Take(missingFields.Count - 1)) + ", and " + missingFields[^1] + ".";
    }

    private static string? NullIfWhiteSpace(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }
}
