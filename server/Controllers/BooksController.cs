using cms.Data;
using cms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class BooksController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetBooks()
    {
      return Ok(await database.Books.Include(b => b.Author).Include(b => b.Genre).ToListAsync());
    }

    [HttpGet]
    [Route("{bookId:int}")]
    public async Task<IActionResult> GetBook([FromRoute] int bookId)
    {
      var book = await database.Books.FindAsync(bookId);

      if (book == null)
      {
        return NotFound();
      }
      return Ok(book);
    }

    [HttpPost]
    public async Task<IActionResult> AddBook(AddBookRequest addBookRequest)
    {
      var newBook = new Book()
      {
        Name = addBookRequest.Name,
        GenreId = addBookRequest.GenreId,
        AuthorId = addBookRequest.AuthorId,
      };

      await database.Books.AddAsync(newBook);
      await database.SaveChangesAsync();

      return Ok(newBook);
    }

    [HttpDelete]
    [Route("{bookId:int}")]
    public async Task<IActionResult> DeleteBook([FromRoute] int bookId)
    {

      var book = await database.Books.FindAsync(bookId);
      if (book != null)
      {
        database.Remove(book);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}