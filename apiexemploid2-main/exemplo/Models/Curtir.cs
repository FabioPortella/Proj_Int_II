using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Curtir
{
    public int? Id {get;set;}

    [Required]
    public int Noticia {get;set;}

    [Required]
    public int Autor {get;set;}

    public int tipo {get;set;}
}