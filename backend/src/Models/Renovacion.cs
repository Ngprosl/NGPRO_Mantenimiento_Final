using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NgproMantenimientos.Api.Models;

public enum EstadoCobro
{
    Pendiente = 1,
    Cobrado = 2,
    Incidencia = 3,
    Cancelado = 4
}

public class Renovacion
{
    [Key]
    public int IdRenovacion { get; set; }
    
    [Required]
    public int IdContrato { get; set; }
    
    [Required]
    public DateTime FechaPrevista { get; set; }
    
    public DateTime? FechaCobro { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Importe { get; set; }
    
    [Required]
    public EstadoCobro EstadoCobro { get; set; } = EstadoCobro.Pendiente;
    
    [StringLength(500)]
    public string? Notas { get; set; }
    
    [StringLength(100)]
    public string? MetodoPago { get; set; }
    
    [StringLength(100)]
    public string? ReferenciaTransaccion { get; set; }
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    
    public DateTime? FechaModificacion { get; set; }
    
    [StringLength(100)]
    public string? CreadoPor { get; set; }
    
    [StringLength(100)]
    public string? ModificadoPor { get; set; }

    // Navigation properties
    [ForeignKey("IdContrato")]
    public virtual Contrato Contrato { get; set; } = null!;
}
