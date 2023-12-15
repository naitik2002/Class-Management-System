using cms.Models;
using Microsoft.EntityFrameworkCore;

namespace cms.Data
{
  public class Database(DbContextOptions options) : DbContext(options)
  {
    public DbSet<Member> Members { get; set; }
    public DbSet<Author> Authors { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<Borrow> Borrows { get; set; }
    public DbSet<User> Users { get; set; }
  }
}