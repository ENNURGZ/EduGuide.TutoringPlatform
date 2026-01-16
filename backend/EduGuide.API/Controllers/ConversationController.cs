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
public class ConversationController : ControllerBase
{
    private readonly EduGuideContext _context;
    private readonly JwtHelper _jwtHelper;

    public ConversationController(EduGuideContext context, JwtHelper jwtHelper)
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

    [HttpGet]
    public async Task<IActionResult> GetConversations()
    {
        var (authorized, role, userId) = Validate();
        if (!authorized) return Unauthorized();

        IQueryable<Conversation> query = _context.Conversations
            .Include(c => c.Request)
                .ThenInclude(r => r.Listing)
            .Include(c => c.Tutor)
            .Include(c => c.Student);

        if (role == "Student")
            query = query.Where(c => c.StudentId == userId);
        else if (role == "Tutor")
            query = query.Where(c => c.TutorId == userId);
        else if (role != "Admin")
            return StatusCode(403, "Forbidden");

        var conversations = await query.ToListAsync();
        return Ok(conversations);
    }

    [HttpGet("{id}/messages")]
    public async Task<IActionResult> GetMessages(int id)
    {
        var (authorized, role, userId) = Validate();
        if (!authorized) return Unauthorized();

        var conversation = await _context.Conversations.FindAsync(id);
        if (conversation == null) return NotFound();

        if (role != "Admin" && conversation.StudentId != userId && conversation.TutorId != userId)
            return StatusCode(403, "Forbidden");

        var messages = await _context.Messages
            .Where(m => m.ConversationId == id)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPost("{id}/messages")]
    public async Task<IActionResult> SendMessage(int id, [FromBody] string body)
    {
        var (authorized, role, userId) = Validate();
        if (!authorized) return Unauthorized();

        var conversation = await _context.Conversations.FindAsync(id);
        if (conversation == null) return NotFound();

        if (conversation.Status != "Active") return BadRequest("Conversation is closed/blocked.");

        if (role != "Admin" && conversation.StudentId != userId && conversation.TutorId != userId)
            return StatusCode(403, "Forbidden");

        var message = new Message
        {
            ConversationId = id,
            SenderId = userId!.Value, 
            Body = body,
            Type = "Text"
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();
        
        return Ok(message);
    }
}
