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

            like.CreatedAt = DateTime.UtcNow;
            _context.ClipLikes.Add(like);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // DELETE /api/cliplikes
        [HttpDelete]
        public async Task<IActionResult> Unlike(ClipLike like)
        {
            var existing = await _context.ClipLikes
                .FirstOrDefaultAsync(l => l.ClipId == like.ClipId && l.UserId == like.UserId);

            if (existing == null) return NotFound();

            _context.ClipLikes.Remove(existing);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}