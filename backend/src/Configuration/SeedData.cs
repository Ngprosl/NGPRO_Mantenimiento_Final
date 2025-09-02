using NgproMantenimientos.Api.Data;
using NgproMantenimientos.Api.Models;
using BCrypt.Net;

namespace NgproMantenimientos.Api.Configuration;

public static class SeedData
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Crear usuario administrador por defecto
        if (!context.Usuarios.Any())
        {
            var adminUser = new Usuario
            {
                Nombre = "Administrador",
                Apellidos = "Sistema",
                Email = "admin@ngpro.es",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Rol = RolUsuario.Admin,
                Activo = true,
                IdiomaPreferido = "es"
            };

            context.Usuarios.Add(adminUser);
        }

        // Crear cliente de ejemplo
        if (!context.Clientes.Any())
        {
            var clienteEjemplo = new Cliente
            {
                NOMBRE = "Empresa Ejemplo S.L.",
                DNICIF = "B12345678",
                EMAIL1 = "contacto@empresaejemplo.com",
                TELEF1 = "912345678",
                DIRECCION = "Calle Principal, 123",
                POBLACION = "Madrid",
                CODPOSTAL = "28001",
                PROVINCIA = "Madrid",
                PAIS = "España",
                DESCATALOGADO = false,
                OBSERVACIONES = "Cliente de ejemplo para testing"
            };

            context.Clientes.Add(clienteEjemplo);
        }

        // Crear campos personalizados de ejemplo
        if (!context.CamposPersonalizados.Any())
        {
            var campos = new List<CampoPersonalizado>
            {
                new CampoPersonalizado
                {
                    Ambito = AmbitoCampo.Cliente,
                    NombreCampo = "SectorEmpresa",
                    EtiquetaCampo = "Sector de la Empresa",
                    TipoDato = TipoDatoCampo.Lista,
                    OpcionesJSON = "[\"Tecnología\",\"Sanidad\",\"Educación\",\"Industria\",\"Servicios\"]",
                    EsObligatorio = false,
                    Activo = true,
                    Orden = 1,
                    Descripcion = "Sector principal de actividad de la empresa"
                },
                new CampoPersonalizado
                {
                    Ambito = AmbitoCampo.Contrato,
                    NombreCampo = "NumeroLicencias",
                    EtiquetaCampo = "Número de Licencias",
                    TipoDato = TipoDatoCampo.Numero,
                    EsObligatorio = true,
                    Activo = true,
                    Orden = 1,
                    Descripcion = "Cantidad de licencias incluidas en el contrato"
                },
                new CampoPersonalizado
                {
                    Ambito = AmbitoCampo.Incidencia,
                    NombreCampo = "TiempoEstimado",
                    EtiquetaCampo = "Tiempo Estimado (horas)",
                    TipoDato = TipoDatoCampo.Numero,
                    EsObligatorio = false,
                    Activo = true,
                    Orden = 1,
                    Descripcion = "Tiempo estimado de resolución en horas"
                }
            };

            context.CamposPersonalizados.AddRange(campos);
        }

        await context.SaveChangesAsync();
    }
}
