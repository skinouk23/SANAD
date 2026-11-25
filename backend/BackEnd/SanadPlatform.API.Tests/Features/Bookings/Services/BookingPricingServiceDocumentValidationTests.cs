using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Bookings.Services.Policies;
using SanadPlatform.API.Features.Documents.Entities;
using SanadPlatform.API.Features.Documents.Repository;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Services;
using SanadPlatform.API.Features.Reviews.Entities;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Services.Services;

namespace SanadPlatform.API.Tests.Features.Bookings.Services;

public class BookingPricingServiceDocumentValidationTests
{
    [Fact]
    public async Task CalculateAsync_ThrowsKeyNotFound_WhenPrescriptionDocumentDoesNotExist()
    {
        var providerId = Guid.NewGuid();
        var serviceId = Guid.NewGuid();
        var prescriptionDocumentId = Guid.NewGuid();
        var availabilityService = new StubProviderRangeAvailabilityService(CreateAvailabilityResult(providerId));
        var documentRepository = new StubDocumentRepository(document: null);
        var logger = new ListLogger<BookingPricingService>();
        var sut = CreateSut(providerId, serviceId, availabilityService, documentRepository, logger);

        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            sut.CalculateAsync(
                CreateInput(providerId, serviceId, prescriptionDocumentId),
                tracked: false,
                cancellationToken: CancellationToken.None));

        Assert.Equal($"Prescription document {prescriptionDocumentId} was not found.", exception.Message);
        Assert.Equal(0, availabilityService.CallCount);
        Assert.Equal(prescriptionDocumentId, documentRepository.LastRequestedId);
        Assert.Contains(logger.Entries, entry =>
            entry.Level == LogLevel.Warning
            && entry.Message.Contains("Prescription document validation failed", StringComparison.Ordinal)
            && entry.Message.Contains("was not found", StringComparison.Ordinal)
            && entry.Message.Contains(prescriptionDocumentId.ToString(), StringComparison.Ordinal));
    }

    [Fact]
    public async Task CalculateAsync_ThrowsInvalidOperation_WhenPrescriptionDocumentIsNotConfirmed()
    {
        var providerId = Guid.NewGuid();
        var serviceId = Guid.NewGuid();
        var prescriptionDocumentId = Guid.NewGuid();
        var availabilityService = new StubProviderRangeAvailabilityService(CreateAvailabilityResult(providerId));
        var documentRepository = new StubDocumentRepository(CreateDocument(prescriptionDocumentId, uploadConfirmedAt: null));
        var logger = new ListLogger<BookingPricingService>();
        var sut = CreateSut(providerId, serviceId, availabilityService, documentRepository, logger);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            sut.CalculateAsync(
                CreateInput(providerId, serviceId, prescriptionDocumentId),
                tracked: false,
                cancellationToken: CancellationToken.None));

        Assert.Equal(
            $"Prescription document {prescriptionDocumentId} must be upload-confirmed before booking.",
            exception.Message);
        Assert.Equal(0, availabilityService.CallCount);
        Assert.Contains(logger.Entries, entry =>
            entry.Level == LogLevel.Warning
            && entry.Message.Contains("not upload-confirmed", StringComparison.Ordinal)
            && entry.Message.Contains(prescriptionDocumentId.ToString(), StringComparison.Ordinal));
    }

    [Fact]
    public async Task CalculateAsync_WhenPrescriptionDocumentIsConfirmed_LogsValidationSuccess()
    {
        var providerId = Guid.NewGuid();
        var serviceId = Guid.NewGuid();
        var prescriptionDocumentId = Guid.NewGuid();
        var confirmedAt = new DateTime(2026, 4, 13, 8, 30, 0, DateTimeKind.Utc);
        var availabilityService = new StubProviderRangeAvailabilityService(CreateAvailabilityResult(providerId));
        var documentRepository = new StubDocumentRepository(CreateDocument(prescriptionDocumentId, confirmedAt));
        var logger = new ListLogger<BookingPricingService>();
        var sut = CreateSut(providerId, serviceId, availabilityService, documentRepository, logger);

        var result = await sut.CalculateAsync(
            CreateInput(providerId, serviceId, prescriptionDocumentId),
            tracked: false,
            cancellationToken: CancellationToken.None);

        Assert.Equal(providerId, result.Provider.Id);
        Assert.Equal(serviceId, result.PrimaryService.Id);
        Assert.Equal(1, availabilityService.CallCount);
        Assert.Equal(prescriptionDocumentId, documentRepository.LastRequestedId);
        Assert.Contains(logger.Entries, entry =>
            entry.Level == LogLevel.Information
            && entry.Message.Contains("Prescription document validation succeeded", StringComparison.Ordinal)
            && entry.Message.Contains(prescriptionDocumentId.ToString(), StringComparison.Ordinal));
    }

    private static BookingPricingService CreateSut(
        Guid providerId,
        Guid serviceId,
        StubProviderRangeAvailabilityService availabilityService,
        StubDocumentRepository documentRepository,
        ListLogger<BookingPricingService> logger)
    {
        var provider = new Provider
        {
            Id = providerId,
            IsApproved = true,
            IsAvailable = true,
            CommissionRate = 10m,
            Timezone = "Africa/Tunis"
        };

        var service = new Service
        {
            Id = serviceId,
            ProviderId = providerId,
            Category = "nursing",
            Name = "Nursing Visit",
            Price = 80m,
            Currency = "TND",
            DurationMinutes = 60,
            ServiceLocation = "provider_site",
            RequiresPrescription = true,
            IsActive = true,
        };

        return new BookingPricingService(
            new StubProviderRepository(provider),
            new StubServiceResolutionService([new ResolvedServiceItem(service, 1)]),
            availabilityService,
            new BookingCategoryPolicyRegistry(Array.Empty<IBookingCategoryPolicy>(), new DefaultBookingCategoryPolicy()),
            documentRepository,
            logger);
    }

    private static BookingPricingInput CreateInput(Guid providerId, Guid serviceId, Guid prescriptionDocumentId)
    {
        var bookingDate = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);

        return new BookingPricingInput(
            ProviderId: providerId,
            ServiceItems: [new ServiceItemSelection(serviceId, 1)],
            StartDate: bookingDate,
            EndDate: bookingDate,
            DailyStartTime: new TimeOnly(9, 0),
            AddressLine1: null,
            TypeConfig: null,
            PatientLocationChoice: null,
            PrescriptionDocumentId: prescriptionDocumentId);
    }

    private static ProviderRangeAvailabilityResult CreateAvailabilityResult(Guid providerId)
    {
        var bookingDate = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);

        return new ProviderRangeAvailabilityResult(
            ProviderId: providerId,
            StartDate: bookingDate,
            EndDate: bookingDate,
            DayCount: 1,
            DailyDurationMinutes: 60,
            AvailableStartTimes: [new TimeOnly(9, 0)],
            Timezone: "Africa/Tunis");
    }

    private static Document CreateDocument(Guid id, DateTime? uploadConfirmedAt)
    {
        return new Document
        {
            Id = id,
            StorageBucket = "documents",
            StoragePath = $"prescriptions/{id}.pdf",
            OriginalFileName = "prescription.pdf",
            MimeType = "application/pdf",
            FileSizeBytes = 1024,
            UploadConfirmedAt = uploadConfirmedAt,
        };
    }

    private sealed class StubServiceResolutionService : IServiceResolutionService
    {
        private readonly IReadOnlyList<ResolvedServiceItem> _resolvedItems;

        public StubServiceResolutionService(IReadOnlyList<ResolvedServiceItem> resolvedItems)
        {
            _resolvedItems = resolvedItems;
        }

        public Task<IReadOnlyList<ResolvedServiceItem>> ResolveAsync(
            Guid providerId,
            IReadOnlyList<ServiceItemRequest> requestedItems,
            CancellationToken cancellationToken = default)
        {
            return Task.FromResult(_resolvedItems);
        }

        public Task<IReadOnlyList<ResolvedServiceItem>> ResolveForUpdateAsync(
            Guid providerId,
            IReadOnlyList<ServiceItemRequest> requestedItems,
            CancellationToken cancellationToken = default)
        {
            return Task.FromResult(_resolvedItems);
        }
    }

    private sealed class StubProviderRangeAvailabilityService : IProviderRangeAvailabilityService
    {
        private readonly ProviderRangeAvailabilityResult _result;

        public StubProviderRangeAvailabilityService(ProviderRangeAvailabilityResult result)
        {
            _result = result;
        }

        public int CallCount { get; private set; }

        public Task<ProviderRangeAvailabilityResult> GetRangeAvailabilityAsync(
            Guid providerId,
            DateOnly startDate,
            DateOnly endDate,
            IReadOnlyList<ProviderRequestedServiceItem> requestedServices,
            CancellationToken cancellationToken = default)
        {
            CallCount++;
            return Task.FromResult(_result);
        }

        public Task<ProviderMonthAvailabilityResult> GetMonthAvailabilityAsync(
            Guid providerId,
            int year,
            int month,
            IReadOnlyList<ProviderRequestedServiceItem> requestedServices,
            CancellationToken cancellationToken = default)
        {
            throw new NotSupportedException();
        }
    }

    private sealed class StubDocumentRepository : IDocumentRepository
    {
        private readonly Document? _document;

        public StubDocumentRepository(Document? document)
        {
            _document = document;
        }

        public Guid? LastRequestedId { get; private set; }

        public Task CreateAsync(Document entity, CancellationToken ct = default) => throw new NotSupportedException();

        public Task<Document?> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            LastRequestedId = id;
            return Task.FromResult(_document?.Id == id ? _document : null);
        }

        public Task<Document?> GetByIdForUpdateAsync(Guid id, CancellationToken ct = default) => throw new NotSupportedException();

        public Task<(IReadOnlyList<Document> Items, int Total)> GetPagedAsync(
            ISpecification<Document> spec,
            CancellationToken ct = default) => throw new NotSupportedException();

        public Task<(IReadOnlyList<TDto> Items, int Total)> GetPagedProjectedAsync<TDto>(
            ISpecification<Document> spec,
            CancellationToken ct = default) => throw new NotSupportedException();

        public Task<Document?> GetByIdIncludingDeletedAsync(Guid id, CancellationToken ct = default) => throw new NotSupportedException();

        public Task<Document?> GetByIdForUpdateIncludingDeletedAsync(Guid id, CancellationToken ct = default) => throw new NotSupportedException();

        public Task SoftDeleteAsync(Document entity, CancellationToken ct = default) => throw new NotSupportedException();

        public Task CreateAuditLogAsync(DocumentAuditLog entry, CancellationToken ct = default) => throw new NotSupportedException();

        public Task<IReadOnlyList<Document>> GetAllByOwnerForGdprAsync(Guid ownerId, CancellationToken ct = default) => throw new NotSupportedException();
    }

    private sealed class StubProviderRepository : IProviderRepository
    {
        private readonly Provider _provider;

        public StubProviderRepository(Provider provider)
        {
            _provider = provider;
        }

        public Task<Provider?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
            => Task.FromResult(_provider.Id == id ? _provider : null);

        public Task<Provider?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<ProviderDetailResponse?> GetPublicDetailByIdAsync(Guid id, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<Provider>> GetAllAsync(CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<Provider>> GetActiveAsync(CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<Provider>> GetByCountryAsync(string country, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<int> GetTotalCountAsync(CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<Guid?> GetProviderIdByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<(Guid ProviderId, string ServiceCategory)?> GetProviderIdAndCategoryByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<Provider?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<Provider?> GetByUserIdForUpdateAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<Provider?> GetByUserIdWithAvailabilityForUpdateAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<ProviderPreferencesResponse?> GetPreferencesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<ProviderPreferences?> GetPreferencesByUserIdForUpdateAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<(IReadOnlyList<ProviderReviewDto> Items, int Total)> GetReviewsAsync(ISpecification<Review> spec, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<Dictionary<int, int>> GetRatingDistributionAsync(Guid providerId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<(decimal Average, int Count)> ComputeRatingStatsAsync(Guid providerId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<(decimal Average, int Count)> ComputeRatingStatsForPeriodAsync(Guid providerId, DateTime createdAtUtcFromInclusive, DateTime createdAtUtcToExclusive, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<(IReadOnlyList<ProviderAvailabilityHistory> Items, int Total)> GetAvailabilityHistoryAsync(ISpecification<ProviderAvailabilityHistory> spec, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<ProviderSchedule>> GetSchedulesByDayAsync(Guid providerId, DayOfWeek dayOfWeek, Guid? serviceId = null, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<ProviderSchedule>> GetSchedulesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<ProviderUnavailability>> GetUnavailabilitiesAsync(Guid providerId, DateOnly windowStart, DateOnly windowEnd, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<ProviderUnavailability>> GetUnavailabilitiesAsync(Guid providerId, DateTime utcWindowStartInclusive, DateTime utcWindowEndExclusive, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<ProviderUnavailability>> GetUnavailabilitiesByUserIdAsync(Guid userId, DateTime utcWindowStartInclusive, DateTime utcWindowEndExclusive, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<BookingTimeSlotDto>> GetActiveBookingTimeSlotsAsync(Guid providerId, DateOnly date, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<ProviderSchedule>> GetSchedulesByDaysAsync(Guid providerId, IReadOnlyCollection<DayOfWeek> daysOfWeek, IReadOnlyCollection<Guid>? serviceIds = null, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<BookingTimeSlotWithDateDto>> GetActiveBookingTimeSlotsForRangeAsync(Guid providerId, DateOnly startDate, DateOnly endDate, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<int?> GetMaxBookingAdvanceDaysAsync(Guid providerId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<string?> GetProviderTimezoneAsync(Guid providerId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<Service>> GetActiveServicesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<(IReadOnlyList<ProviderResponse> Items, int Total)> GetProvidersAsync(ISpecification<Provider> spec, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task EnrichWithServiceStatsAsync(IReadOnlyList<ProviderResponse> providers, string serviceCategory, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<Provider> CreateAsync(Provider provider, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<Provider> UpdateAsync(Provider provider, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<ProviderPreferences> CreatePreferencesAsync(ProviderPreferences preferences, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<ProviderPreferences> UpdatePreferencesAsync(ProviderPreferences preferences, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task CreateSchedulesAsync(IEnumerable<ProviderSchedule> schedules, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public void RemoveSchedules(IEnumerable<ProviderSchedule> schedules) => throw new NotSupportedException();
        public Task<ProviderUnavailability> CreateUnavailabilityAsync(ProviderUnavailability unavailability, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<ProviderUnavailability> UpdateUnavailabilityAsync(ProviderUnavailability unavailability, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<ProviderUnavailability?> GetUnavailabilityByIdForUpdateAsync(Guid providerId, Guid unavailabilityId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public void RemoveUnavailability(ProviderUnavailability unavailability) => throw new NotSupportedException();
        public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    }

    private sealed class ListLogger<T> : ILogger<T>
    {
        public List<LogEntry> Entries { get; } = [];

        public IDisposable BeginScope<TState>(TState state)
            where TState : notnull
            => NullScope.Instance;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            Entries.Add(new LogEntry(logLevel, formatter(state, exception)));
        }
    }

    private sealed record LogEntry(LogLevel Level, string Message);

    private sealed class NullScope : IDisposable
    {
        public static NullScope Instance { get; } = new();

        public void Dispose()
        {
        }
    }
}
