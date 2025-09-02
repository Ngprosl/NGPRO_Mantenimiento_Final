using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NgproMantenimientos.Api.Models;

namespace NgproMantenimientos.Models
{
    [Table("LOCALIZADORES")]
    public class Localizador
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Column("CLIENTE")]
        public int? ClienteId { get; set; }

        [Column("COMERCIAL")]
        [StringLength(100)]
        public string? Comercial { get; set; }

        [Column("MODELO")]
        [StringLength(100)]
        public string? Modelo { get; set; }

        [Column("GPS")]
        public int? Gps { get; set; }

        [Column("IBBUTON")]
        public string? IbButton { get; set; }

        [Column("BLUETOOTH")]
        public int? Bluetooth { get; set; }

        [Column("DESCUENTOS_APLICADOS")]
        public double? DescuentosAplicados { get; set; }

        [Column("CUOTA_MENSUAL_TOTAL")]
        public double? CuotaMensualTotal { get; set; }

        [Column("CUOTA_ANUAL_TOTAL")]
        public double? CuotaAnualTotal { get; set; }

        [Column("ANO_VENTA")]
        public int? AnoVenta { get; set; }

        [Column("OBSERVACIONES")]
        public string? Observaciones { get; set; }

        [Column("TIPO")]
        [StringLength(100)]
        public string? Tipo { get; set; }

        // Relación con Cliente
        [ForeignKey("ClienteId")]
        public virtual Cliente? Cliente { get; set; }
    }

    // DTOs para las operaciones CRUD
    public class CreateLocalizadorRequest
    {
        public int? ClienteId { get; set; }
        public string? Comercial { get; set; }
        public string? Modelo { get; set; }
        public int? Gps { get; set; }
        public string? IbButton { get; set; }
        public int? Bluetooth { get; set; }
        public double? DescuentosAplicados { get; set; }
        public double? CuotaMensualTotal { get; set; }
        public double? CuotaAnualTotal { get; set; }
        public int? AnoVenta { get; set; }
        public string? Observaciones { get; set; }
        public string? Tipo { get; set; }
    }

    public class UpdateLocalizadorRequest
    {
        public int? ClienteId { get; set; }
        public string? Comercial { get; set; }
        public string? Modelo { get; set; }
        public int? Gps { get; set; }
        public string? IbButton { get; set; }
        public int? Bluetooth { get; set; }
        public double? DescuentosAplicados { get; set; }
        public double? CuotaMensualTotal { get; set; }
        public double? CuotaAnualTotal { get; set; }
        public int? AnoVenta { get; set; }
        public string? Observaciones { get; set; }
        public string? Tipo { get; set; }
    }
}
