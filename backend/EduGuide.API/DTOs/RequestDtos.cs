namespace EduGuide.API.DTOs;

public class CreateRequestDto
{
    public int ListingId { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class RequestDto
{
    public int Id { get; set; }
    public int ListingId { get; set; }
    public string ListingTitle { get; set; } = string.Empty;
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class UpdateRequestStatusDto
{
    public string Status { get; set; } = string.Empty;
}
