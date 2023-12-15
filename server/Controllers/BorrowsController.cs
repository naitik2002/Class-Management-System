using cms.Data;
using cms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class BorrowsController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetBorrows()
    {
      return Ok(await database.Borrows.Include(b => b.Book).Include(b => b.Member).ToListAsync());
    }

    [HttpGet]
    [Route("{borrowId:int}")]
    public async Task<IActionResult> GetBorrow([FromRoute] int borrowId)
    {
      var borrow = await database.Borrows.FindAsync(borrowId);

      if (borrow == null)
      {
        return NotFound();
      }
      return Ok(borrow);
    }

    [HttpPost]
    public async Task<IActionResult> AddBorrow(AddBorrowRequest addBorrowRequest)
    {
      var newBorrow = new Borrow()
      {
        BookId = addBorrowRequest.BookId,
        MemberId = addBorrowRequest.MemberId,
        BorrowedOn = addBorrowRequest.BorrowedOn,
      };

      await database.Borrows.AddAsync(newBorrow);
      await database.SaveChangesAsync();

      return Ok(newBorrow);
    }

    [HttpPut]
    [Route("{borrowId:int}")]
    public async Task<IActionResult> UpdateBorrow([FromRoute] int borrowId)
    {
      var borrow = await database.Borrows.FindAsync(borrowId);

      if (borrow != null)
      {
        borrow.IsReturned = true;

        await database.SaveChangesAsync();
        return Ok(borrow);
      }
      return NotFound();
    }


    [HttpDelete]
    [Route("{borrowId:int}")]
    public async Task<IActionResult> DeleteBorrow([FromRoute] int borrowId)
    {

      var borrow = await database.Borrows.FindAsync(borrowId);
      if (borrow != null)
      {
        database.Remove(borrow);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}