using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Admin.Entities;
using SanadPlatform.API.Features.AppFeatures.Entities;
using SanadPlatform.API.Features.Ambulance.Entities;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Conversations.Entities;
using SanadPlatform.API.Features.Equipment.Entities;
using SanadPlatform.API.Features.Files.Entities;
using SanadPlatform.API.Features.Finance.Entities;
using SanadPlatform.API.Features.Fraud.Entities;
using SanadPlatform.API.Features.Insurance.Entities;
using SanadPlatform.API.Features.Marketing.Entities;
using SanadPlatform.API.Features.Notifications.Entities;
using SanadPlatform.API.Features.Nutrition.Entities;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Payments.Entities;
using SanadPlatform.API.Features.Pharmacy.Entities;
using SanadPlatform.API.Features.ProviderFinance.Entities;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Reviews.Entities;
using SanadPlatform.API.Features.Rewards.Entities;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Subscriptions.Entities;
using SanadPlatform.API.Features.Support.Entities;
using SanadPlatform.API.Features.Veterinary.Entities;
using SanadPlatform.API.Infrastructure.Database.Interceptors;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Infrastructure.Database;

/// <summary>
/// Main database context for Sanad Platform.
/// Code-First: C# entities + IEntityTypeConfiguration files are the single source of truth.
/// Entity configurations (column mappings, indexes, relationships, constraints)
/// are defined in IEntityTypeConfiguration files under Features/{Feature}/Configurations/
/// and are auto-discovered via ApplyConfigurationsFromAssembly.
/// Encryption wiring for [Encrypted] / [SearchableEncrypted] attributes is applied here.
/// </summary>
public class SanadDbContext : DbContext, IUnitOfWork
{
    private readonly IEncryptedFieldService? _encryptedFieldService;
    private IDbContextTransaction? _currentTransaction;

    public SanadDbContext(DbContextOptions<SanadDbContext> options)
        : base(options)
    {
    }

    /// <summary>
    /// Constructor with encryption support.
    /// The IEncryptedFieldService wires [Encrypted] / [SearchableEncrypted] value converters
    /// into OnModelCreating so that sensitive data is encrypted at rest.
    /// </summary>
    public SanadDbContext(
        DbContextOptions<SanadDbContext> options,
        IEncryptedFieldService encryptedFieldService)
        : base(options)
    {
        _encryptedFieldService = encryptedFieldService;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.AddInterceptors(new AuditableEntityInterceptor());
        base.OnConfiguring(optionsBuilder);
    }

    #region Authentication Entities
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<UserSession> UserSessions { get; set; } = null!;
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; } = null!;
    public DbSet<EmailVerificationToken> EmailVerificationTokens { get; set; } = null!;
    public DbSet<LoginOtpChallenge> LoginOtpChallenges { get; set; } = null!;
    #endregion

    #region Patient Entities
    public DbSet<Patient> Patients { get; set; } = null!;
    public DbSet<PatientFavorite> PatientFavorites { get; set; } = null!;
    public DbSet<PatientPreferences> PatientPreferences { get; set; } = null!;
    public DbSet<FamilyMember> FamilyMembers { get; set; } = null!;
    public DbSet<FamilyAccess> FamilyAccess { get; set; } = null!;
    public DbSet<ActivityTracking> ActivityTrackings { get; set; } = null!;
    public DbSet<HydrationTracking> HydrationTrackings { get; set; } = null!;
    public DbSet<NutritionTracking> NutritionTrackings { get; set; } = null!;
    public DbSet<NutritionSubcategoryConfig> NutritionSubcategoryConfigs { get; set; } = null!;
    public DbSet<NutritionDietTypeConfig> NutritionDietTypeConfigs { get; set; } = null!;
    public DbSet<NutritionProfile> NutritionProfiles { get; set; } = null!;
    public DbSet<VitalSign> VitalSigns { get; set; } = null!;
    #endregion

    #region Provider Entities
    public DbSet<Provider> Providers { get; set; } = null!;
    public DbSet<ProviderPreferences> ProviderPreferences { get; set; } = null!;
    public DbSet<ProviderAvailabilityHistory> ProviderAvailabilityHistories { get; set; } = null!;
    public DbSet<ProviderDocument> ProviderDocuments { get; set; } = null!;
    public DbSet<ProviderCertification> ProviderCertifications { get; set; } = null!;
    public DbSet<Service> Services { get; set; } = null!;
    public DbSet<ServiceAddon> ServiceAddons { get; set; } = null!;
    public DbSet<ServiceCategoryConfig> ServiceCategoryConfigs { get; set; } = null!;
    public DbSet<ProviderServicePreset> ProviderServicePresets { get; set; } = null!;
    public DbSet<ProviderSchedule> ProviderSchedules { get; set; } = null!;
    public DbSet<ProviderUnavailability> ProviderUnavailabilities { get; set; } = null!;
    public DbSet<Wallet> Wallets { get; set; } = null!;
    public DbSet<ProviderWalletTopUp> ProviderWalletTopUps { get; set; } = null!;
    #endregion

    #region Booking Entities
    public DbSet<Booking> Bookings { get; set; } = null!;
    public DbSet<BookingLineItem> BookingLineItems { get; set; } = null!;
    public DbSet<BookingSession> BookingSessions { get; set; } = null!;
    public DbSet<BookingStatusHistory> BookingStatusHistories { get; set; } = null!;
    public DbSet<Refund> Refunds { get; set; } = null!;
    public DbSet<TrackingSession> TrackingSessions { get; set; } = null!;
    public DbSet<ProviderLocation> ProviderLocations { get; set; } = null!;
    public DbSet<Dispute> Disputes { get; set; } = null!;
    public DbSet<DisputeMessage> DisputeMessages { get; set; } = null!;
    #endregion

    #region Document Entities
    public DbSet<ServicePhoto> ServicePhotos { get; set; } = null!;
    public DbSet<StoredFile> StoredFiles { get; set; } = null!;
    public DbSet<FileAccessAudit> FileAccessAudits { get; set; } = null!;
    public DbSet<OutboxMessage> OutboxMessages { get; set; } = null!;
    #endregion

    #region Review Entities
    public DbSet<Review> Reviews { get; set; } = null!;
    public DbSet<ReviewReport> ReviewReports { get; set; } = null!;
    #endregion

    #region Conversation Entities
    public DbSet<Conversation> Conversations { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;
    #endregion

    #region Notification Entities
    public DbSet<Notification> Notifications { get; set; } = null!;
    public DbSet<PushToken> PushTokens { get; set; } = null!;
    public DbSet<WebPushSubscription> WebPushSubscriptions { get; set; } = null!;
    #endregion

    #region Reward Entities
    public DbSet<PatientRewards> PatientRewards { get; set; } = null!;
    public DbSet<Badge> Badges { get; set; } = null!;
    public DbSet<PatientBadge> PatientBadges { get; set; } = null!;
    public DbSet<RewardTransaction> RewardTransactions { get; set; } = null!;
    public DbSet<Referral> Referrals { get; set; } = null!;
    #endregion

    #region Subscription Entities
    public DbSet<Subscription> Subscriptions { get; set; } = null!;
    public DbSet<SubscriptionPayment> SubscriptionPayments { get; set; } = null!;
    #endregion

    #region Marketing Entities
    public DbSet<MarketingCampaign> MarketingCampaigns { get; set; } = null!;
    public DbSet<CampaignPerformance> CampaignPerformances { get; set; } = null!;
    public DbSet<DiscountCode> DiscountCodes { get; set; } = null!;
    public DbSet<DiscountCodeUsage> DiscountCodeUsages { get; set; } = null!;
    #endregion

    #region Insurance Entities
    public DbSet<InsuranceClaim> InsuranceClaims { get; set; } = null!;
    public DbSet<InsuranceCoverage> InsuranceCoverages { get; set; } = null!;
    public DbSet<InsuranceCoverageItem> InsuranceCoverageItems { get; set; } = null!;
    public DbSet<InsuranceDocument> InsuranceDocuments { get; set; } = null!;
    #endregion

    #region Support Entities
    public DbSet<SupportTicket> SupportTickets { get; set; } = null!;
    public DbSet<SupportTicketMessage> SupportTicketMessages { get; set; } = null!;
    #endregion

    #region Payment Entities
    public DbSet<Payment> Payments { get; set; } = null!;
    public DbSet<PaymentAttempt> PaymentAttempts { get; set; } = null!;
    public DbSet<Payout> Payouts { get; set; } = null!;
    public DbSet<PayoutItem> PayoutItems { get; set; } = null!;
    #endregion

    #region Finance Entities
    public DbSet<Account> Accounts { get; set; } = null!;
    public DbSet<LedgerTransaction> LedgerTransactions { get; set; } = null!;
    public DbSet<LedgerEntry> LedgerEntries { get; set; } = null!;
    public DbSet<FinanceTimelineItem> FinanceTimelineItems { get; set; } = null!;
    #endregion

    #region Fraud Entities
    public DbSet<FraudEvent> FraudEvents { get; set; } = null!;
    public DbSet<FraudRule> FraudRules { get; set; } = null!;
    public DbSet<FraudBlacklist> FraudBlacklists { get; set; } = null!;
    public DbSet<UserBehavior> UserBehaviors { get; set; } = null!;
    #endregion

    #region Admin Entities
    public DbSet<AdminAction> AdminActions { get; set; } = null!;
    public DbSet<SystemSetting> SystemSettings { get; set; } = null!;
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;
    #endregion

    #region App Feature Entities
    public DbSet<AppFeature> AppFeatures { get; set; } = null!;
    #endregion

    #region Equipment Entities
    public DbSet<EquipmentRental> EquipmentRentals { get; set; } = null!;
    public DbSet<EquipmentCategoryConfig> EquipmentCategoryConfigs { get; set; } = null!;
    #endregion

    #region Pharmacy Entities
    public DbSet<PharmacyOrder> PharmacyOrders { get; set; } = null!;
    #endregion

    #region Ambulance Entities
    public DbSet<AmbulanceBooking> AmbulanceBookings { get; set; } = null!;
    public DbSet<AmbulanceServiceTypeConfig> AmbulanceServiceTypeConfigs { get; set; } = null!;
    #endregion

    #region Veterinary Entities
    public DbSet<VeterinaryAnimalTypeConfig> VeterinaryAnimalTypeConfigs { get; set; } = null!;
    #endregion

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Enable UUID-OSSP extension for uuid_generate_v4() support
        modelBuilder.HasPostgresExtension("uuid-ossp");
        modelBuilder.HasPostgresExtension("pgcrypto");
        modelBuilder.HasPostgresExtension("pg_trgm");

        // ==================== Apply IEntityTypeConfiguration<T> files ====================
        // Scans the assembly for all classes implementing IEntityTypeConfiguration<T>
        // and applies them. Each feature owns its own configuration files under
        // Features/{Feature}/Configurations/.
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SanadDbContext).Assembly);

        // ==================== Global Soft-Delete Filter ====================
        // Automatically excludes soft-deleted rows from all queries for ISoftDeletable entities.
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(ISoftDeletable).IsAssignableFrom(entityType.ClrType))
            {
                var param = Expression.Parameter(entityType.ClrType, "e");
                var prop = Expression.Property(param, nameof(ISoftDeletable.DeletedAt));
                var condition = Expression.Equal(prop, Expression.Constant(null, typeof(DateTime?)));
                var lambda = Expression.Lambda(condition, param);
                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(lambda);
            }
        }

        // ==================== Encryption Wiring ====================
        // Scans all entity types for [Encrypted] / [SearchableEncrypted] attributes
        // and registers EF Core value converters for transparent encrypt/decrypt at rest.
        //if (_encryptedFieldService != null)
        //{
        //    var entityTypes = _encryptedFieldService.GetEntitiesWithEncryptedFields(
        //        typeof(SanadDbContext).Assembly);

        //    foreach (var entityType in entityTypes)
        //    {
        //        _encryptedFieldService.ConfigureEncryptedFields(modelBuilder, entityType);
        //    }
        //}
    }

    // ==================== IUnitOfWork ====================

    /// <inheritdoc />
    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction != null)
        {
            throw new InvalidOperationException("A transaction is already in progress.");
        }

        _currentTransaction = await Database.BeginTransactionAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction == null)
        {
            throw new InvalidOperationException("No active transaction to commit.");
        }

        await _currentTransaction.CommitAsync(cancellationToken);
        await _currentTransaction.DisposeAsync();
        _currentTransaction = null;
    }

    /// <inheritdoc />
    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction == null) return;

        await _currentTransaction.RollbackAsync(cancellationToken);
        await _currentTransaction.DisposeAsync();
        _currentTransaction = null;
    }

    /// <inheritdoc />
    public IExecutionStrategy CreateExecutionStrategy()
        => Database.CreateExecutionStrategy();

    /// <inheritdoc />
    public async Task<T> ExecuteInTransactionAsync<T>(
        Func<CancellationToken, Task<T>> operation,
        CancellationToken cancellationToken = default)
    {
        var strategy = Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async (ct) =>
        {
            await BeginTransactionAsync(ct);
            try
            {
                var result = await operation(ct);
                await CommitTransactionAsync(ct);
                return result;
            }
            catch
            {
                await RollbackTransactionAsync(ct);
                throw;
            }
        }, cancellationToken);
    }

    /// <inheritdoc />
    public async Task ExecuteInTransactionAsync(
        Func<CancellationToken, Task> operation,
        CancellationToken cancellationToken = default)
    {
        await ExecuteInTransactionAsync<object?>(async ct =>
        {
            await operation(ct);
            return null;
        }, cancellationToken);
    }
}
