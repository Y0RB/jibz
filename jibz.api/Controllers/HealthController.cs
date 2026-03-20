using Microsoft.AspNetCore.Mvc;

namespace jibz.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { status = "ok", app = "jibz api" });
    }
}