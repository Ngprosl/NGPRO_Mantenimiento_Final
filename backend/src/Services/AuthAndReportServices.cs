using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using NgproMantenimientos.Api.Data;
using NgproMantenimientos.Api.Models;
using BCrypt.Net;

namespace NgproMantenimientos.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuthService(AppDbContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<string?> AuthenticateAsync(string email, string password)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email && u.Activo);

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(password, usuario.PasswordHash))
        {
            return null;
        }

        // Actualizar último acceso
        usuario.UltimoAcceso = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return GenerateJwtToken(usuario);
    }

    public async Task<Usuario?> GetCurrentUserAsync()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
        {
            return null;
        }

        return await _context.Usuarios.FindAsync(userId);
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"]!);
            
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["JwtSettings:Audience"],
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return true;
        }
        catch
        {
            return false;
        }
    }

    public string GenerateJwtToken(Usuario usuario)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"]!);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.IdUsuario.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Name, usuario.NombreCompleto),
                new Claim(ClaimTypes.Role, usuario.Rol.ToString()),
                new Claim("IdUsuario", usuario.IdUsuario.ToString()),
                new Claim("Rol", usuario.Rol.ToString())
            }),
            Expires = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["JwtSettings:ExpirationInMinutes"]!)),
            Issuer = _configuration["JwtSettings:Issuer"],
            Audience = _configuration["JwtSettings:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<object> GetKpisAsync()
    {
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1);
        var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

        var kpis = new
        {
            ContratosActivos = await _context.Contratos.CountAsync(c => c.Estado == EstadoContrato.Activo),
            IngresosMensuales = await _context.Renovaciones
                .Where(r => r.FechaCobro >= startOfMonth && r.FechaCobro <= endOfMonth && r.EstadoCobro == EstadoCobro.Cobrado)
                .SumAsync(r => r.Importe),
            IncidenciasAbiertas = await _context.Incidencias.CountAsync(i => i.Estado == EstadoIncidencia.Abierta),
            ContratosPorVencer30 = await _context.Contratos.CountAsync(c => c.Estado == EstadoContrato.Activo && c.FechaFin <= now.AddDays(30)),
            ClientesActivos = await _context.Clientes.CountAsync(c => c.DESCATALOGADO != true),
            CobrosPendientes = await _context.Renovaciones.CountAsync(r => r.EstadoCobro == EstadoCobro.Pendiente)
        };

        return kpis;
    }

    public async Task<object> GetChartDataAsync()
    {
        // Datos de ejemplo para gráficos
        var chartData = new
        {
            IngresosPorArea = await _context.Contratos
                .GroupBy(c => c.Area)
                .Select(g => new { Area = g.Key.ToString(), Total = g.Sum(c => c.Importe) })
                .ToListAsync(),
                
            ContratosPorMes = await _context.Contratos
                .Where(c => c.FechaCreacion >= DateTime.UtcNow.AddMonths(-12))
                .GroupBy(c => new { c.FechaCreacion.Year, c.FechaCreacion.Month })
                .Select(g => new { 
                    Mes = $"{g.Key.Year}-{g.Key.Month:D2}", 
                    Cantidad = g.Count() 
                })
                .OrderBy(x => x.Mes)
                .ToListAsync()
        };

        return chartData;
    }

    public async Task<object> GetAlertsAsync()
    {
        var now = DateTime.UtcNow;
        
        var alerts = new
        {
            ContratosPorVencer = await _context.Contratos
                .Include(c => c.Cliente)
                .Where(c => c.Estado == EstadoContrato.Activo && c.FechaFin <= now.AddDays(30))
                .Select(c => new { c.IdContrato, c.Cliente.NOMBRE, c.FechaFin, c.Area })
                .ToListAsync(),
                
            CobrosPendientes = await _context.Renovaciones
                .Include(r => r.Contrato.Cliente)
                .Where(r => r.EstadoCobro == EstadoCobro.Pendiente && r.FechaPrevista <= now.AddDays(15))
                .Select(r => new { r.IdRenovacion, r.Contrato.Cliente.NOMBRE, r.FechaPrevista, r.Importe })
                .ToListAsync()
        };

        return alerts;
    }
}

public class ReportService : IReportService
{
    private readonly AppDbContext _context;

    public ReportService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<byte[]> GenerateContratoPdfAsync(int contratoId)
    {
        // Implementación básica - se puede mejorar con iTextSharp
        var contrato = await _context.Contratos
            .Include(c => c.Cliente)
            .Include(c => c.LineasContrato)
            .FirstOrDefaultAsync(c => c.IdContrato == contratoId);

        if (contrato == null)
            throw new ArgumentException("Contrato no encontrado");

        // Por ahora retornamos datos simulados
        var content = $"Contrato: {contrato.Descripcion}\nCliente: {contrato.Cliente.NOMBRE}";
        return Encoding.UTF8.GetBytes(content);
    }

    public async Task<byte[]> GenerateContratosExcelAsync(DateTime fechaInicio, DateTime fechaFin)
    {
        // Implementación básica - se puede mejorar con ClosedXML
        var contratos = await _context.Contratos
            .Include(c => c.Cliente)
            .Where(c => c.FechaCreacion >= fechaInicio && c.FechaCreacion <= fechaFin)
            .ToListAsync();

        // Por ahora retornamos CSV simple
        var csv = "Id,Cliente,Area,Importe,FechaInicio,FechaFin\n";
        foreach (var contrato in contratos)
        {
            csv += $"{contrato.IdContrato},{contrato.Cliente.NOMBRE},{contrato.Area},{contrato.Importe},{contrato.FechaInicio:yyyy-MM-dd},{contrato.FechaFin:yyyy-MM-dd}\n";
        }

        return Encoding.UTF8.GetBytes(csv);
    }

    public async Task<byte[]> GenerateRenovacionesReportAsync(int meses = 3)
    {
        var fechaLimite = DateTime.UtcNow.AddMonths(meses);
        
        var renovaciones = await _context.Renovaciones
            .Include(r => r.Contrato.Cliente)
            .Where(r => r.FechaPrevista <= fechaLimite)
            .ToListAsync();

        var content = $"Reporte de Renovaciones - Próximos {meses} meses\n";
        foreach (var renovacion in renovaciones)
        {
            content += $"{renovacion.Contrato.Cliente.NOMBRE} - {renovacion.FechaPrevista:yyyy-MM-dd} - {renovacion.Importe:C}\n";
        }

        return Encoding.UTF8.GetBytes(content);
    }
}
