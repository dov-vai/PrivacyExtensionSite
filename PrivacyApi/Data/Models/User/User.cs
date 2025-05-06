namespace PrivacyApi.Data.Models.User;

public class User
{
    public int UserId { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastLogin { get; set; }
    public bool Verified { get; set; }
    public bool IsPaid { get; set; }
}