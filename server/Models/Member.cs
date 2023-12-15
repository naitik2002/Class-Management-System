namespace cms.Models
{
  public class Member
  {
    public int MemberId { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
    public required DateTime BirthDate { get; set; }
    public required string Name { get; set; }
    public required string Address { get; set; }
  }
}