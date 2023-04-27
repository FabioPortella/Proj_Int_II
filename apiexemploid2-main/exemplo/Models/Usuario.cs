using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Usuario
{
    public int? Id {get;set;}

    [Required]
    public string Nome {get;set;}

    [Required]
    [DataType(DataType.EmailAddress)]
    public string Email {get;set;}

    [Required]
    public string Senha {get;set;}

    [Required]
    public DateTime DataNascimento {get;set;}
    
    [NotMapped]
    public string? Token {get;set;}
    
    public Boolean Ativado {get; set;}

    public int TipoPessoa {get; set;}
}