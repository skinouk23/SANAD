using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Marketing campaign entity for provider campaigns
    /// </summary>
    [Table("marketing_campaigns")]
    public class MarketingCampaign
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

        [MaxLength(50)]
        [Column("campaign_type")]
        public CampaignType? CampaignType { get; set; }

        [MaxLength(50)]
        [Column("objective")]
        public CampaignObjective? Objective { get; set; }

        [MaxLength(50)]
        [Column("status")]
        public CampaignStatus Status { get; set; } = CampaignStatus.Draft;

        [Column("start_date")]
        public DateTime? StartDate { get; set; }

        [Column("end_date")]
        public DateTime? EndDate { get; set; }

        [Column("budget", TypeName = "decimal(10,2)")]
        public decimal? Budget { get; set; }

        [Column("spent_amount", TypeName = "decimal(10,2)")]
        public decimal SpentAmount { get; set; } = 0.00m;

        [Column("target_age_min")]
        public int? TargetAgeMin { get; set; }

        [Column("target_age_max")]
        public int? TargetAgeMax { get; set; }

        [MaxLength(200)]
        [Column("target_location")]
        public string TargetLocation { get; set; }

        [MaxLength(200)]
        [Column("headline")]
        public string Headline { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [MaxLength(100)]
        [Column("cta_text")]
        public string CtaText { get; set; }

        [Column("image_url")]
        public string ImageUrl { get; set; }

        [Column("impressions")]
        public int Impressions { get; set; } = 0;

        [Column("clicks")]
        public int Clicks { get; set; } = 0;

        [Column("conversions")]
        public int Conversions { get; set; } = 0;

        [Column("ctr", TypeName = "decimal(5,2)")]
        public decimal Ctr { get; set; } = 0.00m;

        [Column("roi", TypeName = "decimal(10,2)")]
        public decimal Roi { get; set; } = 0.00m;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ProviderId")]
        public Provider Provider { get; set; }

        public ICollection<CampaignInterest> Interests { get; set; }
        public ICollection<CampaignPerformance> PerformanceRecords { get; set; }
    }

    public enum CampaignType
    {
        Social,
        Email,
        Sms
    }

    public enum CampaignObjective
    {
        Awareness,
        Engagement,
        Conversions
    }

    public enum CampaignStatus
    {
        Draft,
        Scheduled,
        Active,
        Paused,
        Completed,
        Cancelled
    }
}
