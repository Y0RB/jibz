using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using jibz.api.Data;
using jibz.api.Models;
using jibz.api.Enums;

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

        [HttpPost("{id}/collaborators")]
        public async Task<IActionResult> AddCollaborator(int id, int userId)
        {
            var clip = await _context.Clips.FindAsync(id);
            if (clip == null)
                return NotFound("Clip not found.");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            var alreadyCollaborator = await _context.ClipUsers
                .AnyAsync(cu => cu.ClipId == id && cu.UserId == userId);

            if (alreadyCollaborator)
                return BadRequest("User is already a collaborator on this clip.");

            var clipUser = new ClipUser
            {
                ClipId = id,
                UserId = userId,
                Role = ClipUserRole.Collaborator, 
                Status = ClipUserStatus.Pending,
                CreatedAt = DateTime.UtcNow         
            };
            
            _context.ClipUsers.Add(clipUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id }, clipUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Clip updatedClip)
        {
            if (id != updatedClip.Id) return BadRequest();

            var clip = await _context.Clips.FindAsync(id);
            if (clip == null) return NotFound();

            clip.Title = updatedClip.Title;
            clip.Description = updatedClip.Description;
            clip.TrickName = updatedClip.TrickName;
            clip.Board = updatedClip.Board;
            clip.Stance = updatedClip.Stance;
            clip.Boots = updatedClip.Boots;
            clip.Bindings = updatedClip.Bindings;
            clip.SportTypes = updatedClip.SportTypes;

            await _context.SaveChangesAsync(); 
            return NoContent();
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