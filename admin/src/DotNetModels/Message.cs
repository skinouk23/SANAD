using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Message entity for chat between patients and providers
    /// </summary>
    [Table("messages")]
    public class Message
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("sender_id")]
        public Guid SenderId { get; set; }

        [Required]
        [Column("receiver_id")]
        public Guid ReceiverId { get; set; }

        [Column("booking_id")]
        public Guid? BookingId { get; set; }

        [Required]
        [Column("message")]
        public string MessageText { get; set; }

        [Column("is_read")]
        public bool IsRead { get; set; } = false;

        [Column("read_at")]
        public DateTime? ReadAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("SenderId")]
        public User Sender { get; set; }

        [ForeignKey("ReceiverId")]
        public User Receiver { get; set; }

        [ForeignKey("BookingId")]
        public Booking Booking { get; set; }
    }
}
