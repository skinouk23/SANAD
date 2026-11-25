using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Insurance.Entities;

namespace SanadPlatform.API.Features.Insurance.Configurations;

public class InsuranceClaimConfiguration : IEntityTypeConfiguration<InsuranceClaim>
{
    public void Configure(EntityTypeBuilder<InsuranceClaim> builder)
    {
        builder.ToTable("insurance_claims");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ClaimNumber)
            .HasColumnName("claim_number")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id");

        builder.Property(e => e.PatientName)
            .HasColumnName("patient_name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.PatientInsuranceProvider)
            .HasColumnName("patient_insurance_provider")
            .HasMaxLength(200);

        builder.Property(e => e.PatientInsuranceNumber)
            .HasColumnName("patient_insurance_number")
            .HasMaxLength(100);

        builder.Property(e => e.ServiceDate)
            .HasColumnName("service_date")
            .IsRequired();

        builder.Property(e => e.ServiceDescription)
            .HasColumnName("service_description")
            .IsRequired();

        builder.Property(e => e.DiagnosisCodes)
            .HasColumnName("diagnosis_codes")
            .HasColumnType("text[]");

        builder.Property(e => e.ProcedureCodes)
            .HasColumnName("procedure_codes")
            .HasColumnType("text[]");

        builder.Property(e => e.ClaimedAmount)
            .HasColumnName("claimed_amount")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.ApprovedAmount)
            .HasColumnName("approved_amount")
            .HasPrecision(10, 2);

        builder.Property(e => e.PaidAmount)
            .HasColumnName("paid_amount")
            .HasPrecision(10, 2);

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .HasDefaultValue("draft");

        builder.Property(e => e.SubmittedAt)
            .HasColumnName("submitted_at");

        builder.Property(e => e.ReviewedAt)
            .HasColumnName("reviewed_at");

        builder.Property(e => e.ApprovedAt)
            .HasColumnName("approved_at");

        builder.Property(e => e.PaidAt)
            .HasColumnName("paid_at");

        builder.Property(e => e.RejectionReason)
            .HasColumnName("rejection_reason");

        builder.Property(e => e.ReviewerNotes)
            .HasColumnName("reviewer_notes");

        builder.Property(e => e.InvoiceUrl)
            .HasColumnName("invoice_url");

        builder.Property(e => e.MedicalReportUrl)
            .HasColumnName("medical_report_url");

        builder.Property(e => e.SupportingDocuments)
            .HasColumnName("supporting_documents")
            .HasColumnType("text[]");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Provider)
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(e => e.ClaimNumber)
            .IsUnique();
    }
}
