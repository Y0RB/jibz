using System.Linq.Expressions;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using jibz.api.Data;
using jibz.api.Models;
using jibz.api.Enums;

namespace jibz.api.Controllers
{
    [ApiController]
    [Route("api/clips")]
    public class ClipUploadsController : ControllerBase
    {
        private const long MaxVideoBytes = 200 * 1024 * 1024; // 200 MB
        private static readonly string[] AllowedExtensions = { ".mp4", ".mov", ".m4v", ".webm" };

        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ClipUploadsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // POST /api/clips/upload  (multipart/form-data, requires login)
        [Authorize]
        [HttpPost("upload")]
        [RequestSizeLimit(MaxVideoBytes)]
        [RequestFormLimits(MultipartBodyLengthLimit = MaxVideoBytes)]
        public async Task<IActionResult> Upload([FromForm] UploadClipDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            if (dto.Video == null || dto.Video.Length == 0)
                return BadRequest(new { message = "Pick a video to upload." });

            var ext = Path.GetExtension(dto.Video.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(ext))
                return BadRequest(new { message = "Video must be MP4, MOV, M4V or WebM." });

            var mountain = await _context.Mountains.FindAsync(dto.MountainId);
            if (mountain == null)
                return BadRequest(new { message = "Mountain not found." });

            // Features aren't seeded yet, so create one the first time someone posts on it
            var feature = await _context.Features
                .FirstOrDefaultAsync(f => f.MountainId == mountain.Id && f.Name == dto.Feature);
            if (feature == null)
            {
                feature = new Feature
                {
                    Name = dto.Feature,
                    Difficulty = dto.Difficulty,
                    FeatureType = dto.Feature,
                    isActive = true,
                    MountainId = mountain.Id,
                    Mountain = mountain,
                };
                _context.Features.Add(feature);
            }

            // Save the file under wwwroot/uploads with a random name
            var uploadsDir = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
            Directory.CreateDirectory(uploadsDir);
            var fileName = $"{Guid.NewGuid():N}{ext}";
            await using (var stream = System.IO.File.Create(Path.Combine(uploadsDir, fileName)))
            {
                await dto.Video.CopyToAsync(stream);
            }

            var clip = new Clip
            {
                UserId = userId,
                Title = string.IsNullOrWhiteSpace(dto.Trick) ? dto.Feature : dto.Trick,
                Description = dto.Caption,
                TrickName = dto.Trick,
                VideoUrl = $"/uploads/{fileName}",
                Board = dto.Board,
                Boots = dto.Boots,
                Bindings = dto.Bindings,
                Feature = feature,
                MountainId = mountain.Id,
                Status = ClipStatus.Published,
                CreatedAt = DateTime.UtcNow,
            };
            clip.SportTypes.Add(new ClipSportType { Sport = dto.Sport });

            _context.Clips.Add(clip);
            await _context.SaveChangesAsync();

            var created = await _context.Clips
                .Where(c => c.Id == clip.Id)
                .Select(ToSummary)
                .FirstAsync();
            return Ok(created);
        }

        // PATCH /api/clips/mine/5  — owner edits trick name / caption
        [Authorize]
        [HttpPatch("mine/{id}")]
        public async Task<IActionResult> EditMine(int id, [FromBody] EditClipDto dto)
        {
            var clip = await _context.Clips.FindAsync(id);
            if (clip == null) return NotFound(new { message = "Clip not found." });
            if (clip.UserId != CurrentUserId()) return Forbid();

            var trick = dto.Trick?.Trim();
            clip.TrickName = string.IsNullOrEmpty(trick) ? null : trick;
            clip.Description = string.IsNullOrWhiteSpace(dto.Caption) ? null : dto.Caption.Trim();
            // Title falls back to the feature name when the trick is cleared
            if (trick is { Length: > 0 }) clip.Title = trick;
            else clip.Title = await _context.Features.Where(f => f.Id == clip.FeatureId).Select(f => f.Name).FirstAsync();

            await _context.SaveChangesAsync();
            return Ok(await _context.Clips.Where(c => c.Id == id).Select(ToSummary).FirstAsync());
        }

        // DELETE /api/clips/mine/5  — owner deletes the clip and its video file
        [Authorize]
        [HttpDelete("mine/{id}")]
        public async Task<IActionResult> DeleteMine(int id)
        {
            var clip = await _context.Clips.FindAsync(id);
            if (clip == null) return NotFound(new { message = "Clip not found." });
            if (clip.UserId != CurrentUserId()) return Forbid();

            var videoUrl = clip.VideoUrl;
            _context.Clips.Remove(clip); // likes, comments, sport types, collaborators cascade
            await _context.SaveChangesAsync();

            if (videoUrl.StartsWith("/uploads/"))
            {
                var path = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", Path.GetFileName(videoUrl));
                DeleteFileWhenUnlocked(path);
            }
            return NoContent();
        }

        // The clip is already gone from the database at this point, so the request
        // succeeds either way. Windows keeps the file locked while the video is still
        // streaming to a player, so retry in the background for up to ~1 minute.
        private static void DeleteFileWhenUnlocked(string path)
        {
            _ = Task.Run(async () =>
            {
                for (var attempt = 0; attempt < 30; attempt++)
                {
                    try
                    {
                        if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
                        return;
                    }
                    catch (IOException) { }
                    catch (UnauthorizedAccessException) { }
                    await Task.Delay(2000);
                }
            });
        }

        private int CurrentUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // GET /api/clips/user/5
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var clips = await _context.Clips
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .Select(ToSummary)
                .ToListAsync();
            return Ok(clips);
        }

        // Flat shape for the frontend; avoids the User <-> Clips reference loop.
        // Apply Where/OrderBy before this — EF can't filter on the projected record.
        private static readonly Expression<Func<Clip, ClipSummaryDto>> ToSummary =
            c => new ClipSummaryDto(
                c.Id,
                c.UserId,
                c.User.Username,
                c.Title,
                c.Description,
                c.TrickName,
                c.VideoUrl,
                c.Feature.Name,
                c.Feature.Difficulty,
                c.Mountain.Name,
                c.SportTypes.Select(s => s.Sport).FirstOrDefault(),
                c.Board,
                c.Boots,
                c.Bindings,
                c.Likes.Count,
                c.Comments.Count,
                c.CreatedAt);
    }

    public class UploadClipDto
    {
        public IFormFile? Video { get; set; }
        public int MountainId { get; set; }
        public string Feature { get; set; } = null!;
        public string Difficulty { get; set; } = null!;
        public SportType Sport { get; set; }
        public string? Trick { get; set; }
        public string? Caption { get; set; }
        public string? Board { get; set; }
        public string? Boots { get; set; }
        public string? Bindings { get; set; }
    }

    public record EditClipDto(string? Trick, string? Caption);

    public record ClipSummaryDto(
        int Id,
        int UserId,
        string Username,
        string Title,
        string? Caption,
        string? Trick,
        string VideoUrl,
        string Feature,
        string Difficulty,
        string Mountain,
        SportType Sport,
        string? Board,
        string? Boots,
        string? Bindings,
        int Likes,
        int Comments,
        DateTime CreatedAt);
}
