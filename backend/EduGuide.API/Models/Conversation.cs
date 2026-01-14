namespace EduGuide.API.Models;

public class Conversation
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public int TutorId { get; set; }
    public int StudentId { get; set; }
    public string Status { get; set; } = "Active"; // Active, Closed, Blocked
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public LessonRequest? Request { get; set; }
    public User? Tutor { get; set; }
    public User? Student { get; set; }
    public List<Message> Messages { get; set; } = new();
}


