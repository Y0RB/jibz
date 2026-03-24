using System;

namespace jibz.api.Models
{
    public class Clip
    {
        public int Id { get; set; }

        public string VideoUrl { get; set; } = null!;
        public string? Caption { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? Board { get; set; }
        public string? Bindings { get; set; }
        public string? Boots { get; set; }
        public string? Stance { get; set; }
        public string? Notes { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int FeatureId { get; set; }
        public Feature Feature { get; set; } = null!;
    }
}