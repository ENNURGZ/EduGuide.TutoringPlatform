using Microsoft.AspNetCore.Identity;

namespace EduGuide.API.Models;

public class User : IdentityUser<int>
{
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = "Student"; // "Admin", "Tutor", "Student"
}
