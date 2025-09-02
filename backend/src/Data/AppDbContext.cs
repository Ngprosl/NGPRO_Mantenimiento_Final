using Microsoft.EntityFrameworkCore;
using NgproMantenimientos.Api.Models;
using NgproMantenimientos.Models;

namespace NgproMantenimientos.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Contrato> Contratos { get; set; }
    public DbSet<LineaContrato> LineasContrato { get; set; }
    public DbSet<Renovacion> Renovaciones { get; set; }
    public DbSet<Incidencia> Incidencias { get; set; }
    public DbSet<CampoPersonalizado> CamposPersonalizados { get; set; }
    public DbSet<ValorCampo> ValoresCampos { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Localizador> Localizadores { get; set; }
    public DbSet<Acuerdo> Acuerdos { get; set; } // CRM-ACUERDOS

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Cliente Configuration
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.ID);
            entity.ToTable(tb => tb.HasTrigger("TR_CLIENTES_AUDIT")); // Indica que tiene triggers
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
            entity.Property(e => e.PRESENTADA).HasDefaultValue(false);
            entity.Property(e => e.CONCESION).HasDefaultValue(false);
            entity.Property(e => e.DESCATALOGADO).HasDefaultValue(false);
        });

        // Contrato Configuration
        modelBuilder.Entity<Contrato>(entity =>
        {
            entity.HasKey(e => e.IdContrato);
            entity.Property(e => e.Descripcion).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Importe).HasColumnType("decimal(18,2)");
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(d => d.Cliente)
                  .WithMany(p => p.Contratos)
                  .HasForeignKey(d => d.ID)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => new { e.ID, e.Area }).HasDatabaseName("IX_Contrato_Cliente_Area");
            entity.HasIndex(e => e.Estado).HasDatabaseName("IX_Contrato_Estado");
            entity.HasIndex(e => e.FechaFin).HasDatabaseName("IX_Contrato_FechaFin");
        });

        // LineaContrato Configuration
        modelBuilder.Entity<LineaContrato>(entity =>
        {
            entity.HasKey(e => e.IdLinea);
            entity.Property(e => e.Concepto).IsRequired().HasMaxLength(500);
            entity.Property(e => e.PrecioUnitario).HasColumnType("decimal(18,2)");
            entity.Property(e => e.PorcentajeImpuestos).HasColumnType("decimal(5,2)").HasDefaultValue(21.0m);
            entity.Property(e => e.ImporteImpuestos).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Total).HasColumnType("decimal(18,2)");
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(d => d.Contrato)
                  .WithMany(p => p.LineasContrato)
                  .HasForeignKey(d => d.IdContrato)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Renovacion Configuration
        modelBuilder.Entity<Renovacion>(entity =>
        {
            entity.HasKey(e => e.IdRenovacion);
            entity.Property(e => e.Importe).HasColumnType("decimal(18,2)");
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(d => d.Contrato)
                  .WithMany(p => p.Renovaciones)
                  .HasForeignKey(d => d.IdContrato)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.FechaPrevista).HasDatabaseName("IX_Renovacion_FechaPrevista");
            entity.HasIndex(e => e.EstadoCobro).HasDatabaseName("IX_Renovacion_EstadoCobro");
        });

        // Incidencia Configuration
        modelBuilder.Entity<Incidencia>(entity =>
        {
            entity.HasKey(e => e.IdIncidencia);
            entity.Property(e => e.Titulo).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Descripcion).IsRequired();
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(d => d.Contrato)
                  .WithMany(p => p.Incidencias)
                  .HasForeignKey(d => d.IdContrato)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.Estado).HasDatabaseName("IX_Incidencia_Estado");
            entity.HasIndex(e => e.Prioridad).HasDatabaseName("IX_Incidencia_Prioridad");
            entity.HasIndex(e => e.Fecha).HasDatabaseName("IX_Incidencia_Fecha");
        });

        // CampoPersonalizado Configuration
        modelBuilder.Entity<CampoPersonalizado>(entity =>
        {
            entity.HasKey(e => e.IdCampo);
            entity.Property(e => e.NombreCampo).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("GETUTCDATE()");

            entity.HasIndex(e => new { e.Ambito, e.NombreCampo })
                  .IsUnique()
                  .HasDatabaseName("IX_CampoPersonalizado_Ambito_Nombre");
        });

        // ValorCampo Configuration
        modelBuilder.Entity<ValorCampo>(entity =>
        {
            entity.HasKey(e => e.IdValor);
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(d => d.Campo)
                  .WithMany(p => p.ValoresCampos)
                  .HasForeignKey(d => d.IdCampo)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.IdCampo, e.IdObjeto })
                  .IsUnique()
                  .HasDatabaseName("IX_ValorCampo_Campo_Objeto");
        });

        // Usuario Configuration
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Apellidos).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Activo).HasDefaultValue(true);
            entity.Property(e => e.IdiomaPreferido).HasDefaultValue("es");
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("GETUTCDATE()");

            entity.HasIndex(e => e.Email).IsUnique().HasDatabaseName("IX_Usuario_Email");
        });

        // Enum configurations
        modelBuilder.Entity<Contrato>()
            .Property(e => e.Area)
            .HasConversion<int>();

        modelBuilder.Entity<Contrato>()
            .Property(e => e.Periodicidad)
            .HasConversion<int>();

        modelBuilder.Entity<Contrato>()
            .Property(e => e.Estado)
            .HasConversion<int>();

        modelBuilder.Entity<Renovacion>()
            .Property(e => e.EstadoCobro)
            .HasConversion<int>();

        modelBuilder.Entity<Incidencia>()
            .Property(e => e.Tipo)
            .HasConversion<int>();

        modelBuilder.Entity<Incidencia>()
            .Property(e => e.Prioridad)
            .HasConversion<int>();

        modelBuilder.Entity<Incidencia>()
            .Property(e => e.Estado)
            .HasConversion<int>();

        modelBuilder.Entity<CampoPersonalizado>()
            .Property(e => e.Ambito)
            .HasConversion<int>();

        modelBuilder.Entity<CampoPersonalizado>()
            .Property(e => e.TipoDato)
            .HasConversion<int>();

        modelBuilder.Entity<Usuario>()
            .Property(e => e.Rol)
            .HasConversion<int>();

        // Localizador Configuration
        modelBuilder.Entity<Localizador>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            
            // Relación con Cliente
            entity.HasOne(l => l.Cliente)
                  .WithMany()
                  .HasForeignKey(l => l.ClienteId)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is Cliente || e.Entity is Contrato || e.Entity is Incidencia || e.Entity is Usuario)
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entityEntry in entries)
        {
            if (entityEntry.State == EntityState.Modified)
            {
                if (entityEntry.Entity is Contrato contrato)
                    contrato.FechaModificacion = DateTime.UtcNow;
                else if (entityEntry.Entity is Incidencia incidencia)
                    incidencia.FechaModificacion = DateTime.UtcNow;
                else if (entityEntry.Entity is Usuario usuario)
                    usuario.FechaModificacion = DateTime.UtcNow;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
