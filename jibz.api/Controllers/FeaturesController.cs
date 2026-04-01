using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using jibz.api.Data;
using jibz.api.Models;

namespace jibz.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class FeaturesController : ControllerBase
    {
        private readonly AppDbContext _context; // Add a reference to the database context

        public FeaturesController(AppDbContext context) // Constructor to initialize the database context
        {
            _context = context; // Initialize the database context
        }

        [HttpGet]
        public async Task<IActionResult> GetFeatures() // Action method to get all features
        {
            var features = await _context.Features.ToListAsync(); // Retrieve all features from the database asynchronously
            return Ok(features);
        }

        [HttpPost]
        public async Task<IActionResult> CreateFeature(Feature feature) // Action method to create a new feature
        {
            var existingFeature = await _context.Features.FirstOrDefaultAsync(f => f.Name == feature.Name); // Check if a feature with the same name already exists asynchronously

            if (existingFeature != null)
                return BadRequest("A feature with the same name already exists.");

            _context.Features.Add(feature); // Add the new feature to the database context

            feature.CreatedAt = DateTime.UtcNow; // Set the CreatedAt property to the current UTC time      

            await _context.SaveChangesAsync(); // Save changes to the database asynchronously

            return CreatedAtAction(nameof(GetFeatureById), new { id = feature.Id }, feature); // Return the created feature as a response
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFeatureById(int id)
        {
            var feature = await _context.Features.FindAsync(id);

            if (feature == null)
                return NotFound();

            return Ok(feature);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFeature(int id, Feature updatedFeature)
        {
            if (id != updatedFeature.Id) // If the ID in the URL does not match the ID of the updated feature, return a 400 Bad Request response
                return BadRequest();

            var feature = await _context.Features.FindAsync(id); // Find the existing feature by ID asynchronously

            if (feature == null) // If the feature with the specified ID does not exist, return a 404 Not Found response
                return NotFound();

            // Update fields
            feature.Name = updatedFeature.Name;
            feature.Description = updatedFeature.Description;

            await _context.SaveChangesAsync(); // Save changes to the database asynchronously
            
            return NoContent(); // Return a 204 No Content response to indicate successful update
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeature(int id)
        {
            var feature = await _context.Features.FindAsync(id);
            if (feature == null)
                return NotFound();

            _context.Features.Remove(feature); // Remove the feature from the database context

            await _context.SaveChangesAsync(); // Save changes to the database asynchronously

            return NoContent();
        }
    }
}