using System.Diagnostics.CodeAnalysis;
using System.Security.Claims;

namespace jibz.api.Models
{
    public class Mountain
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public string State { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string MapImageURL {get; set; } = null!;

        public ICollection<Clip> Clips { get; set; } = new List<Clip>();
        public ICollection<Feature> Features {get; set;}= new List<Feature>();
        public ICollection<MountainRating> MountainRatings {get; set;} = new List<MountainRating>();
    }
}