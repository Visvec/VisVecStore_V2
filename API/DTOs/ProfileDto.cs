using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ProfileDto
{
    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public string? DateOfBirth { get; set; }

    public string? PhotoUrl { get; set; }
}
