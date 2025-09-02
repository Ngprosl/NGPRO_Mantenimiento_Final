using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NgproMantenimientos.Api.Data;
using NgproMantenimientos.Api.Models;

namespace NgproMantenimientos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContratosRealesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ContratosRealesController> _logger;

    public ContratosRealesController(AppDbContext context, ILogger<ContratosRealesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // DTOs para las operaciones
    public class CreateContratoDto
    {
        public int ClienteId { get; set; }
        public AreaMantenimiento Area { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public PeriodicidadContrato Periodicidad { get; set; }
        public decimal Importe { get; set; }
        public EstadoContrato Estado { get; set; } = EstadoContrato.Activo;
        public string? FormaPago { get; set; }
        public string? Notas { get; set; }
    }

    public class UpdateContratoDto
    {
        public AreaMantenimiento Area { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public PeriodicidadContrato Periodicidad { get; set; }
        public decimal Importe { get; set; }
        public EstadoContrato Estado { get; set; }
        public string? FormaPago { get; set; }
        public string? Notas { get; set; }
    }

    /// <summary>
    /// Endpoint de prueba para verificar conectividad con la BD
    /// </summary>
    [HttpGet("test-connection")]
    public async Task<IActionResult> TestConnection()
    {
        try
        {
            var totalContratos = await _context.Contratos.CountAsync();
            
            return Ok(new
            {
                status = "✅ Conexión exitosa a BD real",
                database = "NGPRO_ADMINISTRACION",
                totalContratos = totalContratos,
                message = "Conectado a la tabla Contratos en BD remota",
                server = "sqlserver.ngpro.es,14330"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al conectar con la BD");
            return StatusCode(500, new
            {
                status = "❌ Error de conexión",
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Obtener todos los contratos con información del cliente
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetContratos([FromQuery] int? clienteId = null)
    {
        try
        {
            _logger.LogInformation("Obteniendo contratos de la BD real...");

            IQueryable<Contrato> query = _context.Contratos
                .Include(c => c.Cliente)
                .AsQueryable();

            if (clienteId.HasValue)
            {
                query = query.Where(c => c.ID == clienteId.Value);
            }

            var contratos = await query
                .Select(c => new
                {
                    c.IdContrato,
                    ClienteId = c.ID,
                    ClienteNombre = c.Cliente.NOMBRE,
                    c.Area,
                    c.Descripcion,
                    c.FechaInicio,
                    c.FechaFin,
                    c.Periodicidad,
                    c.Importe,
                    c.Estado,
                    c.FormaPago,
                    c.Notas,
                    c.FechaCreacion,
                    c.CreadoPor
                })
                .OrderByDescending(c => c.FechaCreacion)
                .ToListAsync();

            _logger.LogInformation($"Se encontraron {contratos.Count} contratos");

            return Ok(new
            {
                success = true,
                data = contratos,
                total = contratos.Count,
                message = $"Se obtuvieron {contratos.Count} contratos de la BD real"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener contratos de la BD");
            return StatusCode(500, new
            {
                success = false,
                error = ex.Message,
                message = "Error al conectar con la base de datos"
            });
        }
    }

    /// <summary>
    /// Obtener un contrato específico por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetContrato(int id)
    {
        try
        {
            _logger.LogInformation($"Obteniendo contrato ID: {id}");

            var contrato = await _context.Contratos
                .Include(c => c.Cliente)
                .Include(c => c.LineasContrato)
                .FirstOrDefaultAsync(c => c.IdContrato == id);

            if (contrato == null)
            {
                return NotFound(new { message = $"Contrato con ID {id} no encontrado" });
            }

            var response = new
            {
                contrato.IdContrato,
                ClienteId = contrato.ID,
                ClienteNombre = contrato.Cliente.NOMBRE,
                contrato.Area,
                contrato.Descripcion,
                contrato.FechaInicio,
                contrato.FechaFin,
                contrato.Periodicidad,
                contrato.Importe,
                contrato.Estado,
                contrato.FormaPago,
                contrato.Notas,
                contrato.FechaCreacion,
                contrato.CreadoPor,
                TotalLineas = contrato.LineasContrato.Count
            };

            return Ok(new
            {
                success = true,
                data = response,
                message = "Contrato obtenido exitosamente"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error al obtener contrato ID: {id}");
            return StatusCode(500, new
            {
                success = false,
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Crear un nuevo contrato
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateContrato([FromBody] CreateContratoDto dto)
    {
        try
        {
            _logger.LogInformation("Creando nuevo contrato...");

            // Validar que existe el cliente
            var clienteExiste = await _context.Clientes.AnyAsync(c => c.ID == dto.ClienteId);
            if (!clienteExiste)
            {
                return BadRequest(new { error = "El cliente especificado no existe" });
            }

            var contrato = new Contrato
            {
                ID = dto.ClienteId,
                Area = dto.Area,
                Descripcion = dto.Descripcion,
                FechaInicio = dto.FechaInicio,
                FechaFin = dto.FechaFin,
                Periodicidad = dto.Periodicidad,
                Importe = dto.Importe,
                Estado = dto.Estado,
                FormaPago = dto.FormaPago,
                Notas = dto.Notas,
                CreadoPor = "API User"
            };

            _context.Contratos.Add(contrato);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Contrato creado exitosamente con ID: {contrato.IdContrato}");

            return Created($"api/ContratosReales/{contrato.IdContrato}", new
            {
                success = true,
                data = new
                {
                    contrato.IdContrato,
                    ClienteId = contrato.ID,
                    contrato.Area,
                    contrato.Descripcion,
                    contrato.FechaInicio,
                    contrato.FechaFin,
                    contrato.Periodicidad,
                    contrato.Importe,
                    contrato.Estado,
                    contrato.FormaPago,
                    contrato.Notas,
                    contrato.FechaCreacion
                },
                message = "Contrato creado exitosamente"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear contrato");
            return StatusCode(500, new
            {
                success = false,
                error = ex.Message,
                message = "Error al crear el contrato en la base de datos"
            });
        }
    }

    /// <summary>
    /// Actualizar un contrato existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateContrato(int id, [FromBody] UpdateContratoDto dto)
    {
        try
        {
            _logger.LogInformation($"Actualizando contrato ID: {id}");

            var contrato = await _context.Contratos.FirstOrDefaultAsync(c => c.IdContrato == id);
            if (contrato == null)
            {
                return NotFound(new { message = $"Contrato con ID {id} no encontrado" });
            }

            // Actualizar propiedades
            contrato.Area = dto.Area;
            contrato.Descripcion = dto.Descripcion;
            contrato.FechaInicio = dto.FechaInicio;
            contrato.FechaFin = dto.FechaFin;
            contrato.Periodicidad = dto.Periodicidad;
            contrato.Importe = dto.Importe;
            contrato.Estado = dto.Estado;
            contrato.FormaPago = dto.FormaPago;
            contrato.Notas = dto.Notas;
            contrato.FechaModificacion = DateTime.UtcNow;
            contrato.ModificadoPor = "API User";

            await _context.SaveChangesAsync();

            _logger.LogInformation($"Contrato ID: {id} actualizado exitosamente");

            return Ok(new
            {
                success = true,
                data = new
                {
                    contrato.IdContrato,
                    ClienteId = contrato.ID,
                    contrato.Area,
                    contrato.Descripcion,
                    contrato.FechaInicio,
                    contrato.FechaFin,
                    contrato.Periodicidad,
                    contrato.Importe,
                    contrato.Estado,
                    contrato.FormaPago,
                    contrato.Notas,
                    contrato.FechaModificacion
                },
                message = "Contrato actualizado exitosamente"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error al actualizar contrato ID: {id}");
            return StatusCode(500, new
            {
                success = false,
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Eliminar un contrato
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContrato(int id)
    {
        try
        {
            _logger.LogInformation($"Eliminando contrato ID: {id}");

            var contrato = await _context.Contratos.FirstOrDefaultAsync(c => c.IdContrato == id);
            if (contrato == null)
            {
                return NotFound(new { message = $"Contrato con ID {id} no encontrado" });
            }

            _context.Contratos.Remove(contrato);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Contrato ID: {id} eliminado exitosamente");

            return Ok(new
            {
                success = true,
                message = "Contrato eliminado exitosamente"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error al eliminar contrato ID: {id}");
            return StatusCode(500, new
            {
                success = false,
                error = ex.Message
            });
        }
    }

    /// <summary>
    /// Obtener estadísticas de contratos
    /// </summary>
    [HttpGet("estadisticas")]
    public async Task<IActionResult> GetEstadisticas()
    {
        try
        {
            var stats = await _context.Contratos
                .GroupBy(c => c.Estado)
                .Select(g => new
                {
                    Estado = g.Key.ToString(),
                    Cantidad = g.Count(),
                    ImporteTotal = g.Sum(c => c.Importe)
                })
                .ToListAsync();

            var totalContratos = await _context.Contratos.CountAsync();
            var importeTotal = await _context.Contratos.SumAsync(c => c.Importe);

            return Ok(new
            {
                success = true,
                data = new
                {
                    TotalContratos = totalContratos,
                    ImporteTotal = importeTotal,
                    EstadisticasPorEstado = stats
                },
                message = "Estadísticas obtenidas exitosamente"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener estadísticas");
            return StatusCode(500, new
            {
                success = false,
                error = ex.Message
            });
        }
    }
}
