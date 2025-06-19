using System;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController(SignInManager<User> signInManager, IConfiguration configuration) : BaseApiController
    {
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto loginDto)
        {
            var adminEmail = configuration["ADMIN_EMAIL"];
            var adminPassword = configuration["ADMIN_PASSWORD"];
            
            // Check if this is the admin account
            if (loginDto.Email == adminEmail && loginDto.Password == adminPassword)
            {
                // Find or create admin user
                var adminUser = await signInManager.UserManager.FindByEmailAsync(loginDto.Email);
                
                if (adminUser == null)
                {
                    // Create admin user if it doesn't exist
                    adminUser = new User
                    {
                        UserName = loginDto.Email,
                        Email = loginDto.Email,
                        FirstName = "Admin",
                        LastName = "User",
                        EmailConfirmed = true
                    };

                    var createResult = await signInManager.UserManager.CreateAsync(adminUser, loginDto.Password);
                    if (!createResult.Succeeded)
                    {
                        return BadRequest("Failed to create admin account");
                    }

                    // Add admin role
                    await signInManager.UserManager.AddToRoleAsync(adminUser, "Admin");
                }

                // Sign in the admin user
                await signInManager.SignInAsync(adminUser, isPersistent: false);
                return Ok();
            }

            // Regular user login logic
            var user = await signInManager.UserManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized("Invalid email or password");

            var result = await signInManager.PasswordSignInAsync(user, loginDto.Password, false, false);
            
            if (!result.Succeeded) return Unauthorized("Invalid email or password");

            return Ok();
        }

        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
        {
            var user = new User
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                DateOfBirth = registerDto.DateOfBirth
            };

            var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await signInManager.UserManager.AddToRoleAsync(user, "Member");

            return Ok();
        }

        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            if (User.Identity?.IsAuthenticated == false) return NoContent();

            var user = await signInManager.UserManager.GetUserAsync(User);

            if (user == null) return Unauthorized();

            var roles = await signInManager.UserManager.GetRolesAsync(user);

            return Ok(new
            {
                user.Email,
                user.UserName,
                Roles = roles
            });
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPost("address")]
        public async Task<ActionResult<Address>> CreateOrUpdateAddress(Address address)
        {
            var user = await signInManager.UserManager.Users
                .Include(x => x.Address)
                .FirstOrDefaultAsync(x => x.UserName == User.Identity!.Name);

            if (user == null) return Unauthorized();

            user.Address = address;

            var result = await signInManager.UserManager.UpdateAsync(user);

            if (!result.Succeeded) return BadRequest("Problem updating user address");

            return Ok(user.Address);
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<Address>> GetSavedAddress()
        {
            var address = await signInManager.UserManager.Users
                .Where(x => x.UserName == User.Identity!.Name)
                .Select(x => x.Address)
                .FirstOrDefaultAsync();

            if (address == null) return NoContent();

            return address;
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<ActionResult<ProfileDto>> GetUserProfile()
        {
            var user = await signInManager.UserManager.GetUserAsync(User);

            if (user == null) return Unauthorized();

            return new ProfileDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateOfBirth = user.DateOfBirth.HasValue
                    ? user.DateOfBirth.Value.ToString("yyyy-MM-dd")
                    : null,
                PhotoUrl = user.PhotoUrl
            };
        }

        [Authorize]
        [HttpPost("update-profile")]
        public async Task<ActionResult> UpdateUserProfile(ProfileDto profileDto)
        {
            var user = await signInManager.UserManager.GetUserAsync(User);

            if (user == null) return Unauthorized();

            user.FirstName = profileDto.FirstName;
            user.LastName = profileDto.LastName;

            if (!string.IsNullOrEmpty(profileDto.DateOfBirth))
            {
                user.DateOfBirth = DateTime.Parse(profileDto.DateOfBirth);
            }
            else
            {
                user.DateOfBirth = null;
            }

            var result = await signInManager.UserManager.UpdateAsync(user);

            if (!result.Succeeded) return BadRequest("Problem updating profile");

            return Ok();
        }

        [Authorize]
        [HttpPost("profile/photo")]
        public async Task<ActionResult> UploadProfilePhoto(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var user = await signInManager.UserManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var uploadsFolder = Path.Combine("wwwroot", "images", "profiles");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            user.PhotoUrl = $"/images/profiles/{fileName}";

            var result = await signInManager.UserManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest("Problem saving profile photo");

            return Ok(new { user.PhotoUrl });
        }

        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDto dto)
        {
            // Validate the request
            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.NewPassword))
                return BadRequest("Email and new password are required");

            // Find user by email
            var user = await signInManager.UserManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return NotFound("User not found");

            // Generate password reset token and reset password
            var token = await signInManager.UserManager.GeneratePasswordResetTokenAsync(user);
            var result = await signInManager.UserManager.ResetPasswordAsync(user, token, dto.NewPassword);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }

            // Ensure user is in Member role
            var roles = await signInManager.UserManager.GetRolesAsync(user);
            if (!roles.Contains("Member"))
            {
                var roleResult = await signInManager.UserManager.AddToRoleAsync(user, "Member");
                if (!roleResult.Succeeded)
                {
                    return BadRequest("Password updated but failed to assign role");
                }
            }

            return Ok(new { message = "Password updated successfully" });
        }
    }
}