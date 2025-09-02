using System.ComponentModel.DataAnnotations;

namespace NgproMantenimientos.Api.Models;

public enum AmbitoCampo
{
    Cliente = 1,
    Contrato = 2,
    Incidencia = 3
}

public enum TipoDatoCampo
{
    Texto = 1,
    Numero = 2,
    Fecha = 3,
    Lista = 4,
    Booleano = 5,
    TextoLargo = 6
}

public class CampoPersonalizado
{
    [Key]
    public int IdCampo { get; set; }
    
    [Required]
    public AmbitoCampo Ambito { get; set; }
    
    [Required]
    [StringLength(100)]
    public string NombreCampo { get; set; } = string.Empty;
    
    [StringLength(100)]
    public string? EtiquetaCampo { get; set; }
    
    [Required]
    public TipoDatoCampo TipoDato { get; set; }
    
    public string? OpcionesJSON { get; set; } // Para listas desplegables
    
    public bool EsObligatorio { get; set; } = false;
    
    public bool Activo { get; set; } = true;
    
    public int Orden { get; set; } = 0;
    
    [StringLength(500)]
    public string? Descripcion { get; set; }
    
    [StringLength(200)]
    public string? PlaceholderTexto { get; set; }
    
    public string? ValorPorDefecto { get; set; }
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    
    public DateTime? FechaModificacion { get; set; }
    
    [StringLength(100)]
    public string? CreadoPor { get; set; }

    // Navigation properties
    public virtual ICollection<ValorCampo> ValoresCampos { get; set; } = new List<ValorCampo>();
}
