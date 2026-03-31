using Microsoft.AspNetCore.Mvc;
using jibz.api.Data;
using jibz.api.Models;

namespace jibz.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeaturesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FeaturesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetFeatures()
        {
            var features = _context.Features.ToList();
            return Ok(features);
        }

        [HttpPost]
        public IActionResult CreateFeature(Feature feature)
        {
            _context.Features.Add(feature);
            _context.SaveChanges();

            return Ok(feature);
        }
    }
}