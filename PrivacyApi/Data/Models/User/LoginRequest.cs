namespace PrivacyApi.Data.Models.User;

public class LoginRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}