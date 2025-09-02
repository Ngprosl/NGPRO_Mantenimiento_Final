using System.ComponentModel.DataAnnotations;

namespace NgproMantenimientos.Api.DTOs;

public class CreateClienteRequest
{
    [Required(ErrorMessage = "El nombre es obligatorio")]
    [StringLength(100, ErrorMessage = "El nombre no puede exceder 100 caracteres")]
    public string Nombre { get; set; } = string.Empty;

    [StringLength(100, ErrorMessage = "El DNI/CIF no puede exceder 100 caracteres")]
    public string? DniCif { get; set; }

    [StringLength(100, ErrorMessage = "La dirección no puede exceder 100 caracteres")]
    public string? Direccion { get; set; }

    [StringLength(100, ErrorMessage = "La población no puede exceder 100 caracteres")]
    public string? Poblacion { get; set; }

    [StringLength(100, ErrorMessage = "La provincia no puede exceder 100 caracteres")]
    public string? Provincia { get; set; }

    [StringLength(100, ErrorMessage = "El código postal no puede exceder 100 caracteres")]
    public string? CodPostal { get; set; }

    [StringLength(100, ErrorMessage = "El país no puede exceder 100 caracteres")]
    public string? Pais { get; set; }

    [StringLength(100, ErrorMessage = "El teléfono 1 no puede exceder 100 caracteres")]
    public string? Telef1 { get; set; }

    [StringLength(100, ErrorMessage = "El teléfono 2 no puede exceder 100 caracteres")]
    public string? Telef2 { get; set; }

    [StringLength(100, ErrorMessage = "El email 1 no puede exceder 100 caracteres")]
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    public string? Email1 { get; set; }

    [StringLength(100, ErrorMessage = "El email 2 no puede exceder 100 caracteres")]
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    public string? Email2 { get; set; }

    public string? Observaciones { get; set; }

    [StringLength(100, ErrorMessage = "El nombre comercial no puede exceder 100 caracteres")]
    public string? NombreComercial { get; set; }

    [StringLength(100, ErrorMessage = "El comercial no puede exceder 100 caracteres")]
    public string? Comercial { get; set; }

    public bool? Descatalogado { get; set; }
}

public class UpdateClienteRequest
{
    [StringLength(100, ErrorMessage = "El nombre no puede exceder 100 caracteres")]
    public string? Nombre { get; set; }

    [StringLength(100, ErrorMessage = "El DNI/CIF no puede exceder 100 caracteres")]
    public string? DniCif { get; set; }

    [StringLength(100, ErrorMessage = "La dirección no puede exceder 100 caracteres")]
    public string? Direccion { get; set; }

    [StringLength(100, ErrorMessage = "La población no puede exceder 100 caracteres")]
    public string? Poblacion { get; set; }

    [StringLength(100, ErrorMessage = "La provincia no puede exceder 100 caracteres")]
    public string? Provincia { get; set; }

    [StringLength(100, ErrorMessage = "El código postal no puede exceder 100 caracteres")]
    public string? CodPostal { get; set; }

    [StringLength(100, ErrorMessage = "El país no puede exceder 100 caracteres")]
    public string? Pais { get; set; }

    [StringLength(100, ErrorMessage = "El teléfono 1 no puede exceder 100 caracteres")]
    public string? Telef1 { get; set; }

    [StringLength(100, ErrorMessage = "El teléfono 2 no puede exceder 100 caracteres")]
    public string? Telef2 { get; set; }

    [StringLength(100, ErrorMessage = "El email 1 no puede exceder 100 caracteres")]
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    public string? Email1 { get; set; }

    [StringLength(100, ErrorMessage = "El email 2 no puede exceder 100 caracteres")]
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    public string? Email2 { get; set; }

    public string? Observaciones { get; set; }

    [StringLength(100, ErrorMessage = "El nombre comercial no puede exceder 100 caracteres")]
    public string? NombreComercial { get; set; }

    [StringLength(100, ErrorMessage = "El comercial no puede exceder 100 caracteres")]
    public string? Comercial { get; set; }

    public bool? Descatalogado { get; set; }
}
