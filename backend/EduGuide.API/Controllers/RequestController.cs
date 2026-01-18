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
public class RequestController : ControllerBase
{
    private readonly EduGuideContext _context;
    private readonly JwtHelper _jwtHelper;

    public RequestController(EduGuideContext context, JwtHelper jwtHelper)
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
        var userIdStr = principal.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == ClaimTypes.NameIdentifier)?.Value;
        
        return (true, role, int.TryParse(userIdStr, out var id) ? id : (int?)null);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRequest(CreateRequestDto dto)
    {
        var (authorized, role, userId) = Validate();
        if (!authorized) return Unauthorized();
        if (role != "Student") return StatusCode(403, "Forbidden: Only students can create requests.");

        var hasActiveRequest = await _context.LessonRequests.AnyAsync(r => 
            r.StudentId == userId && 
            r.ListingId == dto.ListingId && 
            (r.Status == "Pending" || r.Status == "Accepted"));

        if (hasActiveRequest) return Conflict("You already have an active request for this listing.");

        var request = new LessonRequest
        {
            ListingId = dto.ListingId,
            StudentId = userId!.Value,
            Message = dto.Message,
            Status = "Pending"
        };

        _context.LessonRequests.Add(request);
        await _context.SaveChangesAsync();
        return Ok(request);
    }

    [HttpGet]
    public async Task<IActionResult> GetRequests()
    {
        var (authorized, role, userId) = Validate();
        if (!authorized) return Unauthorized();

        IQueryable<LessonRequest> query = _context.LessonRequests
            .Include(r => r.Listing)
                .ThenInclude(l => l.Tutor)
            .Include(r => r.Student);

        if (role == "Student")
        {
            query = query.Where(r => r.StudentId == userId);
        }
        else if (role == "Tutor")
        {
            query = query.Where(r => r.Listing!.TutorId == userId);
        }
        else if (role != "Admin")
        {
            return StatusCode(403, "Forbidden");
        }

        var requests = await query.ToListAsync();
        return Ok(requests);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateRequestStatusDto dto)
    {
        var (authorized, role, userId) = Validate();
        if (!authorized) return Unauthorized();

        var request = await _context.LessonRequests.Include(r => r.Listing).FirstOrDefaultAsync(r => r.Id == id);
        if (request == null) return NotFound();

        if (role == "Tutor")
        {
            if (request.Listing!.TutorId != userId) return StatusCode(403, "Forbidden");
            if (dto.Status != "Accepted" && dto.Status != "Rejected") return BadRequest("Tutor can only Accept or Reject.");
        }
        else if (role == "Student")
        {
            if (request.StudentId != userId) return StatusCode(403, "Forbidden");
            if (dto.Status != "Cancelled") return BadRequest("Student can only Cancel.");
        }
        else if (role != "Admin")
        {
            return StatusCode(403, "Forbidden");
        }

        request.Status = dto.Status;
        await _context.SaveChangesAsync();

        if (dto.Status == "Accepted")
        {
            var exists = await _context.Conversations.AnyAsync(c => c.RequestId == id);
            if (!exists)
            {
                var conversation = new Conversation
                {
                    RequestId = id,
                    TutorId = request.Listing!.TutorId,
                    StudentId = request.StudentId,
                    Status = "Active"
                };
                _context.Conversations.Add(conversation);
                await _context.SaveChangesAsync();
            }
        }

        return Ok(request);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRequest(int id)
    {
        var (authorized, role, userId) = Validate();
        if (!authorized) return Unauthorized();

        var request = await _context.LessonRequests.FindAsync(id);
        if (request == null) return NotFound();

        if (role == "Student" && request.StudentId != userId)
        {
            return StatusCode(403, "Forbidden: You can only delete your own requests.");
        }
        if (role == "Tutor" && role != "Admin") 
        {
             return StatusCode(403, "Forbidden: Tutors cannot delete requests.");
        }

        _context.LessonRequests.Remove(request);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Request deleted successfully" });
    }
}
