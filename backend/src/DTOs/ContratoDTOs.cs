using System.ComponentModel.DataAnnotations;

namespace NgproMantenimientos.Api.DTOs;

public class CreateContratoRequest
{
    [Required(ErrorMessage = "El ID del cliente es obligatorio")]
    public int IdCliente { get; set; }

    public DateTime? FechaContrato { get; set; }
    
    [StringLength(500, ErrorMessage = "La descripción no puede exceder 500 caracteres")]
    public string? Descripcion { get; set; }
}

public class UpdateContratoRequest
{
    public int? IdCliente { get; set; }
    public DateTime? FechaContrato { get; set; }
    
    [StringLength(500, ErrorMessage = "La descripción no puede exceder 500 caracteres")]
    public string? Descripcion { get; set; }
}
