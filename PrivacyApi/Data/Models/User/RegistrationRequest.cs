namespace PrivacyApi.Data.Models.User;

public class RegistrationRequest
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}