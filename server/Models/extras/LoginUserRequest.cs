namespace cms.Models
{
  public class LoginUserRequest
  {
    public required string Email { get; set; }
    public required string Password { get; set; }
  }
}