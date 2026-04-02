using System.Security.Claims;

namespace jibz.api.Models
{
    public class Feature
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Difficulty{get; set;} = null!;
        public string? ImageURL{get; set;}
        public string FeatureType{get; set;} = null!;
        public bool isActive{get; set;}
        public DateTime CreatedAt{get; set;} = DateTime.UtcNow;

        public int MountainId {get; set;}
        public required Mountain Mountain{get; set;}
        public ICollection<Clip> Clips {get; set;} = new List<Clip>();
        
    }
}