using cms.Data;
using cms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UsersController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> LoginUser(LoginUserRequest loginUserRequest)
    {
      var user = await database.Users.Where(u => u.Email == loginUserRequest.Email).FirstAsync();

      if (user != null && user.Password == loginUserRequest.Password)
      {
        return Ok(user);
      }
      return NotFound();
    }

    [HttpPost]
    [Route("signup")]
    public async Task<IActionResult> AddEmployee(LoginUserRequest addEmployeeRequest)
    {
      var newUser = new User()
      {
        Email = addEmployeeRequest.Email,
        Password = addEmployeeRequest.Password,
      };

      await database.Users.AddAsync(newUser);
      await database.SaveChangesAsync();

      return Ok(newUser);
    }
  }
}