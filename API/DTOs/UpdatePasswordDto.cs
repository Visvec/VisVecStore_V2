using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdatePasswordDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public required string Email { get; set; }
    
    [Required(ErrorMessage = "New password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
    public required string NewPassword { get; set; }
}