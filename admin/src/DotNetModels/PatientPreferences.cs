using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Patient preferences for notifications and privacy
    /// </summary>
    [Table("patient_preferences")]
    public class PatientPreferences
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("patient_id")]
        public Guid PatientId { get; set; }

        // Notification preferences
        [Column("email_notifications")]
        public bool EmailNotifications { get; set; } = true;

        [Column("sms_notifications")]
        public bool SmsNotifications { get; set; } = true;

        [Column("push_notifications")]
        public bool PushNotifications { get; set; } = true;

        [Column("marketing_emails")]
        public bool MarketingEmails { get; set; } = false;

        // Validation preferences
        [Column("auto_validation_enabled")]
        public bool AutoValidationEnabled { get; set; } = true;

        [Column("validation_reminder_hours")]
        public int ValidationReminderHours { get; set; } = 24;

        // Privacy preferences
        [Column("share_with_family")]
        public bool ShareWithFamily { get; set; } = true;

        [Column("allow_provider_messages")]
        public bool AllowProviderMessages { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }
    }
}
