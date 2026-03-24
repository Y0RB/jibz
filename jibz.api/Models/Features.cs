using System;
using System.Collections.Generic;

namespace jibz.api.Models
{
    public class Feature
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;
        public string FeatureType { get; set; } = null!;
        public int DifficultyRating { get; set; }

        public string? ImageUrl { get; set; }

        public decimal? XCoordinate { get; set; }
        public decimal? YCoordinate { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public int MountainId { get; set; }
        public Mountain Mountain { get; set; } = null!;

        public List<Clip> Clips { get; set; } = new();
    }
}