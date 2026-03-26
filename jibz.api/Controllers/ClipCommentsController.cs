using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using jibz.api.Data;
using jibz.api.Models;

namespace jibz.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClipCommentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClipCommentsController(AppDbContext context)
        {
            _context = context;
        }

        // POST /api/clipcomments
        [HttpPost]
        public async Task<IActionResult> AddComment(ClipComment comment)
        {
            comment.CreatedAt = DateTime.UtcNow;
            _context.ClipComments.Add(comment);
            await _context.SaveChangesAsync();
            return Ok(comment);
        }

        // DELETE /api/clipcomments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.ClipComments.FindAsync(id);
            if (comment == null) return NotFound();

            _context.ClipComments.Remove(comment);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}