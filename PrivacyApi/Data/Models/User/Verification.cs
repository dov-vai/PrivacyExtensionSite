namespace PrivacyApi.Data.Models.User;

public class Verification
{
    public required string Token { get; set; }
    public required string Email { get; set; }
    public DateTime CreatedAt { get; set; }
}