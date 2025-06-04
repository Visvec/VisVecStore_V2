using API.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Controllers
{
    [Route("api/oauth")]
    [ApiController]
    public class OAuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _config;
        private readonly ILogger<OAuthController> _logger;

        public OAuthController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, 
            IConfiguration config, ILogger<OAuthController> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _config = config;
            _logger = logger;
        }

        // Starts Google OAuth flow
        [HttpGet("external-login")]
        public IActionResult ExternalLogin()
        {
            _logger.LogInformation("Starting Google OAuth flow");
            
            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("ExternalLoginCallback", "OAuth"),
                // Add items to help with state validation
                Items = { { "scheme", GoogleDefaults.AuthenticationScheme } }
            };

            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        // Handles callback from Google
        [HttpGet("external-login-callback")]
        public async Task<IActionResult> ExternalLoginCallback()
        {
            try
            {
                _logger.LogInformation("Processing Google OAuth callback");

                // First, try to authenticate with the external scheme (Google)
                var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

                if (!result.Succeeded)
                {
                    _logger.LogError("External authentication failed. Error: {Error}", result.Failure?.Message);
                    return Redirect("https://localhost:3000/login?error=external_auth_failed");
                }

                var externalUser = result.Principal;
                var email = externalUser.FindFirst(ClaimTypes.Email)?.Value;
                var firstName = externalUser.FindFirst(ClaimTypes.GivenName)?.Value;
                var lastName = externalUser.FindFirst(ClaimTypes.Surname)?.Value;
                var picture = externalUser.FindFirst("picture")?.Value;

                _logger.LogInformation("External authentication succeeded for email: {Email}", email);

                if (string.IsNullOrEmpty(email))
                {
                    _logger.LogError("Email claim is missing from external authentication");
                    return Redirect("https://localhost:3000/login?error=missing_email");
                }

                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    _logger.LogInformation("Creating new user for email: {Email}", email);
                    
                    user = new User
                    {
                        UserName = email,
                        Email = email,
                        FirstName = firstName ?? "",
                        LastName = lastName ?? "",
                        PhotoUrl = picture
                    };

                    var createResult = await _userManager.CreateAsync(user);
                    if (!createResult.Succeeded)
                    {
                        _logger.LogError("Failed to create user. Errors: {Errors}", 
                            string.Join(", ", createResult.Errors.Select(e => e.Description)));
                        return Redirect("https://localhost:3000/login?error=user_create_failed");
                    }
                }
                else
                {
                    _logger.LogInformation("Found existing user for email: {Email}", email);
                }

                // Ensure "Member" role exists
                if (!await _roleManager.RoleExistsAsync("Member"))
                {
                    _logger.LogInformation("Creating Member role");
                    await _roleManager.CreateAsync(new IdentityRole("Member"));
                }

                // Assign role if not already assigned
                if (!await _userManager.IsInRoleAsync(user, "Member"))
                {
                    _logger.LogInformation("Adding Member role to user: {Email}", email);
                    await _userManager.AddToRoleAsync(user, "Member");
                }

                // Generate JWT
                var token = GenerateJwtToken(user);

                _logger.LogInformation("Successfully generated JWT token for user: {Email}", email);

                // Redirect to frontend with token
                var redirectUrl = $"https://localhost:3000/catalog?token={token}";
                return Redirect(redirectUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing OAuth callback");
                return Redirect("https://localhost:3000/login?error=callback_error");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email!),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(ClaimTypes.NameIdentifier, user.Id!),
                new Claim("firstName", user.FirstName ?? ""),
                new Claim("lastName", user.LastName ?? ""),
                new Claim("photoUrl", user.PhotoUrl ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}