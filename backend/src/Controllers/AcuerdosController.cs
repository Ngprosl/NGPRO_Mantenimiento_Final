using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using NgproMantenimientos.Api.Data;
using NgproMantenimientos.Models;

namespace NgproMantenimientos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AcuerdosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AcuerdosController(AppDbContext context)
        {
            _context = context;
        }

        // Contratos activos: (SEGUND_JUST_PRESENTADO IS NOT NULL OR SEGMENTO = 'NO KIT') AND BAJA <> 1
        [HttpGet("activos")]
        public async Task<ActionResult<IEnumerable<AcuerdoDto>>> GetActivos()
        {
            var acuerdos = await _context.Acuerdos
                .Where(a => (a.SEGUND_JUST_PRESENTADO != null || a.SEGMENTO == "NO KIT") && a.BAJA != true)
                .Select(a => new AcuerdoDto
                {
                    ID = a.ID,
                    NOMBRE = a.NOMBRE,
                    SEGMENTO = a.SEGMENTO,
                    COMERCIAL = a.COMERCIAL,
                    CIF_NIF = a.CIF_NIF,
                    IMPORTE = a.IMPORTE,
                    NBONO = a.NBONO,
                    VALIDADOS = a.VALIDADOS,
                    LANZADOS = a.LANZADOS,
                    IVAPAGADO = a.IVAPAGADO,
                    PRIMER_JUST_PRESENTADO = a.PRIMER_JUST_PRESENTADO,
                    SEGUND_JUST_PRESENTADO = a.SEGUND_JUST_PRESENTADO,
                    OBSERVACIONES = a.OBSERVACIONES,
                    FECHAFACTURA = a.FECHAFACTURA,
                    PRESENTADOS = a.PRESENTADOS,
                    ENVIADO = a.ENVIADO,
                    COBRADO = a.COBRADO,
                    FECHA_ENVIADO = a.FECHA_ENVIADO,
                    FECHA_COBRADO = a.FECHA_COBRADO,
                    BAJA = a.BAJA
                })
                .ToListAsync();
            return Ok(acuerdos);
        }

        // Contratos total: todos los registros
        [HttpGet("total")]
        public async Task<ActionResult<IEnumerable<AcuerdoDto>>> GetInactivos()
        {
            var acuerdos = await _context.Acuerdos
                .Select(a => new AcuerdoDto
                {
                    ID = a.ID,
                    NOMBRE = a.NOMBRE,
                    SEGMENTO = a.SEGMENTO,
                    COMERCIAL = a.COMERCIAL,
                    CIF_NIF = a.CIF_NIF,
                    IMPORTE = a.IMPORTE,
                    NBONO = a.NBONO,
                    VALIDADOS = a.VALIDADOS,
                    LANZADOS = a.LANZADOS,
                    IVAPAGADO = a.IVAPAGADO,
                    PRIMER_JUST_PRESENTADO = a.PRIMER_JUST_PRESENTADO,
                    SEGUND_JUST_PRESENTADO = a.SEGUND_JUST_PRESENTADO,
                    OBSERVACIONES = a.OBSERVACIONES,
                    FECHAFACTURA = a.FECHAFACTURA,
                    PRESENTADOS = a.PRESENTADOS,
                    ENVIADO = a.ENVIADO,
                    COBRADO = a.COBRADO,
                    FECHA_ENVIADO = a.FECHA_ENVIADO,
                    FECHA_COBRADO = a.FECHA_COBRADO,
                    BAJA = a.BAJA
                })
                .ToListAsync();
            return Ok(acuerdos);
        }

        // Crear nuevo acuerdo
        [HttpPost]
        public async Task<ActionResult<AcuerdoDto>> CreateAcuerdo([FromBody] AcuerdoDto dto)
        {
            // Si tu tabla tiene autoincremento en ID, elimina la siguiente lógica de nextId
            int nextId = 1;
            if (_context.Acuerdos.Any())
            {
                nextId = _context.Acuerdos.Max(a => a.ID) + 1;
            }

            var acuerdo = new Acuerdo
            {
                ID = nextId, // Elimina si tu tabla tiene autoincremento
                NOMBRE = dto.NOMBRE,
                SEGMENTO = dto.SEGMENTO,
                COMERCIAL = dto.COMERCIAL,
                CIF_NIF = dto.CIF_NIF,
                IMPORTE = dto.IMPORTE,
                NBONO = dto.NBONO,
                VALIDADOS = dto.VALIDADOS,
                LANZADOS = dto.LANZADOS,
                IVAPAGADO = dto.IVAPAGADO,
                PRIMER_JUST_PRESENTADO = dto.PRIMER_JUST_PRESENTADO,
                SEGUND_JUST_PRESENTADO = dto.SEGUND_JUST_PRESENTADO,
                OBSERVACIONES = dto.OBSERVACIONES,
                FECHAFACTURA = dto.FECHAFACTURA,
                PRESENTADOS = dto.PRESENTADOS,
                ENVIADO = dto.ENVIADO,
                COBRADO = dto.COBRADO,
                FECHA_ENVIADO = dto.FECHA_ENVIADO,
                FECHA_COBRADO = dto.FECHA_COBRADO,
                BAJA = dto.BAJA
            };

            _context.Acuerdos.Add(acuerdo);
            await _context.SaveChangesAsync();

            dto.ID = acuerdo.ID;
            return CreatedAtAction(nameof(GetActivos), new { id = acuerdo.ID }, dto);
        }

        // Editar acuerdo
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAcuerdo(int id, [FromBody] AcuerdoDto dto)
        {
            var acuerdo = await _context.Acuerdos.FindAsync(id);
            if (acuerdo == null)
                return NotFound();

            acuerdo.NOMBRE = dto.NOMBRE;
            acuerdo.SEGMENTO = dto.SEGMENTO;
            acuerdo.COMERCIAL = dto.COMERCIAL;
            acuerdo.CIF_NIF = dto.CIF_NIF;
            acuerdo.IMPORTE = dto.IMPORTE;
            acuerdo.NBONO = dto.NBONO;
            acuerdo.VALIDADOS = dto.VALIDADOS;
            acuerdo.LANZADOS = dto.LANZADOS;
            acuerdo.IVAPAGADO = dto.IVAPAGADO;
            acuerdo.PRIMER_JUST_PRESENTADO = dto.PRIMER_JUST_PRESENTADO;
            acuerdo.SEGUND_JUST_PRESENTADO = dto.SEGUND_JUST_PRESENTADO;
            acuerdo.OBSERVACIONES = dto.OBSERVACIONES;
            acuerdo.FECHAFACTURA = dto.FECHAFACTURA;
            acuerdo.PRESENTADOS = dto.PRESENTADOS;
            acuerdo.ENVIADO = dto.ENVIADO;
            acuerdo.COBRADO = dto.COBRADO;
            acuerdo.FECHA_ENVIADO = dto.FECHA_ENVIADO;
            acuerdo.FECHA_COBRADO = dto.FECHA_COBRADO;
            acuerdo.BAJA = dto.BAJA;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Eliminar acuerdo (triggers de SQL Server se ejecutan automáticamente)
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAcuerdo(int id)
        {
            var acuerdo = await _context.Acuerdos.FindAsync(id);
            if (acuerdo == null)
                return NotFound();

            _context.Acuerdos.Remove(acuerdo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    // DTO para exponer los datos
    public class AcuerdoDto
    {
        public int ID { get; set; }
        public string NOMBRE { get; set; }
        public string SEGMENTO { get; set; }
        public string COMERCIAL { get; set; }
        public string CIF_NIF { get; set; }
        public string IMPORTE { get; set; }
        public string NBONO { get; set; }
        public DateTime? VALIDADOS { get; set; }
        public DateTime? LANZADOS { get; set; }
        public DateTime? IVAPAGADO { get; set; }
        public DateTime? PRIMER_JUST_PRESENTADO { get; set; }
        public DateTime? SEGUND_JUST_PRESENTADO { get; set; }
        public string OBSERVACIONES { get; set; }
        public DateTime? FECHAFACTURA { get; set; }
        public DateTime? PRESENTADOS { get; set; }
        public bool? ENVIADO { get; set; }
        public bool? COBRADO { get; set; }
        public DateTime? FECHA_ENVIADO { get; set; }
        public DateTime? FECHA_COBRADO { get; set; }
        public bool? BAJA { get; set; }
        //public int? ID_CLIENTE { get; set; } // futuro campo
    }
}
