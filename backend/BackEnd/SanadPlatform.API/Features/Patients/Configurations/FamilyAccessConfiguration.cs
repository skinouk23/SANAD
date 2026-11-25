using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Patients.Entities;

namespace SanadPlatform.API.Features.Patients.Configurations;

public class FamilyAccessConfiguration : IEntityTypeConfiguration<FamilyAccess>
{
    public void Configure(EntityTypeBuilder<FamilyAccess> builder)
    {
        builder.ToTable("family_access");

        // Primary Key
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        // Properties
        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        builder.Property(e => e.GrantedToUserId)
            .HasColumnName("granted_to_user_id")
            .IsRequired();

        builder.Property(e => e.CanBook)
            .HasColumnName("can_book")
            .HasDefaultValue(true);

        builder.Property(e => e.CanViewHistory)
            .HasColumnName("can_view_history")
            .HasDefaultValue(true);

        builder.Property(e => e.CanViewMedical)
            .HasColumnName("can_view_medical")
            .HasDefaultValue(false);

        builder.Property(e => e.CanManagePayments)
            .HasColumnName("can_manage_payments")
            .HasDefaultValue(false);

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Patient)
            .WithMany(e => e.FamilyAccess)
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.GrantedToUser)
            .WithMany()
            .HasForeignKey(e => e.GrantedToUserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(e => new { e.PatientId, e.GrantedToUserId })
            .IsUnique();
    }
}
