using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using jibz.api.Data;
using jibz.api.Models;


namespace jibz.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class MountainsController : ControllerBase
    {
        private readonly AppDbContext _context; // Add a reference to the database context

        public MountainsController(AppDbContext context) // Constructor to initialize the database context
        {
            _context = context; // Initialize the database context
        }

        [HttpGet]
        public async Task<IActionResult> GetMountains() // Action method to get all mountains
        {
            var mountains = await _context.Mountains.ToListAsync(); // Retrieve all mountains from the database asynchronously
            return Ok(mountains);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMountain(Mountain mountain) // Action method to create a new mountain
        {
            var existingMountain = await _context.Mountains.FirstOrDefaultAsync(m => m.Name == mountain.Name); // Check if a mountain with the same name already exists asynchronously 

            if (existingMountain != null)
                return BadRequest("A mountain with the same name already exists.");

            _context.Mountains.Add(mountain); // Add the new mountain to the database context   

            await _context.SaveChangesAsync(); // Save changes to the database asynchronously

            return CreatedAtAction(nameof(GetMountainsById), new { id = mountain.Id }, mountain); // Return the created mountain as a response
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMountainsById(int id)
        {
            var mountain = await _context.Mountains.FindAsync(id);

            if (mountain == null)
                return NotFound();

            return Ok(mountain);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMountain(int id, Mountain updatedMountain)
        {
            if (id != updatedMountain.Id) // If the ID in the URL does not match the ID of the updated mountain, return a 400 Bad Request response
                return BadRequest();

            var mountain = await _context.Mountains.FindAsync(id); // Find the existing mountain by ID asynchronously

            if (mountain == null) // If the mountain with the specified ID does not exist, return a 404 Not Found response
                return NotFound();

            // Update fields
            mountain.Name = updatedMountain.Name;
            mountain.State = updatedMountain.State;
            mountain.City = updatedMountain.City;
            mountain.MapImageURL = updatedMountain.MapImageURL;



            await _context.SaveChangesAsync();

            return NoContent(); // standard for PUT
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMountain(int id)
        {
            var mountain = await _context.Mountains.FindAsync(id); // Find the existing mountain by ID asynchronously   

            if (mountain == null) // If the mountain with the specified ID does not exist, return a 404 Not Found response
                return NotFound();

            _context.Mountains.Remove(mountain); // Remove the mountain from the database context

            await _context.SaveChangesAsync(); // Save changes to the database asynchronously

            return NoContent(); // standard for DELETE
        }
    }

}