using API.Data;
using API.Entities;
using API.MiddleWare;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 👇 Ensure development config is loaded
builder.Configuration.AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true);

// Add services to the container.
builder.Services.AddControllers();

// 👇 Modified DbContext with retry logic for transient failures
builder.Services.AddDbContext<StoreContext>(opt => 
{
   opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null));
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
builder.Services.AddScoped<IEmailSender, EmailSender>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseDefaultFiles();
app.UseStaticFiles();

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
app.MapFallbackToController("Index", "Fallback");

// 👇 Added retry logic for database initialization
try 
{
    await DbInitializer.InitDb(app);
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during database initialization. Retrying...");
    
    // Wait a bit and retry database initialization
    await Task.Delay(5000);
    try 
    {
        await DbInitializer.InitDb(app);
    }
    catch (Exception retryEx)
    {
        logger.LogError(retryEx, "Database initialization failed after retry.");
        throw;
    }
}

app.Run();