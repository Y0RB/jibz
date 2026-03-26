namespace jibz.api.Models
{
    public class ClipComment
    {
        public int Id { get; set; }
        public int ClipId { get; set; }
        public Clip Clip { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string Content { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}