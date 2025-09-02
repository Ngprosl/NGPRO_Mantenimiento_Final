using Microsoft.EntityFrameworkCore;
using NgproMantenimientos.Api.Data;
using NgproMantenimientos.Api.Models;

namespace NgproMantenimientos.Api.Services;

public class RenovacionService : IRenovacionService
{
    private readonly AppDbContext _context;

    public RenovacionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Renovacion>> GetByContratoAsync(int contratoId)
    {
        return await _context.Renovaciones
            .Where(r => r.IdContrato == contratoId)
            .OrderByDescending(r => r.FechaPrevista)
            .ToListAsync();
    }

    public async Task<Renovacion?> GetByIdAsync(int id)
    {
        return await _context.Renovaciones
            .Include(r => r.Contrato)
            .ThenInclude(c => c.Cliente)
            .FirstOrDefaultAsync(r => r.IdRenovacion == id);
    }

    public async Task<Renovacion> CreateAsync(Renovacion renovacion)
    {
        _context.Renovaciones.Add(renovacion);
        await _context.SaveChangesAsync();
        return renovacion;
    }

    public async Task<Renovacion> UpdateAsync(Renovacion renovacion)
    {
        _context.Entry(renovacion).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return renovacion;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var renovacion = await _context.Renovaciones.FindAsync(id);
        if (renovacion == null) return false;

        _context.Renovaciones.Remove(renovacion);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Renovacion>> GetPendientesAsync()
    {
        return await _context.Renovaciones
            .Include(r => r.Contrato)
            .ThenInclude(c => c.Cliente)
            .Where(r => r.EstadoCobro == EstadoCobro.Pendiente)
            .OrderBy(r => r.FechaPrevista)
            .ToListAsync();
    }
}

public class IncidenciaService : IIncidenciaService
{
    private readonly AppDbContext _context;

    public IncidenciaService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Incidencia>> GetAllAsync()
    {
        return await _context.Incidencias
            .Include(i => i.Contrato)
            .ThenInclude(c => c.Cliente)
            .OrderByDescending(i => i.Fecha)
            .ToListAsync();
    }

    public async Task<Incidencia?> GetByIdAsync(int id)
    {
        return await _context.Incidencias
            .Include(i => i.Contrato)
            .ThenInclude(c => c.Cliente)
            .FirstOrDefaultAsync(i => i.IdIncidencia == id);
    }

    public async Task<Incidencia> CreateAsync(Incidencia incidencia)
    {
        _context.Incidencias.Add(incidencia);
        await _context.SaveChangesAsync();
        return incidencia;
    }

    public async Task<Incidencia> UpdateAsync(Incidencia incidencia)
    {
        _context.Entry(incidencia).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return incidencia;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var incidencia = await _context.Incidencias.FindAsync(id);
        if (incidencia == null) return false;

        _context.Incidencias.Remove(incidencia);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Incidencia>> GetByContratoAsync(int contratoId)
    {
        return await _context.Incidencias
            .Where(i => i.IdContrato == contratoId)
            .OrderByDescending(i => i.Fecha)
            .ToListAsync();
    }
}

public class CampoPersonalizadoService : ICampoPersonalizadoService
{
    private readonly AppDbContext _context;

    public CampoPersonalizadoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CampoPersonalizado>> GetByAmbitoAsync(AmbitoCampo ambito)
    {
        return await _context.CamposPersonalizados
            .Where(c => c.Ambito == ambito && c.Activo)
            .OrderBy(c => c.Orden)
            .ThenBy(c => c.NombreCampo)
            .ToListAsync();
    }

    public async Task<CampoPersonalizado?> GetByIdAsync(int id)
    {
        return await _context.CamposPersonalizados.FindAsync(id);
    }

    public async Task<CampoPersonalizado> CreateAsync(CampoPersonalizado campo)
    {
        _context.CamposPersonalizados.Add(campo);
        await _context.SaveChangesAsync();
        return campo;
    }

    public async Task<CampoPersonalizado> UpdateAsync(CampoPersonalizado campo)
    {
        _context.Entry(campo).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return campo;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var campo = await _context.CamposPersonalizados.FindAsync(id);
        if (campo == null) return false;

        campo.Activo = false; // Soft delete
        await _context.SaveChangesAsync();
        return true;
    }
}
