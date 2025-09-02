using Microsoft.EntityFrameworkCore;
using NgproMantenimientos.Api.Models;

namespace NgproMantenimientos.Api.Data;

public class ClientesDbContext : DbContext
{
    public ClientesDbContext(DbContextOptions<ClientesDbContext> options) : base(options)
    {
    }

    // Solo tabla Clientes
    public DbSet<Cliente> Clientes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuración específica para la tabla Clientes
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("Clientes");
            entity.HasKey(e => e.ID);
            
            // Configurar para evitar problemas con triggers
            entity.Property(e => e.ID).ValueGeneratedOnAdd();
            
            entity.Property(e => e.NOMBRE).IsRequired().HasMaxLength(200);
            entity.Property(e => e.DNICIF).HasMaxLength(20);
            entity.Property(e => e.EMAIL1).HasMaxLength(200);
            entity.Property(e => e.EMAIL2).HasMaxLength(200);
            entity.Property(e => e.TELEF1).HasMaxLength(20);
            entity.Property(e => e.TELEF2).HasMaxLength(20);
            entity.Property(e => e.DIRECCION).HasMaxLength(500);
            entity.Property(e => e.POBLACION).HasMaxLength(100);
            entity.Property(e => e.PROVINCIA).HasMaxLength(100);
            entity.Property(e => e.CODPOSTAL).HasMaxLength(10);
            entity.Property(e => e.PAIS).HasMaxLength(100);
            entity.Property(e => e.OBSERVACIONES).HasMaxLength(1000);
            entity.Property(e => e.NOMBRECOMERCIAL).HasMaxLength(200);
            entity.Property(e => e.SEGMENTO).HasMaxLength(100);
            entity.Property(e => e.CNAE).HasMaxLength(50);
            entity.Property(e => e.IAE).HasMaxLength(50);
            entity.Property(e => e.COMERCIAL).HasMaxLength(100);
            entity.Property(e => e.REPLEGAL).HasMaxLength(200);
            entity.Property(e => e.REPLEGALCARGO).HasMaxLength(100);
            entity.Property(e => e.REPLEGALDNI).HasMaxLength(20);
            entity.Property(e => e.REPLEGALTELEF).HasMaxLength(20);
            entity.Property(e => e.NOTARIO).HasMaxLength(200);
            entity.Property(e => e.PROTOCOLO).HasMaxLength(50);
            entity.Property(e => e.TEXTLEAD).HasMaxLength(1000);
            entity.Property(e => e.NUMROPO).HasMaxLength(50);
            entity.Property(e => e.PROVINCIA).HasMaxLength(100);
            entity.Property(e => e.CODPOSTAL).HasMaxLength(10);
        });
    }
}
