using System.ComponentModel.DataAnnotations;

namespace NgproMantenimientos.Api.Models;

public enum RolUsuario
{
    Admin = 1,
    Gestor = 2,
    Comercial = 3,
    SoloLectura = 4
}

public class Usuario
{
    [Key]
    public int IdUsuario { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Nombre { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Apellidos { get; set; } = string.Empty;
    
    [Required]
    [StringLength(200)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    [Required]
    public RolUsuario Rol { get; set; } = RolUsuario.SoloLectura;
    
    public bool Activo { get; set; } = true;
    
    public DateTime? UltimoAcceso { get; set; }
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    
    public DateTime? FechaModificacion { get; set; }
    
    [StringLength(10)]
    public string? IdiomaPreferido { get; set; } = "es";

    // Computed property
    [Required]
    public string NombreCompleto => $"{Nombre} {Apellidos}";
}
