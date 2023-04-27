using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[Authorize]
[ResponseCache(NoStore = true, Duration = 0, Location = ResponseCacheLocation.None)]
[ApiController]
public class NoticiaController : ControllerBase
{
    private readonly DataContext context;

    public NoticiaController(DataContext Context)
    {
        context = Context;
    }

    [HttpPost]
    public async Task<ActionResult> Post([FromBody] Noticia model)
    {
        try
        {
            context.Noticias.Add(model);
            await context.SaveChangesAsync();
            return Ok("Noticia salva com sucesso");
        }
        catch
        {
            return BadRequest("Falha ao inserir a Noticia");
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Noticia>>> Get()
    {
        try
        {
            return Ok(await context.Noticias.ToListAsync());
        }
        catch
        {
            return BadRequest("Erro ao obter a Materia");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Noticia>> Get([FromRoute] int id)
    {
        try
        {
            if (await context.Noticias.AnyAsync(p => p.Id == id))
                return Ok(await context.Noticias.FindAsync(id));
            else
                return NotFound();
        }
        catch
        {
            return BadRequest();
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put([FromRoute] int id, [FromBody] Noticia model)
    {
        if (id != model.Id)
            return BadRequest();

        try
        {
            if (await context.Noticias.AnyAsync(p => p.Id == id) == false)
                return NotFound();

            context.Noticias.Update(model);
            await context.SaveChangesAsync();
            return Ok("Materia salva com sucesso");
        }
        catch
        {
            return BadRequest();
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete([FromRoute] int id)
    {
        try
        {
            Noticia model = await context.Noticias.FindAsync(id);

            if (model == null)
                return NotFound();

            context.Noticias.Remove(model);
            await context.SaveChangesAsync();
            return Ok("Materia  removida da base");
        }
        catch
        {
            return BadRequest("Falha ao remover a Materia");
        }
    }
}