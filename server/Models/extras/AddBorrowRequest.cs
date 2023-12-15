namespace cms.Models
{
  public class AddBorrowRequest
  {
    public int MemberId { get; set; }
    public int BookId { get; set; }
    public DateTime BorrowedOn { get; set; }
  }
}