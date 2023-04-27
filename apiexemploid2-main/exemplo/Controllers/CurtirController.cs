using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[Authorize]
[ResponseCache(NoStore = true, Duration = 0, Location = ResponseCacheLocation.None)]
[ApiController]
public class CurtirController : ControllerBase
{
    private readonly DataContext context;

    public CurtirController(DataContext Context)
    {
        context = Context;
    }

    [HttpPost]
    public async Task<ActionResult> Post([FromBody] Curtir model)
    {
        try
        {
            context.Curtirs.Add(model);
            await context.SaveChangesAsync();
            return Ok("Obrigado por curtir");
        }
        catch
        {
            return BadRequest("Falha ao cutir a Noticia");
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Curtir>>> Get()
    {
        try
        {
            return Ok(await context.Curtirs.ToListAsync());
        }
        catch
        {
            return BadRequest("Erro ao obter as Curtirdas");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Curtir>> Get([FromRoute] int id)
    {
        try
        {
            if (await context.Curtirs.AnyAsync(p => p.Id == id))
                return Ok(await context.Curtirs.FindAsync(id));
            else
                return NotFound();
        }
        catch
        {
            return BadRequest();
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put([FromRoute] int id, [FromBody] Curtir model)
    {
        if (id != model.Id)
            return BadRequest();

        try
        {
            if (await context.Curtirs.AnyAsync(p => p.Id == id) == false)
                return NotFound();

            context.Curtirs.Update(model);
            await context.SaveChangesAsync();
            return Ok("Obrigado por curtir");
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
            Curtir model = await context.Curtirs.FindAsync(id);

            if (model == null)
                return NotFound();

            context.Curtirs.Remove(model);
            await context.SaveChangesAsync();
            return Ok("Que Triste!");
        }
        catch
        {
            return BadRequest("Falha ao remover o like");
        }
    }
}