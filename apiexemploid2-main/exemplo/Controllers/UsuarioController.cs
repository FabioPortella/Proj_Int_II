using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Net.Mail;
using System.Net;

[Route("api/[controller]")]
[Authorize]
[ResponseCache(NoStore = true, Duration = 0, Location = ResponseCacheLocation.None)]
[ApiController]
public class UsuarioController : ControllerBase
{
    private readonly DataContext context;

    public UsuarioController(DataContext Context)
    {
        context = Context;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult> Post([FromBody] Usuario model)
    {
        try
        {
            if(await context.Usuarios.AnyAsync()){
                if (await context.Usuarios.AnyAsync(p => p.Email == model.Email))
                    return BadRequest("Já existe usuário com o e-mail informado");
                model.Ativado = false;
                model.TipoPessoa = 1;
                model.Senha = ObterSenha(model);
                context.Usuarios.Add(model);
                await context.SaveChangesAsync();
                
                //emailAtivaUser ();
                return Ok("Usuário salvo com sucesso");
            }
            else{
                if (await context.Usuarios.AnyAsync(p => p.Email == model.Email))
                    return BadRequest("Já existe usuário com o e-mail informado");

                model.Senha = ObterSenha(model);
                context.Usuarios.Add(model);
                await context.SaveChangesAsync();
                //emailAtivaUser ();
                return Ok("Usuário salvo com sucesso");
            }
        }
        catch(Exception e)
        {

            return BadRequest("Falha ao inserir o usuário informado" + e.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("autenticar")]
    public async Task<ActionResult> Autenticar([FromBody] Usuario usuario)
    {
        try
        {
            usuario.Senha = ObterSenha(usuario);
            Usuario autenticado = await context.Usuarios.FirstOrDefaultAsync(p => p.Email == usuario.Email && p.Senha == usuario.Senha);

            if (autenticado == null)
                return BadRequest("Usuário inválido");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue("Secret", ""));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                new Claim(ClaimTypes.Sid, autenticado.Id.ToString()),
                new Claim(ClaimTypes.Name, autenticado.Nome),
                new Claim(ClaimTypes.Email, autenticado.Email)
                }),
                Expires = DateTime.UtcNow.AddSeconds(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };

            if (autenticado.Email.EndsWith("@ifsp.edu.br"))
                tokenDescriptor.Subject.AddClaim(new Claim(ClaimTypes.Role, "Admin"));

            var token = tokenHandler.CreateToken(tokenDescriptor);
            autenticado.Senha = "";
            autenticado.Token = tokenHandler.WriteToken(token);
            
            return Ok(autenticado);
        }
        catch
        {
            return BadRequest();
        }
    }

    [ResponseCache(NoStore = true, Duration = 0, Location = ResponseCacheLocation.None)]
    [Authorize]
    [HttpGet("validartoken")]
    public ActionResult ValidarToken()
    {
        return Ok();
    }

    [NonAction]
    private static string Hash(string password)
    {
        HashAlgorithm hasher = HashAlgorithm.Create(HashAlgorithmName.SHA512.Name);
        byte[] stringBytes = Encoding.ASCII.GetBytes(password);
        byte[] byteArray = hasher.ComputeHash(stringBytes);

        StringBuilder stringBuilder = new StringBuilder();
        foreach (byte b in byteArray)
        {
            stringBuilder.AppendFormat("{0:x2}", b);
        }

        return stringBuilder.ToString();
    }

    [NonAction]
    private static string ObterSenha(Usuario usuario)
    {
        if (usuario == null || usuario.Senha == null || usuario.Senha.Trim() == "")
            throw new Exception();

        string retorno = usuario.Senha;

        retorno = "djfs0dj87h78" + retorno;
        retorno = Hash(retorno);
        retorno = retorno + "87sdfhns78dfh8";
        retorno = Hash(retorno);

        return retorno;
    }
    [NonAction]
    private  static Boolean EnviarEmail (String email_destino, String assunto, String mensagem){

        // Configurar as informações do e-mail
        MailMessage message = new MailMessage();
        message.From = new MailAddress("portskoll@gmail.com");
        message.To.Add(email_destino);
        message.Subject = assunto;
        message.Body = mensagem;

        // Configurar o cliente SMTP e enviar o e-mail
        try
            {
                using (var client = new SmtpClient("smtp.gmail.com", 465))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential("portskoll@gmail.com", "obabwdsfolpzejew");
                    //message = new MailMessage("apinext@mundotela.net", email, "Subject", text);
                    client.Send(message);
                }
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine("Error sending email: " + e.Message);
                return false;
            }
    }
     [NonAction]
    private  static Boolean emailUserPass(){
        EnviarEmail ("String", "String", "assunto");
        return false;
    }
     [NonAction]
    private  static Boolean trocaEmail(){
        EnviarEmail ("String", "String", "assunto");
        return false;
    }
     [NonAction]
    private  static Boolean emailTrocaSenha(){
        EnviarEmail ("String", "String", "assunto");
        return false;
    } 
    [NonAction]
    private  static Boolean emailAtivaUser(){
        EnviarEmail ("email", "assunto", "mensagem");
        return false;
    }
}


