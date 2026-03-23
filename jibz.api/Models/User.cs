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

        public string? LocalMountain { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}