namespace EduGuide.API.DTOs;

public class CreateListingDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public List<IFormFile> Images { get; set; } = new();
}

public class UpdateListingDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Status { get; set; } = "Draft";
}

public class ListingDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Status { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int TutorId { get; set; }
    public string TutorName { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class ListingFilterDto
{
    public int? CategoryId { get; set; }
    public int? TutorId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? SortBy { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
