using API.Data;
using API.Entities;
using API.MiddleWare;
using API.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Load development-specific configuration
builder.Configuration.AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true);

// Add services to the container
builder.Services.AddControllers();

// Configure EF Core with retry on failure
builder.Services.AddDbContext<StoreContext>(opt => 
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null));
});

// Identity configuration with role support and token providers
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<StoreContext>()
.AddDefaultTokenProviders(); // ✅ Enables token-based features

// CORS
builder.Services.AddCors();

// Middleware
builder.Services.AddTransient<ExceptionMiddleware>();

// Dependency injection for email sender service
builder.Services.AddHttpClient();
builder.Services.AddScoped<IEmailSender, EmailSender>();

// Authentication and Google OAuth
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
{
    options.ClientId = builder.Configuration["GoogleOAuth:ClientId"]!;
    options.ClientSecret = builder.Configuration["GoogleOAuth:ClientSecret"]!;
    options.CallbackPath = "/api/oauth/external-login-callback";
    options.Scope.Add("profile");
    options.Scope.Add("email");
});

var app = builder.Build();

// Configure the middleware pipeline
app.UseMiddleware<ExceptionMiddleware>();
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors(opt =>
{
    opt.AllowAnyHeader()
       .AllowAnyMethod()
       .AllowCredentials()
       .WithOrigins("https://localhost:3000"); // Update with your frontend URL
});

app.UseHttpsRedirection();
app.UseAuthentication(); // Authentication before Authorization
app.UseAuthorization();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>();
app.MapFallbackToController("Index", "Fallback");

// Retry logic for DB initialization
try 
{
    await DbInitializer.InitDb(app);
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during database initialization. Retrying...");

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
