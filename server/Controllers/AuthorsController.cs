using cms.Data;
using cms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthorsController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetAuthors()
    {
      return Ok(await database.Authors.ToListAsync());
    }

    [HttpGet]
    [Route("{authorId:int}")]
    public async Task<IActionResult> GetAuthor([FromRoute] int authorId)
    {
      var author = await database.Authors.FindAsync(authorId);

      if (author == null)
      {
        return NotFound();
      }
      return Ok(author);
    }

    [HttpPost]
    public async Task<IActionResult> AddAuthor(AddAuthorRequest addAuthorRequest)
    {
      var newAuthor = new Author()
      {
        Name = addAuthorRequest.Name,
        Nationality = addAuthorRequest.Nationality,
      };

      await database.Authors.AddAsync(newAuthor);
      await database.SaveChangesAsync();

      return Ok(newAuthor);
    }

    [HttpDelete]
    [Route("{authorId:int}")]
    public async Task<IActionResult> DeleteAuthor([FromRoute] int authorId)
    {

      var author = await database.Authors.FindAsync(authorId);
      if (author != null)
      {
        database.Remove(author);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}