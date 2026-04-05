using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using jibz.api.Data;
using jibz.api.Models;

namespace jibz.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClipLikesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClipLikesController(AppDbContext context)
        {
            _context = context;
        }

        // POST /api/cliplikes
        [HttpPost]
        public async Task<IActionResult> Like(ClipLike like)
        {
            var exists = await _context.ClipLikes
                .AnyAsync(l => l.ClipId == like.ClipId && l.UserId == like.UserId);

            if (exists) return Conflict("Already liked");

            like.CreatedAt = DateTime.UtcNow; // Set the CreatedAt property to the current UTC time. More up to date compared to model will override model when actually added

            _context.ClipLikes.Add(like);

            await _context.SaveChangesAsync();

            return Ok(like);
        }

        // DELETE /api/cliplikes
        [HttpDelete("{clipId}/{userId}")]
        public async Task<IActionResult> Unlike(int clipId, int userId)
        {
            var existing = await _context.ClipLikes
                .FirstOrDefaultAsync(l => l.ClipId == clipId && l.UserId == userId); // Find the existing like by clipId and userId

            if (existing == null)
                return NotFound();

            _context.ClipLikes.Remove(existing);
            
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}