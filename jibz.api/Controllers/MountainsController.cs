using Microsoft.AspNetCore.Mvc;
using jibz.api.Data;
using jibz.api.Models;


namespace jibz.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MountainsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MountainsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetMountains()
        {
            var mountains = _context.Mountains.ToList();
            return Ok(mountains);
        }

        [HttpPost]
        public IActionResult CreateMountain(Mountain mountain)
        {
            _context.Mountains.Add(mountain);
            _context.SaveChanges();

            return Ok(mountain);
        }
    }
}