namespace EduGuide.API.Models;

public class ListingImage
{
    public int Id { get; set; }
    public int ListingId { get; set; }
    public string Url { get; set; } = string.Empty;
}
