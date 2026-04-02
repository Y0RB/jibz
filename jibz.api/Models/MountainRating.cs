namespace jibz.api.Models
{
    public class MountainRating
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int MountainId { get; set; }
        public Mountain Mountain { get; set; } = null!;
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}