using EduGuide.API.Data;
using EduGuide.API.DTOs;
using EduGuide.API.Helpers;
using EduGuide.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EduGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListingController : ControllerBase
{
    private readonly EduGuideContext _context;
    private readonly JwtHelper _jwtHelper;
    private readonly IWebHostEnvironment _env;

    public ListingController(EduGuideContext context, JwtHelper jwtHelper, IWebHostEnvironment env)
    {
        _context = context;
        _jwtHelper = jwtHelper;
        _env = env;
    }

    private (bool authorized, string? role, int? userId) Validate()
    {
        var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        var (isValid, principal) = _jwtHelper.ValidateToken(token ?? "");
        if (!isValid || principal == null) return (false, null, null);

        var role = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        var userIdStr = principal.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == ClaimTypes.NameIdentifier)?.Value;
        
        return (true, role, int.TryParse(userIdStr, out var id) ? id : (int?)null);
    }

    [HttpPost]
    public async Task<IActionResult> CreateListing([FromForm] CreateListingDto dto)
    {
        var (authorized, role, userId) = Validate();
        if (!authorized) return Unauthorized();
        if (role != "Tutor") return StatusCode(403, "Forbidden: Only tutors can create listings.");

        // Handle Image Uploads
        var imageUrls = new List<string>();
        if (dto.Images != null && dto.Images.Count > 0)
        {
            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            foreach (var file in dto.Images)
            {
                if (file.Length > 0)
                {
                    var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    // Save relative path using forward slashes
                    imageUrls.Add($"/uploads/{uniqueFileName}");
                }
            }
        }

        var listing = new Listing
        {
            Title = dto.Title,
            Description = dto.Description,
            Price = dto.Price,
            Mode = dto.Mode,
            CategoryId = dto.CategoryId,
            TutorId = userId!.Value,
            Status = "Draft",
            Images = imageUrls.Select(url => new ListingImage { Url = url }).ToList()
        };

        _context.Listings.Add(listing);
        await _context.SaveChangesAsync();

        return Ok(listing);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateListing(int id, [FromBody] UpdateListingDto dto)
    {
        var (authorized, role, userId) = Validate();
        if (!authorized) return Unauthorized();

        var listing = await _context.Listings.Include(l => l.Images).FirstOrDefaultAsync(l => l.Id == id);
        if (listing == null) return NotFound();

        if (role != "Admin" && listing.TutorId != userId)
            return StatusCode(403, "Forbidden: You do not own this listing.");

        if (role == "Student") return StatusCode(403, "Forbidden: Students cannot update listings.");

        if (dto.Status == "Published" && listing.Images.Count < 3)
             _ = 0; // No-op

        listing.Title = dto.Title;
        listing.Description = dto.Description;
        listing.Price = dto.Price;
        listing.Mode = dto.Mode;
        listing.Status = dto.Status;
        listing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(listing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteListing(int id)
    {
        var (authorized, role, userId) = Validate();
        if (!authorized) return Unauthorized();

        var listing = await _context.Listings.FindAsync(id);
        if (listing == null) return NotFound();

        if (role != "Admin" && listing.TutorId != userId)
            return StatusCode(403, "Forbidden");

        if (role == "Student") return StatusCode(403, "Forbidden");

        _context.Listings.Remove(listing);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetListings([FromQuery] ListingFilterDto filter)
    {
        var query = _context.Listings
            .Include(l => l.Category)
            .Include(l => l.Tutor)
            .Include(l => l.Images)
            .AsQueryable();

        // AUTH CHECK FOR STATUS VISIBILITY
        // By default, only show Published. 
        // Showing Drafts requires being the Tutor owner OR Admin.
        var (isValid, role, userId) = Validate();
        
        bool canSeeAll = false;
        
        // If filtering by TutorId, check if requester owns it or is Admin
        if (filter.TutorId.HasValue && isValid)
        {
            if (role == "Admin" || (role == "Tutor" && userId == filter.TutorId))
                canSeeAll = true;
        }
        else if (isValid && role == "Admin")
        {
            // Admin can see everything if they want, but usually on public list we still show Published?
            // User requested Admin Dashboard see ALL. So if Admin is logged in, let's show all by default or strictly for Dashboard?
            // To simplify: If requester is Admin, show ALL unless filtered otherwise.
           canSeeAll = true;
        }

        if (!canSeeAll)
        {
            query = query.Where(l => l.Status == "Published");
        }

        // Apply filters
        if (filter.CategoryId.HasValue)
            query = query.Where(l => l.CategoryId == filter.CategoryId);
        
        if (filter.TutorId.HasValue)
            query = query.Where(l => l.TutorId == filter.TutorId);

        if (filter.MinPrice.HasValue)
            query = query.Where(l => l.Price >= filter.MinPrice);

        if (filter.MaxPrice.HasValue)
            query = query.Where(l => l.Price <= filter.MaxPrice);

        if (!string.IsNullOrEmpty(filter.Search))
        {
            query = query.Where(l => l.Title.Contains(filter.Search) || l.Tutor!.Name.Contains(filter.Search));
        }

        if (filter.SortBy == "priceAsc") query = query.OrderBy(l => l.Price);
        else if (filter.SortBy == "priceDesc") query = query.OrderByDescending(l => l.Price);
        else query = query.OrderByDescending(l => l.CreatedAt);

        var listings = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(l => new ListingDto
            {
                Id = l.Id,
                Title = l.Title,
                Description = l.Description,
                Price = l.Price,
                Mode = l.Mode,
                Status = l.Status,
                CategoryId = l.CategoryId,
                CategoryName = l.Category!.Name,
                TutorId = l.TutorId,
                TutorName = l.Tutor!.Name,
                Images = l.Images.Select(i => i.Url).ToList(),
                CreatedAt = l.CreatedAt
            })
            .ToListAsync();

        return Ok(listings);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetListing(int id)
    {
        var listing = await _context.Listings
            .Include(l => l.Category)
            .Include(l => l.Tutor)
            .Include(l => l.Images)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (listing == null) return NotFound();

        var dto = new ListingDto
        {
            Id = listing.Id,
            Title = listing.Title,
            Description = listing.Description,
            Price = listing.Price,
            Mode = listing.Mode,
            Status = listing.Status,
            CategoryId = listing.CategoryId,
            CategoryName = listing.Category?.Name ?? "",
            TutorId = listing.TutorId,
            TutorName = listing.Tutor?.Name ?? "",
            Images = listing.Images.Select(i => i.Url).ToList(),
            CreatedAt = listing.CreatedAt
        };

        return Ok(dto);
    }
}
