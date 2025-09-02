using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NgproMantenimientos.Api.Models;

public enum TipoIncidencia
{
    Consulta = 1,
    Error = 2,
    Solicitud = 3,
    Mantenimiento = 4,
    Incidente = 5
}

public enum PrioridadIncidencia
{
    Baja = 1,
    Media = 2,
    Alta = 3,
    Critica = 4
}

public enum EstadoIncidencia
{
    Abierta = 1,
    EnProceso = 2,
    PendienteCliente = 3,
    Resuelta = 4,
    Cerrada = 5
}

public class Incidencia
{
    [Key]
    public int IdIncidencia { get; set; }
    
    [Required]
    public int IdContrato { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Titulo { get; set; } = string.Empty;
    
    [Required]
    public DateTime Fecha { get; set; } = DateTime.UtcNow;
    
    [Required]
    public TipoIncidencia Tipo { get; set; }
    
    [Required]
    public PrioridadIncidencia Prioridad { get; set; } = PrioridadIncidencia.Media;
    
    [Required]
    public string Descripcion { get; set; } = string.Empty;
    
    [Required]
    public EstadoIncidencia Estado { get; set; } = EstadoIncidencia.Abierta;
    
    public DateTime? FechaResolucion { get; set; }
    
    public DateTime? FechaCierre { get; set; }
    
    [StringLength(100)]
    public string? AsignadoA { get; set; }
    
    public string? Solucion { get; set; }
    
    [StringLength(1000)]
    public string? Notas { get; set; }
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    
    public DateTime? FechaModificacion { get; set; }
    
    [StringLength(100)]
    public string? CreadoPor { get; set; }
    
    [StringLength(100)]
    public string? ModificadoPor { get; set; }

    // Navigation properties
    [ForeignKey("IdContrato")]
    public virtual Contrato Contrato { get; set; } = null!;
    
    public virtual ICollection<ValorCampo> ValoresCampos { get; set; } = new List<ValorCampo>();
}
