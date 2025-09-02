using NgproMantenimientos.Api.Models;

namespace NgproMantenimientos.Api.Services;

public interface IClienteService
{
    Task<IEnumerable<Cliente>> GetAllAsync();
    Task<Cliente?> GetByIdAsync(int id);
    Task<Cliente> CreateAsync(Cliente cliente);
    Task<Cliente> UpdateAsync(Cliente cliente);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}

public interface IContratoService
{
    Task<IEnumerable<Contrato>> GetAllAsync();
    Task<Contrato?> GetByIdAsync(int id);
    Task<Contrato> CreateAsync(Contrato contrato);
    Task<Contrato> UpdateAsync(Contrato contrato);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<Contrato>> GetByClienteAsync(int clienteId);
    Task<IEnumerable<Contrato>> GetPorVencerAsync(int dias = 30);
}

public interface IRenovacionService
{
    Task<IEnumerable<Renovacion>> GetByContratoAsync(int contratoId);
    Task<Renovacion?> GetByIdAsync(int id);
    Task<Renovacion> CreateAsync(Renovacion renovacion);
    Task<Renovacion> UpdateAsync(Renovacion renovacion);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<Renovacion>> GetPendientesAsync();
}

public interface IIncidenciaService
{
    Task<IEnumerable<Incidencia>> GetAllAsync();
    Task<Incidencia?> GetByIdAsync(int id);
    Task<Incidencia> CreateAsync(Incidencia incidencia);
    Task<Incidencia> UpdateAsync(Incidencia incidencia);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<Incidencia>> GetByContratoAsync(int contratoId);
}

public interface ICampoPersonalizadoService
{
    Task<IEnumerable<CampoPersonalizado>> GetByAmbitoAsync(AmbitoCampo ambito);
    Task<CampoPersonalizado?> GetByIdAsync(int id);
    Task<CampoPersonalizado> CreateAsync(CampoPersonalizado campo);
    Task<CampoPersonalizado> UpdateAsync(CampoPersonalizado campo);
    Task<bool> DeleteAsync(int id);
}

public interface IAuthService
{
    Task<string?> AuthenticateAsync(string email, string password);
    Task<Usuario?> GetCurrentUserAsync();
    Task<bool> ValidateTokenAsync(string token);
    string GenerateJwtToken(Usuario usuario);
}

public interface IReportService
{
    Task<byte[]> GenerateContratoPdfAsync(int contratoId);
    Task<byte[]> GenerateContratosExcelAsync(DateTime fechaInicio, DateTime fechaFin);
    Task<byte[]> GenerateRenovacionesReportAsync(int meses = 3);
}

public interface IDashboardService
{
    Task<object> GetKpisAsync();
    Task<object> GetChartDataAsync();
    Task<object> GetAlertsAsync();
}
