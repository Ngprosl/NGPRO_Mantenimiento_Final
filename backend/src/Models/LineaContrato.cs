using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NgproMantenimientos.Api.Models;

public class LineaContrato
{
    [Key]
    public int IdLinea { get; set; }
    
    [Required]
    public int IdContrato { get; set; }
    
    [Required]
    [StringLength(500)]
    public string Concepto { get; set; } = string.Empty;
    
    [Required]
    public int Cantidad { get; set; } = 1;
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal PrecioUnitario { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal PorcentajeImpuestos { get; set; } = 21.0m;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal ImporteImpuestos { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }
    
    [StringLength(500)]
    public string? Descripcion { get; set; }
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("IdContrato")]
    public virtual Contrato Contrato { get; set; } = null!;

    // Calculated properties
    [NotMapped]
    public decimal Subtotal => Cantidad * PrecioUnitario;
}
