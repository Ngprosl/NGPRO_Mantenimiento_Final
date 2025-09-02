using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using System.ComponentModel.DataAnnotations.Schema;
namespace NgproMantenimientos.Models
{
        [Table("CRM_ACUERDOS")]
        public class Acuerdo
        {
            [Key]
            [Column("ID")]
            public int ID { get; set; }



    [Column("NOMBRE")]
    [StringLength(150)]
    public string? NOMBRE { get; set; }

    [Column("SEGMENTO")]
    [StringLength(150)]
    public string? SEGMENTO { get; set; }

    [Column("COMERCIAL")]
    [StringLength(150)]
    public string? COMERCIAL { get; set; }

    [Column("CIF_NIF")]
    [StringLength(150)]
    public string? CIF_NIF { get; set; }

    [Column("IMPORTE")]
    [StringLength(150)]
    public string? IMPORTE { get; set; }

    [Column("NBONO")]
    [StringLength(150)]
    public string? NBONO { get; set; }

        [Column("OBSERVACIONES")]
        [StringLength(150)]
        public string? OBSERVACIONES { get; set; }

            [Column("COBRADO")]
            public bool? COBRADO { get; set; }

            [Column("FECHA_ENVIADO")]
            public DateTime? FECHA_ENVIADO { get; set; }

            [Column("FECHA_COBRADO")]
            public DateTime? FECHA_COBRADO { get; set; }

            [Column("BAJA")]
            public bool? BAJA { get; set; }

        [Column("VALIDADOS")]
        public DateTime? VALIDADOS { get; set; }

        [Column("LANZADOS")]
        public DateTime? LANZADOS { get; set; }

        [Column("IVAPAGADO")]
        public DateTime? IVAPAGADO { get; set; }

        [Column("PRIMER_JUST_PRESENTADO")]
        public DateTime? PRIMER_JUST_PRESENTADO { get; set; }

        [Column("SEGUND_JUST_PRESENTADO")]
        public DateTime? SEGUND_JUST_PRESENTADO { get; set; }

        [Column("FECHAFACTURA")]
        public DateTime? FECHAFACTURA { get; set; }

        [Column("PRESENTADOS")]
        public DateTime? PRESENTADOS { get; set; }

        [Column("ENVIADO")]
        public bool? ENVIADO { get; set; }

            // [Column("ID_CLIENTE")] // futuro campo
            // public int? ID_CLIENTE { get; set; }
        }
}
