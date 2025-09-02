using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NgproMantenimientos.Api.Data;

namespace NgproMantenimientos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TableSchemaController : ControllerBase
{
    private readonly ClientesDbContext _context;
    private readonly ILogger<TableSchemaController> _logger;

    public TableSchemaController(ClientesDbContext context, ILogger<TableSchemaController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("columns-info")]
    public async Task<IActionResult> GetColumnsInfo()
    {
        try
        {
            var sql = @"
                SELECT 
                    COLUMN_NAME as ColumnName,
                    DATA_TYPE as DataType,
                    IS_NULLABLE as IsNullable,
                    COLUMN_DEFAULT as DefaultValue,
                    COLUMNPROPERTY(OBJECT_ID(TABLE_SCHEMA + '.' + TABLE_NAME), COLUMN_NAME, 'IsIdentity') as IsIdentity
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'CLIENTES' 
                ORDER BY ORDINAL_POSITION";

            using var command = _context.Database.GetDbConnection().CreateCommand();
            command.CommandText = sql;
            
            await _context.Database.OpenConnectionAsync();
            
            var result = new List<object>();
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                result.Add(new
                {
                    ColumnName = reader["ColumnName"]?.ToString(),
                    DataType = reader["DataType"]?.ToString(),
                    IsNullable = reader["IsNullable"]?.ToString(),
                    DefaultValue = reader["DefaultValue"]?.ToString(),
                    IsIdentity = reader["IsIdentity"]?.ToString() == "1"
                });
            }
            
            return Ok(new
            {
                Status = "✅ Información de tabla obtenida",
                TableName = "CLIENTES",
                Columns = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener información de la tabla");
            return StatusCode(500, new
            {
                Status = "❌ Error al obtener información",
                Error = ex.Message
            });
        }
        finally
        {
            await _context.Database.CloseConnectionAsync();
        }
    }

    [HttpGet("test-manual-id")]
    public async Task<IActionResult> TestInsertWithManualId()
    {
        try
        {
            // Obtener el ID más alto actual
            var maxId = await _context.Clientes.MaxAsync(c => c.ID);
            var nextId = maxId + 1;

            _logger.LogInformation("Intentando insertar con ID manual: {NextId}", nextId);

            var clientePrueba = new NgproMantenimientos.Api.Models.Cliente
            {
                ID = nextId, // Asignar ID manualmente
                NOMBRE = $"TEST_MANUAL_ID_{DateTime.Now:HHmmss}",
                DNICIF = "00000000T",
                EMAIL1 = "test@manual.com"
            };

            _context.Clientes.Add(clientePrueba);
            await _context.SaveChangesAsync();

            _logger.LogInformation("✅ Inserción exitosa con ID manual: {Id}", clientePrueba.ID);

            // Limpiar inmediatamente
            _context.Clientes.Remove(clientePrueba);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Status = "✅ Inserción con ID manual exitosa",
                Message = "La tabla requiere asignación manual de ID",
                TestId = nextId,
                Conclusion = "El campo ID NO es IDENTITY en esta tabla"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en test de inserción manual");
            return StatusCode(500, new
            {
                Status = "❌ Error en inserción manual",
                Error = ex.Message,
                InnerError = ex.InnerException?.Message
            });
        }
    }
}
