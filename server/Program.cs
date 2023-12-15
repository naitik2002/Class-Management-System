using cms.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

// options.UseSqlServer(builder.Configuration.GetConnectionString("CmsConnectionString"))
builder.Services.AddDbContext<Database>(options =>
    options.UseInMemoryDatabase("cmsdb")
);

builder.Services.AddControllersWithViews();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.UseRouting();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
