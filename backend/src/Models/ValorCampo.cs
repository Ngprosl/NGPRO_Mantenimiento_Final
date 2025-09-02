using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NgproMantenimientos.Api.Models;

public class ValorCampo
{
    [Key]
    public int IdValor { get; set; }
    
    [Required]
    public int IdCampo { get; set; }
    
    [Required]
    public int IdObjeto { get; set; } // ID del Cliente, Contrato o Incidencia
    
    public string? Valor { get; set; }
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    
    public DateTime? FechaModificacion { get; set; }

    // Navigation properties
    [ForeignKey("IdCampo")]
    public virtual CampoPersonalizado Campo { get; set; } = null!;

    // Para determinar a qué entidad pertenece basado en el ámbito del campo
    public virtual Cliente? Cliente { get; set; }
    public virtual Contrato? Contrato { get; set; }
    public virtual Incidencia? Incidencia { get; set; }
}
