using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using jibz.api.Data;
using jibz.api.Models;

namespace jibz.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClipsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClipsController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/clips
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clips = await _context.Clips
                .Include(c => c.User)
                .Include(c => c.Likes)
                .Include(c => c.Comments)
                .ToListAsync();
            return Ok(clips);
        }

        // GET /api/clips/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var clip = await _context.Clips
                .Include(c => c.User)
                .Include(c => c.Likes)
                .Include(c => c.Comments)
                .FirstOrDefaultAsync(c => c.Id == id); // Find the clip by ID and include related data (user, likes, comments) asynchronously

            if (clip == null) return NotFound();
            return Ok(clip);
        }

        // POST /api/clips
        [HttpPost]
        public async Task<IActionResult> Create(Clip clip)
        {
            clip.CreatedAt = DateTime.UtcNow;

            _context.Clips.Add(clip);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = clip.Id }, clip);
        }

        // DELETE /api/clips/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var clip = await _context.Clips.FindAsync(id);
            if (clip == null) return NotFound();

            _context.Clips.Remove(clip);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}