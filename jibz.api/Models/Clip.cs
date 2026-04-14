namespace jibz.api.Models;
using jibz.api.Enums;

    public class Clip
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string VideoUrl { get; set; } = null!;
        public string? TrickName { get; set; }
        public string? Board{get; set;}
        public string? Stance{get; set;}
        public string? Boots{get; set;}
        public string? Bindings{get; set;}

        public int FeatureId { get; set; } 
        public Feature Feature { get; set; } = null!;

        public int MountainId { get; set; } 
        public Mountain Mountain { get; set; } = null!;

        public ClipStatus Status { get; set; } = ClipStatus.Draft;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ClipLike> Likes { get; set; } = new List<ClipLike>();
        public ICollection<ClipComment> Comments { get; set; } = new List<ClipComment>();
        public ICollection<ClipSportType> SportTypes { get; set; } = new List<ClipSportType>();
        public ICollection<ClipUser> ClipUsers { get; set; } = new List<ClipUser>();
    }
