namespace jibz.api.Models
{
    public class Clip
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string VideoUrl { get; set; } = null!;
        public string? TrickName { get; set; }

        public int? FeatureId { get; set; }
        public Feature? Feature { get; set; }

        public int? MountainId { get; set; }
        public Mountain? Mountain { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ClipLike> Likes { get; set; } = new List<ClipLike>();
        public ICollection<ClipComment> Comments { get; set; } = new List<ClipComment>();
    }
}