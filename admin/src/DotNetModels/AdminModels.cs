using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    // ============================================
    // ADMIN SETTINGS
    // ============================================

    /// <summary>
    /// Platform-wide admin settings
    /// </summary>
    [Table("admin_settings")]
    public class AdminSetting
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        [Column("setting_category")]
        public string SettingCategory { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("setting_key")]
        public string SettingKey { get; set; }

        [Column("setting_value")]
        public string SettingValue { get; set; }

        [MaxLength(20)]
        [Column("setting_type")]
        public SettingType SettingType { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("is_editable")]
        public bool IsEditable { get; set; } = true;

        [Column("updated_by")]
        public Guid? UpdatedBy { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UpdatedBy")]
        public User UpdatedByUser { get; set; }
    }

    public enum SettingType
    {
        String,
        Number,
        Boolean,
        Json
    }

    // ============================================
    // COUNTRY INSTANCES
    // ============================================

    /// <summary>
    /// Multi-country instance management
    /// </summary>
    [Table("country_instances")]
    public class CountryInstance
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(2)]
        [Column("country_code")]
        public string CountryCode { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("country_name")]
        public string CountryName { get; set; }

        [Required]
        [MaxLength(3)]
        [Column("currency_code")]
        public string CurrencyCode { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("maintenance_mode")]
        public bool MaintenanceMode { get; set; } = false;

        [Column("launch_date")]
        public DateTime? LaunchDate { get; set; }

        // Instance-specific settings
        [Column("commission_rate", TypeName = "decimal(5,2)")]
        public decimal CommissionRate { get; set; } = 15.00m;

        [Column("min_transfer_amount", TypeName = "decimal(10,2)")]
        public decimal MinTransferAmount { get; set; } = 50.00m;

        [Column("auto_validation_hours")]
        public int AutoValidationHours { get; set; } = 48;

        // Contact and support
        [MaxLength(255)]
        [Column("support_email")]
        public string SupportEmail { get; set; }

        [MaxLength(20)]
        [Column("support_phone")]
        public string SupportPhone { get; set; }

        [MaxLength(255)]
        [Column("admin_email")]
        public string AdminEmail { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    // ============================================
    // SYSTEM HEALTH MONITORING
    // ============================================

    /// <summary>
    /// System health monitoring logs
    /// </summary>
    [Table("system_health_logs")]
    public class SystemHealthLog
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [MaxLength(2)]
        [Column("country_code")]
        public string CountryCode { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("service_name")]
        public string ServiceName { get; set; }

        [MaxLength(20)]
        [Column("status")]
        public SystemHealthStatus Status { get; set; }

        [Column("response_time_ms")]
        public int? ResponseTimeMs { get; set; }

        [Column("error_message")]
        public string ErrorMessage { get; set; }

        [Column("checked_at")]
        public DateTime CheckedAt { get; set; } = DateTime.UtcNow;

        [Column("resolved_at")]
        public DateTime? ResolvedAt { get; set; }
    }

    public enum SystemHealthStatus
    {
        Operational,
        Degraded,
        Outage
    }

    // ============================================
    // ADMIN ACTIVITY LOG
    // ============================================

    /// <summary>
    /// Enhanced admin activity tracking
    /// </summary>
    [Table("admin_activity_log")]
    public class AdminActivityLog
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("admin_id")]
        public Guid AdminId { get; set; }

        [MaxLength(2)]
        [Column("country_code")]
        public string CountryCode { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("action_type")]
        public string ActionType { get; set; }

        [Column("action_description")]
        public string ActionDescription { get; set; }

        [MaxLength(50)]
        [Column("entity_type")]
        public string EntityType { get; set; }

        [Column("entity_id")]
        public Guid? EntityId { get; set; }

        [Column("old_value")]
        public string OldValue { get; set; }

        [Column("new_value")]
        public string NewValue { get; set; }

        [MaxLength(45)]
        [Column("ip_address")]
        public string IpAddress { get; set; }

        [Column("user_agent")]
        public string UserAgent { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("AdminId")]
        public User Admin { get; set; }
    }
}
