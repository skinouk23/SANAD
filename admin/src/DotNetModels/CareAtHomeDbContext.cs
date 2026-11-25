using Microsoft.EntityFrameworkCore;
using System;

namespace CareAtHome.Models
{
    /// <summary>
    /// Entity Framework DbContext for Care@Home Tunisia
    /// </summary>
    public class CareAtHomeDbContext : DbContext
    {
        public CareAtHomeDbContext(DbContextOptions<CareAtHomeDbContext> options)
            : base(options)
        {
        }

        // Core entities
        public DbSet<User> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Review> Reviews { get; set; }

        // Patient related
        public DbSet<PatientPreferences> PatientPreferences { get; set; }
        public DbSet<PatientFavorite> PatientFavorites { get; set; }

        // Provider related
        public DbSet<ProviderCertification> ProviderCertifications { get; set; }
        public DbSet<ProviderDocument> ProviderDocuments { get; set; }
        public DbSet<ProviderSchedule> ProviderSchedules { get; set; }
        public DbSet<ProviderUnavailability> ProviderUnavailabilities { get; set; }
        public DbSet<ProviderAvailabilityStatus> ProviderAvailabilityStatuses { get; set; }

        // Service related
        public DbSet<ServiceFacility> ServiceFacilities { get; set; }
        public DbSet<ServiceEquipment> ServiceEquipment { get; set; }

        // Booking related
        public DbSet<BookingStatusHistory> BookingStatusHistories { get; set; }

        // Communication
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        // Marketing
        public DbSet<MarketingCampaign> MarketingCampaigns { get; set; }
        public DbSet<CampaignInterest> CampaignInterests { get; set; }
        public DbSet<CampaignPerformance> CampaignPerformances { get; set; }

        // Subscriptions
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<SubscriptionPayment> SubscriptionPayments { get; set; }

        // Insurance & Payouts
        public DbSet<InsuranceClaim> InsuranceClaims { get; set; }
        public DbSet<Payout> Payouts { get; set; }

        // Health tracking
        public DbSet<ActivityTracking> ActivityTrackings { get; set; }
        public DbSet<HydrationTracking> HydrationTrackings { get; set; }
        public DbSet<NutritionTracking> NutritionTrackings { get; set; }
        public DbSet<NutritionProfile> NutritionProfiles { get; set; }

        // Family & Rewards
        public DbSet<FamilyMember> FamilyMembers { get; set; }
        public DbSet<PatientReward> PatientRewards { get; set; }
        public DbSet<Badge> Badges { get; set; }
        public DbSet<PatientBadge> PatientBadges { get; set; }
        public DbSet<RewardTransaction> RewardTransactions { get; set; }

        // Fraud & Admin
        public DbSet<FraudAlert> FraudAlerts { get; set; }
        public DbSet<UserBehavior> UserBehaviors { get; set; }
        public DbSet<AdminAction> AdminActions { get; set; }
        public DbSet<SystemSetting> SystemSettings { get; set; }

        // NEW: Admin and system management
        public DbSet<AdminSetting> AdminSettings { get; set; }
        public DbSet<CountryInstance> CountryInstances { get; set; }
        public DbSet<SystemHealthLog> SystemHealthLogs { get; set; }
        public DbSet<AdminActivityLog> AdminActivityLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships and constraints

            // User relationships
            modelBuilder.Entity<User>()
                .HasOne(u => u.Patient)
                .WithOne(p => p.User)
                .HasForeignKey<Patient>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Provider)
                .WithOne(p => p.User)
                .HasForeignKey<Provider>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Patient preferences relationship
            modelBuilder.Entity<Patient>()
                .HasOne(p => p.Preferences)
                .WithOne(pp => pp.Patient)
                .HasForeignKey<PatientPreferences>(pp => pp.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            // Patient favorites relationship
            modelBuilder.Entity<PatientFavorite>()
                .HasOne(pf => pf.Patient)
                .WithMany(p => p.Favorites)
                .HasForeignKey(pf => pf.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PatientFavorite>()
                .HasOne(pf => pf.Provider)
                .WithMany(p => p.FavoritedBy)
                .HasForeignKey(pf => pf.ProviderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Message relationships (self-referencing)
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Receiver)
                .WithMany(u => u.ReceivedMessages)
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            // Unique constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<PatientPreferences>()
                .HasIndex(pp => pp.PatientId)
                .IsUnique();

            modelBuilder.Entity<PatientFavorite>()
                .HasIndex(pf => new { pf.PatientId, pf.ProviderId })
                .IsUnique();

            modelBuilder.Entity<InsuranceClaim>()
                .HasIndex(ic => ic.ClaimNumber)
                .IsUnique();

            modelBuilder.Entity<PatientBadge>()
                .HasIndex(pb => new { pb.PatientId, pb.BadgeId })
                .IsUnique();

            modelBuilder.Entity<ActivityTracking>()
                .HasIndex(at => new { at.PatientId, at.Date })
                .IsUnique();

            modelBuilder.Entity<HydrationTracking>()
                .HasIndex(ht => new { ht.PatientId, ht.Date })
                .IsUnique();

            modelBuilder.Entity<ProviderSchedule>()
                .HasIndex(ps => new { ps.ProviderId, ps.DayOfWeek, ps.StartTime })
                .IsUnique();

            modelBuilder.Entity<CampaignPerformance>()
                .HasIndex(cp => new { cp.CampaignId, cp.Date })
                .IsUnique();

            modelBuilder.Entity<SystemSetting>()
                .HasIndex(ss => ss.SettingKey)
                .IsUnique();

            modelBuilder.Entity<AdminSetting>()
                .HasIndex(a => a.SettingKey)
                .IsUnique();

            modelBuilder.Entity<CountryInstance>()
                .HasIndex(ci => ci.CountryCode)
                .IsUnique();

            // Enum to string conversions
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Patient>()
                .Property(p => p.Gender)
                .HasConversion<string>();

            modelBuilder.Entity<Provider>()
                .Property(p => p.ServiceType)
                .HasConversion<string>();

            modelBuilder.Entity<Provider>()
                .Property(p => p.SubscriptionTier)
                .HasConversion<string>();

            modelBuilder.Entity<Service>()
                .Property(s => s.Location)
                .HasConversion<string>();

            modelBuilder.Entity<Service>()
                .Property(s => s.EquipmentCondition)
                .HasConversion<string>();

            modelBuilder.Entity<Booking>()
                .Property(b => b.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Transaction>()
                .Property(t => t.PaymentMethod)
                .HasConversion<string>();

            modelBuilder.Entity<Transaction>()
                .Property(t => t.PaymentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<ProviderDocument>()
                .Property(pd => pd.DocumentType)
                .HasConversion<string>();

            modelBuilder.Entity<MarketingCampaign>()
                .Property(mc => mc.CampaignType)
                .HasConversion<string>();

            modelBuilder.Entity<MarketingCampaign>()
                .Property(mc => mc.Objective)
                .HasConversion<string>();

            modelBuilder.Entity<MarketingCampaign>()
                .Property(mc => mc.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Subscription>()
                .Property(s => s.Tier)
                .HasConversion<string>();

            modelBuilder.Entity<Subscription>()
                .Property(s => s.Status)
                .HasConversion<string>();

            modelBuilder.Entity<SubscriptionPayment>()
                .Property(sp => sp.PaymentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<InsuranceClaim>()
                .Property(ic => ic.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Payout>()
                .Property(p => p.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Payout>()
                .Property(p => p.PayoutMethod)
                .HasConversion<string>();

            modelBuilder.Entity<NutritionTracking>()
                .Property(nt => nt.MealType)
                .HasConversion<string>();

            modelBuilder.Entity<NutritionProfile>()
                .Property(np => np.ActivityLevel)
                .HasConversion<string>();

            modelBuilder.Entity<NutritionProfile>()
                .Property(np => np.Goal)
                .HasConversion<string>();

            modelBuilder.Entity<RewardTransaction>()
                .Property(rt => rt.TransactionType)
                .HasConversion<string>();

            modelBuilder.Entity<FraudAlert>()
                .Property(fa => fa.AlertType)
                .HasConversion<string>();

            modelBuilder.Entity<FraudAlert>()
                .Property(fa => fa.Severity)
                .HasConversion<string>();

            modelBuilder.Entity<FraudAlert>()
                .Property(fa => fa.Status)
                .HasConversion<string>();

            modelBuilder.Entity<AdminSetting>()
                .Property(a => a.SettingType)
                .HasConversion<string>();

            modelBuilder.Entity<SystemHealthLog>()
                .Property(s => s.Status)
                .HasConversion<string>();

            // Configure decimal precision
            modelBuilder.Entity<Provider>()
                .Property(p => p.Rating)
                .HasPrecision(3, 2);

            modelBuilder.Entity<Provider>()
                .Property(p => p.CompletionRate)
                .HasPrecision(5, 2);

            modelBuilder.Entity<Provider>()
                .Property(p => p.ResponseRate)
                .HasPrecision(5, 2);

            modelBuilder.Entity<Transaction>()
                .Property(t => t.FraudScore)
                .HasPrecision(5, 2);

            modelBuilder.Entity<CountryInstance>()
                .Property(ci => ci.CommissionRate)
                .HasPrecision(5, 2);

            modelBuilder.Entity<CountryInstance>()
                .Property(ci => ci.MinTransferAmount)
                .HasPrecision(10, 2);

            // Seed initial data (optional)
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed country instances
            modelBuilder.Entity<CountryInstance>().HasData(
                new CountryInstance
                {
                    Id = Guid.NewGuid(),
                    CountryCode = "TN",
                    CountryName = "Tunisia",
                    CurrencyCode = "TND",
                    IsActive = true,
                    CommissionRate = 15.00m,
                    SupportEmail = "support@carehome.tn"
                },
                new CountryInstance
                {
                    Id = Guid.NewGuid(),
                    CountryCode = "MA",
                    CountryName = "Morocco",
                    CurrencyCode = "MAD",
                    IsActive = true,
                    CommissionRate = 15.00m,
                    SupportEmail = "support@carehome.ma"
                },
                new CountryInstance
                {
                    Id = Guid.NewGuid(),
                    CountryCode = "DZ",
                    CountryName = "Algeria",
                    CurrencyCode = "DZD",
                    IsActive = true,
                    CommissionRate = 15.00m,
                    SupportEmail = "support@carehome.dz"
                }
            );

            // Seed admin settings
            modelBuilder.Entity<AdminSetting>().HasData(
                new AdminSetting
                {
                    Id = Guid.NewGuid(),
                    SettingCategory = "financial",
                    SettingKey = "platform_commission_rate",
                    SettingValue = "15",
                    SettingType = SettingType.Number,
                    Description = "Platform commission percentage"
                },
                new AdminSetting
                {
                    Id = Guid.NewGuid(),
                    SettingCategory = "validation",
                    SettingKey = "auto_validation_hours",
                    SettingValue = "48",
                    SettingType = SettingType.Number,
                    Description = "Hours before automatic validation"
                },
                new AdminSetting
                {
                    Id = Guid.NewGuid(),
                    SettingCategory = "validation",
                    SettingKey = "fraud_detection_enabled",
                    SettingValue = "true",
                    SettingType = SettingType.Boolean,
                    Description = "Enable fraud detection system"
                }
            );
        }
    }
}