using API.Data;
using API.Entities;
using API.MiddleWare;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 👇 Ensure development config is loaded
builder.Configuration.AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddDbContext<StoreContext>(opt => 
{
   opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();
builder.Services.AddTransient<ExceptionMiddleware>();
builder.Services.AddIdentityApiEndpoints<User>(opt => 
{
   opt.User.RequireUniqueEmail = true;
})
   .AddRoles<IdentityRole>()
   .AddEntityFrameworkStores<StoreContext>();

// 👇 Register HttpClient for PaymentController
builder.Services.AddHttpClient();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(opt =>
{
   opt.AllowAnyHeader()
      .AllowAnyMethod()
      .AllowCredentials()
      .WithOrigins("https://localhost:3000");
});
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseStaticFiles();
app.MapGroup("api").MapIdentityApi<User>();

DbInitializer.InitDb(app);

app.Run();
