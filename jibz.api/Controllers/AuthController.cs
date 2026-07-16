using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using jibz.api.Data;
using jibz.api.Models;

namespace jibz.api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    // POST /api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        // Check if username or email already taken
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest(new { message = "Email is already in use." });

        if (await _db.Users.AnyAsync(u => u.Username == dto.Username))
            return BadRequest(new { message = "Username is already taken." });

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            HomeMountainId = dto.LocalMountainId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = GenerateToken(user);
        return Ok(new { token, userId = user.Id, username = user.Username });
    }

    // POST /api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        var token = GenerateToken(user);
        return Ok(new { token, userId = user.Id, username = user.Username });
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(30),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// DTOs
public record RegisterDto(
    string Username,
    string Email,
    string Password,
    int? LocalMountainId,
    string? Stance,
    string? DateOfBirth
);

public record LoginDto(string Email, string Password);