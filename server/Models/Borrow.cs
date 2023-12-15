namespace cms.Models
{
  public class Borrow
  {
    public int BorrowId { get; set; }
    public int MemberId { get; set; }
    public int BookId { get; set; }
    public DateTime BorrowedOn { get; set; }
    public bool IsReturned { get; set; }

    public Member? Member { get; set; }
    public Book? Book { get; set; }
  }
}