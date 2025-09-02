using Microsoft.EntityFrameworkCore;
using NgproMantenimientos.Api.Data;
using NgproMantenimientos.Api.Models;

namespace NgproMantenimientos.Api.Services;

public class ContratoService : IContratoService
{
    private readonly AppDbContext _context;

    public ContratoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Contrato>> GetAllAsync()
    {
        return await _context.Contratos
            .Include(c => c.Cliente)
            .Include(c => c.LineasContrato)
            .OrderByDescending(c => c.FechaCreacion)
            .ToListAsync();
    }

    public async Task<Contrato?> GetByIdAsync(int id)
    {
        return await _context.Contratos
            .Include(c => c.Cliente)
            .Include(c => c.LineasContrato)
            .Include(c => c.Renovaciones)
            .Include(c => c.Incidencias)
            .FirstOrDefaultAsync(c => c.IdContrato == id);
    }

    public async Task<Contrato> CreateAsync(Contrato contrato)
    {
        _context.Contratos.Add(contrato);
        await _context.SaveChangesAsync();
        return contrato;
    }

    public async Task<Contrato> UpdateAsync(Contrato contrato)
    {
        _context.Entry(contrato).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return contrato;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var contrato = await _context.Contratos.FindAsync(id);
        if (contrato == null) return false;

        contrato.Estado = EstadoContrato.Cancelado;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Contrato>> GetByClienteAsync(int clienteId)
    {
        return await _context.Contratos
            .Include(c => c.LineasContrato)
            .Where(c => c.ID == clienteId)
            .OrderByDescending(c => c.FechaCreacion)
            .ToListAsync();
    }

    public async Task<IEnumerable<Contrato>> GetPorVencerAsync(int dias = 30)
    {
        var fechaLimite = DateTime.UtcNow.AddDays(dias);
        
        return await _context.Contratos
            .Include(c => c.Cliente)
            .Where(c => c.Estado == EstadoContrato.Activo && c.FechaFin <= fechaLimite)
            .OrderBy(c => c.FechaFin)
            .ToListAsync();
    }
}
