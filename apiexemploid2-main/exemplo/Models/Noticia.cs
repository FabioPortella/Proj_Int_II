using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Noticia
{
    public int? Id {get;set;}

    [Required]
    public string Titulo {get;set;}

    [Required]
    public string Subtitulo {get;set;}

    [Required]
    public int Autor {get;set;}

    [Required]
    public DateTime Data {get;set;}

    [Required]
    public string Texto {get;set;}
}