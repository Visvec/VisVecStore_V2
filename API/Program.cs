using API.Data;
using API.Entities;
using API.MiddleWare;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 👇 Load development configuration if available
builder.Configuration.AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true);

// Add services to the container
builder.Services.AddControllers();

builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// ✅ CORS setup for Render deployment
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddTransient<ExceptionMiddleware>();

builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<StoreContext>();

// 👇 Register HttpClient for controllers like PaymentController
builder.Services.AddHttpClient();

var app = builder.Build();

// ✅ Middleware pipeline
app.UseMiddleware<ExceptionMiddleware>();
app.UseDefaultFiles();    // Serve index.html if requested
app.UseStaticFiles();     // Serve files from wwwroot

app.UseCors("AllowAll");  // ✅ Apply CORS policy for all origins

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>();

// ✅ React/Vite SPA fallback middleware
app.Use(async (context, next) =>
{
    await next();

    if (context.Response.StatusCode == 404 &&
        !System.IO.Path.HasExtension(context.Request.Path.Value))
    {
        context.Request.Path = "/index.html";
        await next();
    }
});

// ✅ Initialize database (migrations + seed)
await DbInitializer.InitDbAsync(app);

app.Run();
