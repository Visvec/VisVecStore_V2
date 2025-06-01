using System;
using System.Net;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly SignInManager<User> _signInManager;
    private readonly IEmailSender _emailSender;
    private readonly ILogger<AccountController> _logger;
    private readonly IConfiguration _config;

    public AccountController(SignInManager<User> signInManager, IEmailSender emailSender, ILogger<AccountController> logger, IConfiguration config)
    {
        _signInManager = signInManager;
        _emailSender = emailSender;
        _logger = logger;
        _config = config;
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

        var result = await _signInManager.UserManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        await _signInManager.UserManager.AddToRoleAsync(user, "Member");

        var token = await _signInManager.UserManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebUtility.UrlEncode(token);

        var baseUrl = _config["Frontend:ClientUrl"] ?? "https://localhost:3000";
        var confirmationUrl = $"{baseUrl}/confirm-email?userId={user.Id}&token={encodedToken}";

        try
        {
            await _emailSender.SendEmailAsync(user.Email, "Confirm your email",
                $"<p>Please confirm your account by clicking <a href='{confirmationUrl}'>here</a>.</p>");

            _logger.LogInformation("Confirmation email sent to {Email}", user.Email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending confirmation email to {Email}", user.Email);
        }

        return Ok(new { message = "User registered successfully. Please check your email to confirm your account." });
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
        var ClientUrl = _config["Frontend:ClientUrl"] ?? "https://localhost:3000";

        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
        {
            return Redirect($"{ClientUrl}/confirm-email?status=failed");
        }

        var user = await _signInManager.UserManager.FindByIdAsync(userId);

        if (user == null)
        {
            return Redirect($"{ClientUrl}/confirm-email?status=failed");
        }

        var result = await _signInManager.UserManager.ConfirmEmailAsync(user, token);

        if (!result.Succeeded)
        {
            return Redirect($"{ClientUrl}/confirm-email?status=failed");
        }

        return Redirect($"{ClientUrl}/confirm-email?status=success");
    }

    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
        if (User.Identity?.IsAuthenticated == false) return NoContent();

        var user = await _signInManager.UserManager.GetUserAsync(User);

        if (user == null) return Unauthorized();

        var roles = await _signInManager.UserManager.GetRolesAsync(user);

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
        await _signInManager.SignOutAsync();
        return NoContent();
    }

    [Authorize]
    [HttpPost("address")]
    public async Task<ActionResult<Address>> CreateOrUpdateAddress(Address address)
    {
        var user = await _signInManager.UserManager.Users
            .Include(x => x.Address)
            .FirstOrDefaultAsync(x => x.UserName == User.Identity!.Name);

        if (user == null) return Unauthorized();

        user.Address = address;

        var result = await _signInManager.UserManager.UpdateAsync(user);

        if (!result.Succeeded) return BadRequest("Problem updating user address");

        return Ok(user.Address);
    }

    [Authorize]
    [HttpGet("address")]
    public async Task<ActionResult<Address>> GetSavedAddress()
    {
        var address = await _signInManager.UserManager.Users
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
        var user = await _signInManager.UserManager.GetUserAsync(User);

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
        var user = await _signInManager.UserManager.GetUserAsync(User);

        if (user == null) return Unauthorized();

        user.FirstName = profileDto.FirstName;
        user.LastName = profileDto.LastName;
        user.DateOfBirth = !string.IsNullOrEmpty(profileDto.DateOfBirth)
            ? DateTime.Parse(profileDto.DateOfBirth)
            : null;

        var result = await _signInManager.UserManager.UpdateAsync(user);

        if (!result.Succeeded) return BadRequest("Problem updating profile");

        return Ok();
    }
}
