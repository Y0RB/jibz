using Microsoft.AspNetCore.Mvc;
using jibz.api.Data;
using jibz.api.Models;

namespace jibz.api.Controllers
{
    [ApiController] // Tell ASP.NET Core that this is an API controller
    [Route("api/[controller]")] // Set the route to "api/clips" based on the controller name
    public class ClipsController : ControllerBase 
    {
        private readonly AppDbContext _context; // _context will be used to interact with the database

        public ClipsController(AppDbContext context) // Constructor that takes AppDbContext as a parameter, which will be injected by ASP.NET Core
        {
            _context = context;
        }

        [HttpGet] 
        public IActionResult GetClips()
        {
            var clips = _context.Clips.ToList();
            return Ok(clips);
        }

        [HttpPost]
        public IActionResult CreateClip(Clip clip)
        {
            _context.Clips.Add(clip);
            _context.SaveChanges();

            return Ok(clip);
        }
    }
}