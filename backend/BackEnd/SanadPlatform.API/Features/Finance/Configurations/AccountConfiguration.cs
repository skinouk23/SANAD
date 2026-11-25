using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Finance.Entities;

namespace SanadPlatform.API.Features.Finance.Configurations;

/// <summary>
/// EF Core mapping for <see cref="Account"/>.
/// </summary>
public class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    private static readonly DateTime SeedTimestampUtc = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.ToTable("accounts");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.Code)
            .HasColumnName("code")
            .HasMaxLength(80)
            .IsRequired();

        builder.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(120)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(500);

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true)
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property<uint>("xmin")
            .IsRowVersion()
            .HasColumnName("xmin")
            .HasColumnType("xid");

        builder.HasAlternateKey(e => e.Code)
            .HasName("ak_accounts_code");

        builder.HasIndex(e => e.Code)
            .IsUnique()
            .HasDatabaseName("ux_accounts_code");

        builder.HasData(
            new Account
            {
                Id = LedgerConstants.SeedIds.ProviderWalletAvailable,
                Code = LedgerConstants.AccountCodes.ProviderWalletAvailable,
                Name = "Provider Wallet Available",
                Description = "Provider wallet available balance projection account.",
                IsActive = true,
                CreatedAt = SeedTimestampUtc,
                UpdatedAt = SeedTimestampUtc
            },
            new Account
            {
                Id = LedgerConstants.SeedIds.ProviderWalletReserved,
                Code = LedgerConstants.AccountCodes.ProviderWalletReserved,
                Name = "Provider Wallet Reserved",
                Description = "Provider wallet reserved balance projection account.",
                IsActive = true,
                CreatedAt = SeedTimestampUtc,
                UpdatedAt = SeedTimestampUtc
            },
            new Account
            {
                Id = LedgerConstants.SeedIds.PlatformRevenue,
                Code = LedgerConstants.AccountCodes.PlatformRevenue,
                Name = "Platform Revenue",
                Description = "Platform fee revenue account.",
                IsActive = true,
                CreatedAt = SeedTimestampUtc,
                UpdatedAt = SeedTimestampUtc
            },
            new Account
            {
                Id = LedgerConstants.SeedIds.AdjustmentSuspense,
                Code = LedgerConstants.AccountCodes.AdjustmentSuspense,
                Name = "Adjustment Suspense",
                Description = "Counter-account for manual and compensating adjustments.",
                IsActive = true,
                CreatedAt = SeedTimestampUtc,
                UpdatedAt = SeedTimestampUtc
            });
    }
}
