using EduGuide.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EduGuide.API.Data;

public class EduGuideContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    public EduGuideContext(DbContextOptions<EduGuideContext> options) : base(options) { }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Listing> Listings { get; set; }
    public DbSet<ListingImage> ListingImages { get; set; }
    public DbSet<LessonRequest> LessonRequests { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Message> Messages { get; set; } 

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Category -> Listings
        modelBuilder.Entity<Listing>()
            .HasOne(l => l.Category)
            .WithMany()
            .HasForeignKey(l => l.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Tutor -> Listings
        modelBuilder.Entity<Listing>()
            .HasOne(l => l.Tutor)
            .WithMany()
            .HasForeignKey(l => l.TutorId)
            .OnDelete(DeleteBehavior.Restrict);

        // Listing -> Images
        modelBuilder.Entity<Listing>()
            .HasMany(l => l.Images)
            .WithOne()
            .HasForeignKey(i => i.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        // LessonRequest -> Listing
        modelBuilder.Entity<LessonRequest>()
            .HasOne(r => r.Listing)
            .WithMany()
            .HasForeignKey(r => r.ListingId)
            .OnDelete(DeleteBehavior.Restrict);

        // LessonRequest -> Student
        modelBuilder.Entity<LessonRequest>()
            .HasOne(r => r.Student)
            .WithMany()
            .HasForeignKey(r => r.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Conversation -> Request
        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.Request)
            .WithMany()
            .HasForeignKey(c => c.RequestId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Conversation -> Tutor
        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.Tutor)
            .WithMany()
            .HasForeignKey(c => c.TutorId)
            .OnDelete(DeleteBehavior.Restrict);

        // Conversation -> Student
        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.Student)
            .WithMany()
            .HasForeignKey(c => c.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Message -> Conversation
        modelBuilder.Entity<Message>()
            .HasOne<Conversation>()
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);
            
         // Message -> Sender
        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany()
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
