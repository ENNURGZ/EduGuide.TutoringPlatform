namespace EduGuide.API.Models;

public class LessonRequest
{
    public int Id { get; set; }
    public int ListingId { get; set; }
    public int StudentId { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected, Cancelled
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Listing? Listing { get; set; }
    public User? Student { get; set; }
}
