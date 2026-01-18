namespace EduGuide.API.Models;

public class Listing
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public int TutorId { get; set; }
    public string Mode { get; set; } = "Online";
    public string Status { get; set; } = "Draft";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public Category? Category { get; set; }
    public User? Tutor { get; set; }
    public List<ListingImage> Images { get; set; } = new();
}


