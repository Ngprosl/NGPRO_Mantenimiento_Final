using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NgproMantenimientos.Api.Data;
using NgproMantenimientos.Models;

namespace NgproMantenimientos.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocalizadoresController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<LocalizadoresController> _logger;

        public LocalizadoresController(AppDbContext context, ILogger<LocalizadoresController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Localizadores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Localizador>>> GetLocalizadores()
        {
            try
            {
                _logger.LogInformation("Obteniendo todos los localizadores");
                
                var localizadores = await _context.Localizadores
                    .Include(l => l.Cliente)
                    .OrderByDescending(l => l.Id)
                    .ToListAsync();

                _logger.LogInformation($"Se encontraron {localizadores.Count} localizadores");
                return Ok(localizadores);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener localizadores: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
            }
        }

        // GET: api/Localizadores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Localizador>> GetLocalizador(int id)
        {
            try
            {
                _logger.LogInformation($"Obteniendo localizador con ID: {id}");
                
                var localizador = await _context.Localizadores
                    .Include(l => l.Cliente)
                    .FirstOrDefaultAsync(l => l.Id == id);

                if (localizador == null)
                {
                    _logger.LogWarning($"Localizador con ID {id} no encontrado");
                    return NotFound(new { message = $"Localizador con ID {id} no encontrado" });
                }

                return Ok(localizador);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener localizador {id}: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
            }
        }

        // GET: api/Localizadores/ByTipo/{tipo}
        [HttpGet("ByTipo/{tipo}")]
        public async Task<ActionResult<IEnumerable<Localizador>>> GetLocalizadoresByTipo(string tipo)
        {
            try
            {
                _logger.LogInformation($"Obteniendo localizadores por tipo: {tipo}");
                
                IQueryable<Localizador> query = _context.Localizadores.Include(l => l.Cliente);
                
                // Para GPS_TRACKER, devolver todos los localizadores (ya que todos son GPS)
                if (tipo != "GPS_TRACKER")
                {
                    query = query.Where(l => l.Tipo == tipo);
                }
                
                var localizadores = await query
                    .OrderByDescending(l => l.Id)
                    .ToListAsync();

                _logger.LogInformation($"Se encontraron {localizadores.Count} localizadores del tipo {tipo}");
                return Ok(localizadores);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener localizadores por tipo {tipo}: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
            }
        }

        // GET: api/Localizadores/ByCliente/{clienteId}
        [HttpGet("ByCliente/{clienteId}")]
        public async Task<ActionResult<IEnumerable<Localizador>>> GetLocalizadoresByCliente(int clienteId)
        {
            try
            {
                _logger.LogInformation($"Obteniendo localizadores del cliente: {clienteId}");
                
                var localizadores = await _context.Localizadores
                    .Include(l => l.Cliente)
                    .Where(l => l.ClienteId == clienteId)
                    .OrderByDescending(l => l.Id)
                    .ToListAsync();

                _logger.LogInformation($"Se encontraron {localizadores.Count} localizadores para el cliente {clienteId}");
                return Ok(localizadores);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener localizadores del cliente {clienteId}: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
            }
        }

        // POST: api/Localizadores
        [HttpPost]
        public async Task<ActionResult<Localizador>> CreateLocalizador(CreateLocalizadorRequest request)
        {
            try
            {
                _logger.LogInformation("Creando nuevo localizador");

                // Generar nuevo ID manualmente
                var maxId = await _context.Localizadores.MaxAsync(l => (int?)l.Id) ?? 0;
                var newId = maxId + 1;

                var localizador = new Localizador
                {
                    Id = newId,
                    ClienteId = request.ClienteId,
                    Comercial = request.Comercial,
                    Modelo = request.Modelo,
                    Gps = request.Gps,
                    IbButton = request.IbButton,
                    Bluetooth = request.Bluetooth,
                    DescuentosAplicados = request.DescuentosAplicados,
                    CuotaMensualTotal = request.CuotaMensualTotal,
                    CuotaAnualTotal = request.CuotaAnualTotal,
                    AnoVenta = request.AnoVenta,
                    Observaciones = request.Observaciones,
                    Tipo = request.Tipo
                };

                _context.Localizadores.Add(localizador);
                await _context.SaveChangesAsync();

                // Recargar con la relación de Cliente
                var createdLocalizador = await _context.Localizadores
                    .Include(l => l.Cliente)
                    .FirstOrDefaultAsync(l => l.Id == newId);

                _logger.LogInformation($"Localizador creado exitosamente con ID: {newId}");
                return CreatedAtAction(nameof(GetLocalizador), new { id = newId }, createdLocalizador);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al crear localizador: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
            }
        }

        // PUT: api/Localizadores/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Localizador>> UpdateLocalizador(int id, UpdateLocalizadorRequest request)
        {
            try
            {
                _logger.LogInformation($"Actualizando localizador con ID: {id}");

                var localizador = await _context.Localizadores.FindAsync(id);
                if (localizador == null)
                {
                    _logger.LogWarning($"Localizador con ID {id} no encontrado para actualizar");
                    return NotFound(new { message = $"Localizador con ID {id} no encontrado" });
                }

                // Actualizar campos
                localizador.ClienteId = request.ClienteId;
                localizador.Comercial = request.Comercial;
                localizador.Modelo = request.Modelo;
                localizador.Gps = request.Gps;
                localizador.IbButton = request.IbButton;
                localizador.Bluetooth = request.Bluetooth;
                localizador.DescuentosAplicados = request.DescuentosAplicados;
                localizador.CuotaMensualTotal = request.CuotaMensualTotal;
                localizador.CuotaAnualTotal = request.CuotaAnualTotal;
                localizador.AnoVenta = request.AnoVenta;
                localizador.Observaciones = request.Observaciones;
                localizador.Tipo = request.Tipo;

                await _context.SaveChangesAsync();

                // Recargar con la relación de Cliente
                var updatedLocalizador = await _context.Localizadores
                    .Include(l => l.Cliente)
                    .FirstOrDefaultAsync(l => l.Id == id);

                _logger.LogInformation($"Localizador con ID {id} actualizado exitosamente");
                return Ok(updatedLocalizador);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al actualizar localizador {id}: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
            }
        }

        // DELETE: api/Localizadores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLocalizador(int id)
        {
            try
            {
                _logger.LogInformation($"Eliminando localizador con ID: {id}");

                var localizador = await _context.Localizadores.FindAsync(id);
                if (localizador == null)
                {
                    _logger.LogWarning($"Localizador con ID {id} no encontrado para eliminar");
                    return NotFound(new { message = $"Localizador con ID {id} no encontrado" });
                }

                // Usar SQL directo para evitar problemas con triggers
                await _context.Database.ExecuteSqlRawAsync($"DELETE FROM LOCALIZADORES WHERE ID = {id}");

                _logger.LogInformation($"Localizador con ID {id} eliminado exitosamente");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al eliminar localizador {id}: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
            }
        }

        // GET: api/Localizadores/test-connection
        [HttpGet("test-connection")]
        public async Task<ActionResult> TestConnection()
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync("SELECT 1");
                return Ok(new { success = true, message = "Conexión exitosa a la base de datos" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error de conexión: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Error de conexión", details = ex.Message });
            }
        }
    }
}
