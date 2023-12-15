using cms.Data;
using cms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class GenresController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetGenres()
    {
      return Ok(await database.Genres.ToListAsync());
    }

    [HttpGet]
    [Route("{genreId:int}")]
    public async Task<IActionResult> GetGenre([FromRoute] int genreId)
    {
      var genre = await database.Genres.FindAsync(genreId);

      if (genre == null)
      {
        return NotFound();
      }
      return Ok(genre);
    }

    [HttpPost]
    public async Task<IActionResult> AddGenre(AddGenreRequest addGenreRequest)
    {
      var newGenre = new Genre()
      {
        GenreName = addGenreRequest.GenreName,
      };

      await database.Genres.AddAsync(newGenre);
      await database.SaveChangesAsync();

      return Ok(newGenre);
    }

    [HttpDelete]
    [Route("{genreId:int}")]
    public async Task<IActionResult> DeleteGenre([FromRoute] int genreId)
    {

      var genre = await database.Genres.FindAsync(genreId);
      if (genre != null)
      {
        database.Remove(genre);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}