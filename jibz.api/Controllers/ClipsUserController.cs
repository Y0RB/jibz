using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using jibz.api.Data;
using jibz.api.Models;
using jibz.api.Enums;

namespace jibz.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClipUsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClipUsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET all ClipUsers for a specific clip
        [HttpGet("clip/{clipId}")]
        public async Task<IActionResult> GetByClip(int clipId)
        {
            var clipUsers = await _context.ClipUsers
                .Where(cu => cu.ClipId == clipId)
                .Include(cu => cu.User)
                .ToListAsync();

            return Ok(clipUsers);
        }

        // GET pending invites for a specific user
        [HttpGet("pending/{userId}")]
        public async Task<IActionResult> GetPending(int userId)
        {
            var pending = await _context.ClipUsers
                .Where(cu => cu.UserId == userId && cu.Status == ClipUserStatus.Pending)
                .Include(cu => cu.Clip)
                .ToListAsync();

            return Ok(pending);
        }

        // PUT accept invite
        [HttpPut("{id}/accept")]
        public async Task<IActionResult> Accept(int id)
        {
            var clipUser = await _context.ClipUsers.FindAsync(id);

            if (clipUser == null)
                return NotFound();

            clipUser.Status = ClipUserStatus.Accepted;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT decline invite
        [HttpPut("{id}/decline")]
        public async Task<IActionResult> Decline(int id)
        {
            var clipUser = await _context.ClipUsers.FindAsync(id);

            if (clipUser == null)
                return NotFound();

            clipUser.Status = ClipUserStatus.Declined;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE remove a user from a clip
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var clipUser = await _context.ClipUsers.FindAsync(id);

            if (clipUser == null)
                return NotFound();

            _context.ClipUsers.Remove(clipUser);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}