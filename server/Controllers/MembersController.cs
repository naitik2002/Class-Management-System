using cms.Data;
using cms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class MembersController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetMembers()
    {
      return Ok(await database.Members.ToListAsync());
    }

    [HttpGet]
    [Route("{memberId:int}")]
    public async Task<IActionResult> GetMember([FromRoute] int memberId)
    {
      var member = await database.Members.FindAsync(memberId);

      if (member == null)
      {
        return NotFound();
      }
      return Ok(member);
    }

    [HttpPost]
    public async Task<IActionResult> AddMember(AddMemberRequest addMemberRequest)
    {
      var newMember = new Member()
      {
        Name = addMemberRequest.Name,
        Address = addMemberRequest.Address,
        BirthDate = addMemberRequest.BirthDate,
        Email = addMemberRequest.Email,
        PhoneNumber = addMemberRequest.PhoneNumber,
      };

      await database.Members.AddAsync(newMember);
      await database.SaveChangesAsync();

      return Ok(newMember);
    }

    [HttpPut]
    [Route("{memberId:int}")]
    public async Task<IActionResult> UpdateMember([FromRoute] int memberId, UpdateMemberRequest updateMemberRequest)
    {
      var member = await database.Members.FindAsync(memberId);

      if (member != null)
      {
        member.Name = updateMemberRequest.Name;
        member.Address = updateMemberRequest.Address;
        member.BirthDate = updateMemberRequest.BirthDate;
        member.Email = updateMemberRequest.Email;
        member.PhoneNumber = updateMemberRequest.PhoneNumber;

        await database.SaveChangesAsync();
        return Ok(member);
      }
      return NotFound();
    }


    [HttpDelete]
    [Route("{memberId:int}")]
    public async Task<IActionResult> DeleteMember([FromRoute] int memberId)
    {

      var member = await database.Members.FindAsync(memberId);
      if (member != null)
      {
        database.Remove(member);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}