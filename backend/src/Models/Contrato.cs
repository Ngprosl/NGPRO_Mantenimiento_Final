using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NgproMantenimientos.Api.Models;

public enum AreaMantenimiento
{
    Software = 1,
    GPS = 2,
    Ciberseguridad = 3
}

public enum PeriodicidadContrato
{
    Mensual = 1,
    Trimestral = 3,
    Semestral = 6,
    Anual = 12
}

public enum EstadoContrato
{
    Activo = 1,
    Pendiente = 2,
    Cancelado = 3,
    Vencido = 4
}

public class Contrato
{
    [Key]
    public int IdContrato { get; set; }
    
    [Required]
    public int ID { get; set; }
    
    [Required]
    public AreaMantenimiento Area { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Descripcion { get; set; } = string.Empty;
    
    [Required]
    public DateTime FechaInicio { get; set; }
    
    [Required]
    public DateTime FechaFin { get; set; }
    
    [Required]
    public PeriodicidadContrato Periodicidad { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Importe { get; set; }
    
    [Required]
    public EstadoContrato Estado { get; set; } = EstadoContrato.Activo;
    
    [StringLength(100)]
    public string? FormaPago { get; set; }
    
    [StringLength(1000)]
    public string? Notas { get; set; }
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    
    public DateTime? FechaModificacion { get; set; }
    
    [StringLength(100)]
    public string? CreadoPor { get; set; }
    
    [StringLength(100)]
    public string? ModificadoPor { get; set; }

    // Navigation properties
    [ForeignKey("ID")]
    public virtual Cliente Cliente { get; set; } = null!;
    
    public virtual ICollection<LineaContrato> LineasContrato { get; set; } = new List<LineaContrato>();
    public virtual ICollection<Renovacion> Renovaciones { get; set; } = new List<Renovacion>();
    public virtual ICollection<Incidencia> Incidencias { get; set; } = new List<Incidencia>();
    public virtual ICollection<ValorCampo> ValoresCampos { get; set; } = new List<ValorCampo>();
}
