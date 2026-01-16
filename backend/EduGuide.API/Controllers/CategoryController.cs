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
public class CategoryController : ControllerBase
{
    private readonly EduGuideContext _context;
    private readonly JwtHelper _jwtHelper;

    public CategoryController(EduGuideContext context, JwtHelper jwtHelper)
    {
        _context = context;
        _jwtHelper = jwtHelper;
    }

    private (bool authorized, string? role, int? userId) Validate()
    {
        var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        var (isValid, principal) = _jwtHelper.ValidateToken(token ?? "");
        if (!isValid || principal == null) return (false, null, null);

        var role = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        var userId = int.TryParse(principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value, out var id) ? id : (int?)null;
        
        return (true, role, userId);
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Categories
            .Where(c => c.IsActive)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                IsActive = c.IsActive
            })
            .ToListAsync();
        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory(CreateCategoryDto dto)
    {
        var (authorized, role, _) = Validate();
        if (!authorized) return Unauthorized();
        if (role != "Admin") return StatusCode(403, "Forbidden");

        var category = new Category
        {
            Name = dto.Name,
            Description = dto.Description,
            IsActive = true
        };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto dto)
    {
        var (authorized, role, _) = Validate();
        if (!authorized) return Unauthorized();
        if (role != "Admin") return StatusCode(403, "Forbidden");

        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        category.Name = dto.Name;
        category.Description = dto.Description;
        category.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var (authorized, role, _) = Validate();
        if (!authorized) return Unauthorized();
        if (role != "Admin") return StatusCode(403, "Forbidden");

        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        bool hasListings = await _context.Listings.AnyAsync(l => l.CategoryId == id && l.Status == "Published");
        if (hasListings) return Conflict("Cannot delete category with active listings.");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
