using Microsoft.EntityFrameworkCore;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options)
        : base(options) { }

    public DbSet<Comentario> Comentarios { get; set; } = null!;

    public DbSet<Curtir> Curtirs {get;set;} = null!;

    public DbSet<Noticia> Noticias { get; set; } = null!;

    public DbSet<Usuario> Usuarios {get;set;} = null!;

    public DbSet<Validar> Validars {get;set;} = null!;
}