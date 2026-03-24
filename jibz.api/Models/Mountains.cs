using System;
using System.Collections.Generic;

namespace jibz.api.Models
{
    public class Mountain
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string State { get; set; } = null!;

        public string? MapImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<Feature> Features { get; set; } = new();
    }
}