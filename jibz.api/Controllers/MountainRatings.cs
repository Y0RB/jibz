using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using jibz.api.Data;
using jibz.api.Models;

namespace jibz.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class MountainRatingsController : ControllerBase
    {
        private readonly AppDbContext _context; // Add a reference to the database context

        public MountainRatingsController(AppDbContext context) // Constructor to initialize the database context
        {
            _context = context; // Initialize the database context
        }

        [HttpGet]
        public async Task<IActionResult> GetMountainRatings() // Action method to get all mountain ratings
        {
            var ratings = await _context.MountainRatings.ToListAsync(); // Retrieve all mountain ratings from the database asynchronously
            return Ok(ratings);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMountainRating(MountainRating rating) // Action method to create a new mountain rating
        {
            var existingRating = await _context.MountainRatings.FirstOrDefaultAsync(r => r.MountainId == rating.MountainId && r.UserId == rating.UserId); // Check if a rating for the same mountain by the same user already exists asynchronously 

            if (existingRating != null)
                return BadRequest("You have already rated this mountain.");

            _context.MountainRatings.Add(rating); // Add the new mountain rating to the database context
            
            await _context.SaveChangesAsync(); // Save changes to the database asynchronously       

            return CreatedAtAction(nameof(GetMountainRatingById), new { id = rating.Id }, rating); // Return the created mountain rating as a response
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMountainRatingById(int id)
        {
            var rating = await _context.MountainRatings.FindAsync(id);

            if (rating == null)
                return NotFound();

            return Ok(rating);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMountainRating(int id, MountainRating updatedRating)
        {
            if (id != updatedRating.Id) // If the ID in the URL does not match the ID of the updated mountain rating, return a 400 Bad Request response
                return BadRequest();

            var rating = await _context.MountainRatings.FindAsync(id); // Find the existing mountain rating by ID asynchronously

            if (rating == null) // If the mountain rating with the specified ID does not exist, return a 404 Not Found response
                return NotFound();

            // Update fields
            rating.MountainId = updatedRating.MountainId;
            rating.UserId = updatedRating.UserId;
            rating.Rating = updatedRating.Rating;

            await _context.SaveChangesAsync(); // Save changes to the database asynchronously

            return NoContent(); // Return a 204 No Content response to indicate successful update
        }   



        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMountainRating(int id)
        {
            var rating = await _context.MountainRatings.FindAsync(id); // Find the existing mountain rating by ID asynchronously
            if (rating == null) // If the mountain rating with the specified ID does not exist, return a 404 Not Found response
                return NotFound();
            
            _context.MountainRatings.Remove(rating); // Remove the mountain rating from the database context

            await _context.SaveChangesAsync(); // Save changes to the database asynchronously

            return NoContent(); // Return a 204 No Content response to indicate successful deletion
        }
    }
}