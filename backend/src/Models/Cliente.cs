using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace NgproMantenimientos.Api.Models;

[Table("Clientes")]
public class Cliente
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)] // Asignamos el ID manualmente
    [JsonPropertyName("id")]
    public int ID { get; set; }
    
    [StringLength(100)]
    [JsonPropertyName("dnicif")]
    public string? DNICIF { get; set; }
    
    [StringLength(100)]
    [JsonPropertyName("nombre")]
    public string? NOMBRE { get; set; }
    
    [StringLength(100)]
    public string? DIRECCION { get; set; }
    
    [StringLength(100)]
    [JsonPropertyName("poblacion")]
    public string? POBLACION { get; set; }
    
    [StringLength(100)]
    [JsonPropertyName("provincia")]
    public string? PROVINCIA { get; set; }
    
    [StringLength(100)]
    public string? CODPOSTAL { get; set; }
    
    [StringLength(100)]
    public string? PAIS { get; set; }
    
    [StringLength(100)]
    [JsonPropertyName("telef1")]
    public string? TELEF1 { get; set; }
    
    [StringLength(100)]
    public string? TELEF2 { get; set; }
    
    [StringLength(100)]
    [JsonPropertyName("email1")]
    public string? EMAIL1 { get; set; }
    
    [StringLength(100)]
    public string? EMAIL2 { get; set; }
    
    [Column(TypeName = "ntext")]
    public string? OBSERVACIONES { get; set; }
    
    [StringLength(100)]
    [JsonPropertyName("nombrecomercial")]
    public string? NOMBRECOMERCIAL { get; set; }
    
    [StringLength(100)]
    public string? SEGMENTO { get; set; }
    
    [StringLength(100)]
    public string? NUMBONO { get; set; }
    
    [Column(TypeName = "date")]
    public DateTime? FECHAPRESENTADA { get; set; }
    
    [Column(TypeName = "date")]
    public DateTime? FECHACONCESION { get; set; }
    
    [StringLength(100)]
    public string? CNAE { get; set; }
    
    [StringLength(100)]
    public string? IAE { get; set; }
    
    [StringLength(100)]
    public string? PLANTILLAMEDIA { get; set; }
    
    [StringLength(100)]
    public string? ANTIGUEDAD { get; set; }
    
    [StringLength(100)]
    [JsonPropertyName("comercial")]
    public string? COMERCIAL { get; set; }
    
    public bool? TEST { get; set; }
    
    public bool? RV { get; set; }
    
    [StringLength(100)]
    public string? MINIMIS { get; set; }
    
    [StringLength(100)]
    public string? REPLEGAL { get; set; }
    
    [StringLength(100)]
    public string? REPLEGALCARGO { get; set; }
    
    [StringLength(100)]
    public string? REPLEGALDNI { get; set; }
    
    [StringLength(100)]
    public string? REPLEGALTELEF { get; set; }
    
    [StringLength(100)]
    public string? NOTARIO { get; set; }
    
    [StringLength(100)]
    public string? PROTOCOLO { get; set; }
    
    [Column(TypeName = "date")]
    public DateTime? FECHAPROTOCOLO { get; set; }
    
    public bool? PRESENTADA { get; set; }
    
    public bool? CONCESION { get; set; }
    
    public int? IDUSUARIO { get; set; }
    
    [Column(TypeName = "text")]
    public string? TEXTLEAD { get; set; }
    
    [Column(TypeName = "text")]
    public string? NUMROPO { get; set; }
    
    [Column(TypeName = "datetime")]
    public DateTime? CADUROPO { get; set; }
    
    [JsonPropertyName("descatalogado")]
    public bool? DESCATALOGADO { get; set; }

    // Navigation properties
    public virtual ICollection<Contrato> Contratos { get; set; } = new List<Contrato>();
    public virtual ICollection<ValorCampo> ValoresCampos { get; set; } = new List<ValorCampo>();
}
