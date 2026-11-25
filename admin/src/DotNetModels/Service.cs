using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Service entity offered by providers
    /// </summary>
    [Table("services")]
    public class Service
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("provider_id")]
        public Guid ProviderId { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [MaxLength(100)]
        [Column("category")]
        public string Category { get; set; }

        [Required]
        [Column("price", TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Column("duration")]
        public int? Duration { get; set; }

        [MaxLength(50)]
        [Column("location")]
        public ServiceLocation? Location { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        // Equipment rental specific fields
        [Column("equipment_image_url")]
        public string EquipmentImageUrl { get; set; }

        [MaxLength(50)]
        [Column("equipment_condition")]
        public EquipmentCondition? EquipmentCondition { get; set; }

        [Column("deposit_amount", TypeName = "decimal(10,2)")]
        public decimal? DepositAmount { get; set; }

        [Column("maintenance_schedule")]
        public string MaintenanceSchedule { get; set; }

        // Radiology specific fields
        [MaxLength(100)]
        [Column("exam_type")]
        public string ExamType { get; set; }

        [MaxLength(200)]
        [Column("equipment_used")]
        public string EquipmentUsed { get; set; }

        [Column("preparation_instructions")]
        public string PreparationInstructions { get; set; }

        [MaxLength(50)]
        [Column("report_delivery_time")]
        public string ReportDeliveryTime { get; set; }

        // Laboratory specific fields
        [MaxLength(100)]
        [Column("test_type")]
        public string TestType { get; set; }

        [Column("fasting_required")]
        public bool? FastingRequired { get; set; }

        [MaxLength(50)]
        [Column("sample_collection")]
        public string SampleCollection { get; set; }

        [MaxLength(50)]
        [Column("result_delivery_time")]
        public string ResultDeliveryTime { get; set; }

        // Gym specific fields
        [MaxLength(50)]
        [Column("membership_type")]
        public string MembershipType { get; set; }

        [Column("trainer_available")]
        public bool? TrainerAvailable { get; set; }

        // Care specific fields
        [MaxLength(200)]
        [Column("specialization")]
        public string Specialization { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ProviderId")]
        public Provider Provider { get; set; }

        public ICollection<Booking> Bookings { get; set; }
        public ICollection<ServiceFacility> Facilities { get; set; }
        public ICollection<ServiceEquipment> Equipment { get; set; }
    }

    public enum ServiceLocation
    {
        Home,
        Clinic,
        Both
    }

    public enum EquipmentCondition
    {
        New,
        Good,
        Fair
    }
}
