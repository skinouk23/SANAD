using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.ProviderFinance.Entities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.ProviderFinance.Configurations;

/// <summary>
/// EF Core mapping for <see cref="Wallet"/>.
/// </summary>
public class WalletConfiguration : IEntityTypeConfiguration<Wallet>
{
    public void Configure(EntityTypeBuilder<Wallet> builder)
    {
        builder.ToTable(
            "wallets",
            table => table.HasCheckConstraint(
                "ck_wallets_non_negative",
                "available_balance >= 0 AND reserved_balance >= 0 AND usable_balance >= 0 AND usable_balance = available_balance"));

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.AvailableBalance)
            .HasColumnName("available_balance")
            .HasPrecision(10, 2)
            .HasDefaultValue(0.00m)
            .IsRequired();

        builder.Property(e => e.ReservedBalance)
            .HasColumnName("reserved_balance")
            .HasPrecision(10, 2)
            .HasDefaultValue(0.00m)
            .IsRequired();

        builder.Property(e => e.UsableBalance)
            .HasColumnName("usable_balance")
            .HasPrecision(10, 2)
            .HasDefaultValue(0.00m)
            .IsRequired();

        builder.Property(e => e.Currency)
            .HasColumnName("currency")
            .HasMaxLength(3)
            .IsFixedLength()
            .HasDefaultValue(ProviderFinanceConstants.DefaultCurrency)
            .IsRequired();

        builder.Property(e => e.LastRebuiltAt)
            .HasColumnName("last_rebuilt_at");

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

        builder.HasOne(e => e.Provider)
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.ProviderId)
            .IsUnique()
            .HasDatabaseName("ux_wallets_provider");
    }
}
