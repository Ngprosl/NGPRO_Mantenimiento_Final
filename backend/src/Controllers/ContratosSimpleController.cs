using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace NgproMantenimientos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContratosSimpleController : ControllerBase
{
    private readonly ILogger<ContratosSimpleController> _logger;

    public ContratosSimpleController(ILogger<ContratosSimpleController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetContratos()
    {
        try
        {
            var contratos = new[]
            {
                new { Id = 1, Numero = "CONT-001", ClienteId = 1, Estado = "ACTIVO", Valor = 1500.00m },
                new { Id = 2, Numero = "CONT-002", ClienteId = 2, Estado = "VIGENTE", Valor = 2500.00m }
            };

            return Ok(new
            {
                Status = "✅ Conexión exitosa",
                Message = "Lista de contratos mock",
                Data = contratos,
                Total = contratos.Length
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener contratos");
            return StatusCode(500, new { Message = "Error interno del servidor" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetContrato(int id)
    {
        try
        {
            return Ok(new
            {
                Status = "✅ Contrato encontrado",
                Message = $"Contrato con ID {id}",
                Data = new { Id = id, Numero = $"CONT-{id:000}", Estado = "ACTIVO", Valor = 1500.00m }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener contrato {Id}", id);
            return StatusCode(500, new { Message = "Error interno del servidor" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateContrato(CreateContratoSimpleRequest request)
    {
        try
        {
            return Ok(new
            {
                Status = "✅ Contrato creado",
                Message = "Contrato creado exitosamente",
                Data = new { Id = 99, Numero = request.Numero, ClienteId = request.ClienteId, Valor = request.Valor }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear contrato");
            return StatusCode(500, new { Message = "Error interno del servidor" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateContrato(int id, UpdateContratoSimpleRequest request)
    {
        try
        {
            return Ok(new
            {
                Status = "✅ Contrato actualizado",
                Message = $"Contrato {id} actualizado exitosamente",
                Data = new { Id = id, Numero = request.Numero, Valor = request.Valor }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar contrato");
            return StatusCode(500, new { Message = "Error interno del servidor" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContrato(int id)
    {
        try
        {
            return Ok(new
            {
                Status = "✅ Contrato eliminado",
                Message = $"Contrato {id} eliminado exitosamente"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar contrato");
            return StatusCode(500, new { Message = "Error interno del servidor" });
        }
    }

    [HttpGet("cliente/{clienteId}")]
    public async Task<IActionResult> GetContratosByCliente(int clienteId)
    {
        try
        {
            var contratos = new[]
            {
                new { Id = 1, Numero = $"CONT-{clienteId:000}-001", ClienteId = clienteId, Estado = "ACTIVO" },
                new { Id = 2, Numero = $"CONT-{clienteId:000}-002", ClienteId = clienteId, Estado = "VIGENTE" }
            };

            return Ok(new
            {
                Status = "✅ Contratos del cliente",
                Message = $"Contratos del cliente {clienteId}",
                Data = contratos,
                Total = contratos.Length
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener contratos del cliente");
            return StatusCode(500, new { Message = "Error interno del servidor" });
        }
    }

    [HttpGet("test-connection")]
    public async Task<IActionResult> TestConnection()
    {
        try
        {
            return Ok(new
            {
                Status = "✅ Conexión de prueba exitosa",
                Message = "Controller funcionando correctamente",
                Timestamp = DateTime.Now,
                Controller = "ContratosSimple"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en test de conexión");
            return StatusCode(500, new { Message = "Error interno del servidor" });
        }
    }
}

// DTOs simples
public class CreateContratoSimpleRequest
{
    [Required(ErrorMessage = "El número de contrato es obligatorio")]
    [StringLength(50, ErrorMessage = "El número no puede exceder 50 caracteres")]
    public string Numero { get; set; } = string.Empty;

    [Required(ErrorMessage = "El ID del cliente es obligatorio")]
    public int ClienteId { get; set; }

    [Required(ErrorMessage = "El valor es obligatorio")]
    [Range(0, double.MaxValue, ErrorMessage = "El valor debe ser mayor o igual a 0")]
    public decimal Valor { get; set; }

    [StringLength(20, ErrorMessage = "El estado no puede exceder 20 caracteres")]
    public string? Estado { get; set; }

    public DateTime? FechaInicio { get; set; }

    public DateTime? FechaFin { get; set; }
}

public class UpdateContratoSimpleRequest
{
    [StringLength(50, ErrorMessage = "El número no puede exceder 50 caracteres")]
    public string? Numero { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "El valor debe ser mayor o igual a 0")]
    public decimal? Valor { get; set; }

    [StringLength(20, ErrorMessage = "El estado no puede exceder 20 caracteres")]
    public string? Estado { get; set; }

    public DateTime? FechaInicio { get; set; }

    public DateTime? FechaFin { get; set; }
}
