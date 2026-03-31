namespace jibz.api.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;

        public string? Bio { get; set; }
        public string? ProfileImageUrl { get; set; }

        public int? HomeMountainId {get; set; }
        public Mountain? HomeMountain { get; set;}

        public ICollection<Clip> Clips { get; set; } = new List<Clip>();
        public ICollection<ClipLike> ClipLikes { get; set; } = new List<ClipLike>();
        public ICollection<ClipComment> ClipComments { get; set; } = new List<ClipComment>();
        public ICollection<MountainRating> MountainRatings { get; set; } = new List<MountainRating>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}