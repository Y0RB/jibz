using Microsoft.EntityFrameworkCore;
using jibz.api.Models;

namespace jibz.api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Clip> Clips { get; set; }
        public DbSet<ClipLike> ClipLikes { get; set; }
        public DbSet<ClipComment> ClipComments { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<Mountain> Mountains { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ClipLike>()
                .HasIndex(l => new { l.ClipId, l.UserId })
                .IsUnique();
        }
    }
}