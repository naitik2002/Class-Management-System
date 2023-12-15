namespace cms.Models
{
  public class AddBookRequest
  {
    public int AuthorId { get; set; }
    public int GenreId { get; set; }
    public required string Name { get; set; }
  }
}