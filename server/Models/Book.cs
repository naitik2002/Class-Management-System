namespace cms.Models
{
  public class Book
  {
    public int BookId { get; set; }
    public int AuthorId { get; set; }
    public int GenreId { get; set; }
    public required string Name { get; set; }

    public Author? Author { get; set; }
    public Genre? Genre { get; set; }
  }
}