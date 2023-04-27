using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Validar
{
    public int? Id {get;set;}

    [Required]
    public string CodAtiva {get;set;}

    [Required]
    public int Autor {get;set;}
    
    [Required]
    public Boolean Ativo {get; set;}
}