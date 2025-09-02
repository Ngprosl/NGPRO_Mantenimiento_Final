using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NgproMantenimientos.Api.Data;
using NgproMantenimientos.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace NgproMantenimientos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientesSimpleController : ControllerBase
{
    private readonly ClientesDbContext _context;
    private readonly ILogger<ClientesSimpleController> _logger;

    public ClientesSimpleController(ClientesDbContext context, ILogger<ClientesSimpleController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // Test de conexión
    [HttpGet("test-connection")]
    public async Task<ActionResult<object>> TestConnection()
    {
        try
        {
            var count = await _context.Clientes.CountAsync();
            return Ok(new { 
                Success = true, 
                Message = $"Conexión exitosa. Total de clientes: {count}",
                Timestamp = DateTime.Now
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al probar la conexión a la base de datos");
            return StatusCode(500, new { 
                Success = false, 
                Message = "Error de conexión", 
                Error = ex.Message 
            });
        }
    }

    // GET: api/ClientesSimple - Obtener TODOS los clientes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
    {
        try
        {
            _logger.LogInformation("Obteniendo todos los clientes de la base de datos");
            
            var clientes = await _context.Clientes
                .OrderBy(c => c.NOMBRE)
                .ToListAsync();
            
            _logger.LogInformation($"Se encontraron {clientes.Count} clientes");
            
            return Ok(clientes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener los clientes de la base de datos");
            return StatusCode(500, new { 
                Message = "Error al obtener los clientes", 
                Error = ex.Message 
            });
        }
    }

    // GET: api/ClientesSimple/5 - Obtener cliente por ID
    [HttpGet("{id}")]
    public async Task<ActionResult<Cliente>> GetCliente(int id)
    {
        try
        {
            var cliente = await _context.Clientes.FindAsync(id);
            
            if (cliente == null)
            {
                return NotFound(new { Message = $"Cliente con ID {id} no encontrado" });
            }

            return Ok(cliente);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener el cliente con ID {Id}", id);
            return StatusCode(500, new { 
                Message = "Error al obtener el cliente", 
                Error = ex.Message 
            });
        }
    }

    // POST: api/ClientesSimple - Crear nuevo cliente
    [HttpPost]
    public async Task<ActionResult<Cliente>> CreateCliente([FromBody] ClienteCreateDto clienteDto)
    {
        try
        {
            _logger.LogInformation("📝 Creando nuevo cliente...");
            
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("❌ ModelState inválido: {@ModelState}", ModelState);
                return BadRequest(ModelState);
            }

            // Obtener el próximo ID disponible
            var maxId = await _context.Clientes.MaxAsync(c => (int?)c.ID) ?? 0;
            var nextId = maxId + 1;

            var cliente = new Cliente
            {
                ID = nextId, // Asignar el ID manualmente
                NOMBRE = clienteDto.nombre,
                DNICIF = clienteDto.dniCif,
                DIRECCION = clienteDto.direccion,
                POBLACION = clienteDto.poblacion,
                PROVINCIA = clienteDto.provincia,
                CODPOSTAL = clienteDto.codPostal,
                PAIS = clienteDto.pais ?? "España",
                TELEF1 = clienteDto.telef1,
                TELEF2 = clienteDto.telef2,
                EMAIL1 = clienteDto.email1,
                EMAIL2 = clienteDto.email2,
                OBSERVACIONES = clienteDto.observaciones,
                NOMBRECOMERCIAL = clienteDto.nombreComercial,
                COMERCIAL = clienteDto.comercial,
                DESCATALOGADO = clienteDto.descatalogado ?? false
            };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Cliente creado exitosamente con ID: {ClienteId}", cliente.ID);

            return CreatedAtAction(nameof(GetCliente), new { id = cliente.ID }, new
            {
                Status = "✅ Cliente creado exitosamente",
                Data = cliente
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error al crear el cliente");
            return StatusCode(500, new { 
                Message = "Error al crear el cliente", 
                Error = ex.Message,
                InnerException = ex.InnerException?.Message
            });
        }
    }

    // PUT: api/ClientesSimple/5 - Actualizar cliente
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCliente(int id, [FromBody] ClienteUpdateDto clienteDto)
    {
        try
        {
            _logger.LogInformation("📝 Actualizando cliente ID: {Id} con datos: {@ClienteDto}", id, clienteDto);
            
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("❌ ModelState inválido para cliente ID {Id}: {@ModelState}", id, ModelState);
                return BadRequest(ModelState);
            }

            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound(new { Message = $"Cliente con ID {id} no encontrado" });
            }

            // Actualizar solo los campos que no son null
            if (clienteDto.nombre != null) cliente.NOMBRE = clienteDto.nombre;
            if (clienteDto.dniCif != null) cliente.DNICIF = clienteDto.dniCif;
            if (clienteDto.direccion != null) cliente.DIRECCION = clienteDto.direccion;
            if (clienteDto.poblacion != null) cliente.POBLACION = clienteDto.poblacion;
            if (clienteDto.provincia != null) cliente.PROVINCIA = clienteDto.provincia;
            if (clienteDto.codPostal != null) cliente.CODPOSTAL = clienteDto.codPostal;
            if (clienteDto.pais != null) cliente.PAIS = clienteDto.pais;
            if (clienteDto.telef1 != null) cliente.TELEF1 = clienteDto.telef1;
            if (clienteDto.telef2 != null) cliente.TELEF2 = clienteDto.telef2;
            if (clienteDto.email1 != null) cliente.EMAIL1 = clienteDto.email1;
            if (clienteDto.email2 != null) cliente.EMAIL2 = clienteDto.email2;
            if (clienteDto.observaciones != null) cliente.OBSERVACIONES = clienteDto.observaciones;
            if (clienteDto.nombreComercial != null) cliente.NOMBRECOMERCIAL = clienteDto.nombreComercial;
            if (clienteDto.comercial != null) cliente.COMERCIAL = clienteDto.comercial;
            if (clienteDto.descatalogado.HasValue) cliente.DESCATALOGADO = clienteDto.descatalogado.Value;

            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Cliente con ID {Id} actualizado exitosamente", id);

            return Ok(new
            {
                Status = "✅ Cliente actualizado exitosamente",
                Data = cliente
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error al actualizar el cliente con ID {Id}", id);
            return StatusCode(500, new { 
                Message = "Error al actualizar el cliente", 
                Error = ex.Message,
                InnerException = ex.InnerException?.Message
            });
        }
    }

    // DELETE: api/ClientesSimple/5 - Eliminar cliente
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCliente(int id)
    {
        try
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound(new { Message = $"Cliente con ID {id} no encontrado" });
            }

            // Usar SQL directo para evitar problemas con triggers
            var deletedRows = await _context.Database.ExecuteSqlRawAsync(
                "DELETE FROM Clientes WHERE ID = {0}", id);

            if (deletedRows > 0)
            {
                _logger.LogInformation("Cliente con ID {Id} eliminado exitosamente", id);
                return Ok(new { Message = $"Cliente con ID {id} eliminado exitosamente" });
            }
            else
            {
                return NotFound(new { Message = $"No se pudo eliminar el cliente con ID {id}" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar el cliente con ID {Id}", id);
            return StatusCode(500, new { 
                Message = "Error al eliminar el cliente", 
                Error = ex.Message 
            });
        }
    }
}

// DTOs para las requests
public class ClienteCreateDto
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    [StringLength(255, ErrorMessage = "El nombre no puede exceder 255 caracteres")]
    public string nombre { get; set; } = string.Empty;
    
    [StringLength(50)]
    public string? dniCif { get; set; }
    
    [StringLength(500)]
    public string? direccion { get; set; }
    
    [StringLength(100)]
    public string? poblacion { get; set; }
    
    [StringLength(100)]
    public string? provincia { get; set; }
    
    [StringLength(10)]
    public string? codPostal { get; set; }
    
    [StringLength(100)]
    public string? pais { get; set; }
    
    [StringLength(20)]
    public string? telef1 { get; set; }
    
    [StringLength(20)]
    public string? telef2 { get; set; }
    
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    [StringLength(255)]
    public string? email1 { get; set; }
    
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    [StringLength(255)]
    public string? email2 { get; set; }
    
    public string? observaciones { get; set; }
    
    [StringLength(255)]
    public string? nombreComercial { get; set; }
    
    [StringLength(255)]
    public string? comercial { get; set; }
    
    public bool? descatalogado { get; set; }
}

public class ClienteUpdateDto
{
    [StringLength(255, ErrorMessage = "El nombre no puede exceder 255 caracteres")]
    public string? nombre { get; set; }
    
    [StringLength(50)]
    public string? dniCif { get; set; }
    
    [StringLength(500)]
    public string? direccion { get; set; }
    
    [StringLength(100)]
    public string? poblacion { get; set; }
    
    [StringLength(100)]
    public string? provincia { get; set; }
    
    [StringLength(10)]
    public string? codPostal { get; set; }
    
    [StringLength(100)]
    public string? pais { get; set; }
    
    [StringLength(20)]
    public string? telef1 { get; set; }
    
    [StringLength(20)]
    public string? telef2 { get; set; }
    
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    [StringLength(255)]
    public string? email1 { get; set; }
    
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    [StringLength(255)]
    public string? email2 { get; set; }
    
    public string? observaciones { get; set; }
    
    [StringLength(255)]
    public string? nombreComercial { get; set; }
    
    [StringLength(255)]
    public string? comercial { get; set; }
    
    public bool? descatalogado { get; set; }
}
