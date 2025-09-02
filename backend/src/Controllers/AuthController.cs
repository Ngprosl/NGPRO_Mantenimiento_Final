using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;

namespace NgproMantenimientos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;

    public AuthController(ILogger<AuthController> logger)
    {
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        try
        {
            // Simulación de login - aquí iría la lógica real de autenticación
            // Leer credenciales desde variables de entorno
            DotNetEnv.Env.Load();
            var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL");
            var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");

            if (request.Email == adminEmail && request.Password == adminPassword)
            {
                return Ok(new
                {
                    token = "mock-jwt-token",
                    user = new
                    {
                        id = 1,
                        email = adminEmail,
                        name = "SuperAdmin"
                    }
                });
            }

            return Unauthorized(new { message = "Credenciales inválidas" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en el login");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        try
        {
            // Simulación de registro
            return Ok(new { message = "Usuario registrado correctamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en el registro");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            return Ok(new
            {
                id = 1,
                email = "superadmin@ngpro.es",
                name = "SuperAdmin",
                role = "Admin"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener el perfil");
            return StatusCode(500, new { message = "Error interno del servidor" });
        }
    }
}

public class LoginRequest
{
    [Required(ErrorMessage = "El email es obligatorio")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "El email es obligatorio")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria")]
    [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
    public string Password { get; set; } = string.Empty;
}
