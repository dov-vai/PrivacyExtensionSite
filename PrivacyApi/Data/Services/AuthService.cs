using System.Net.Mail;
using PrivacyApi.Data.Models.User;

namespace PrivacyApi.Data.Services;

public class AuthService
{
    private readonly PasswordService _passwordService;
    private readonly UserService _userService;
    private readonly VerificationService _verificationService;

    public AuthService(UserService userService, PasswordService passwordService,
        VerificationService verificationService)
    {
        _userService = userService;
        _passwordService = passwordService;
        _verificationService = verificationService;
    }

    public async Task<User> ValidateUserAsync(string email, string password)
    {
        var user = await _userService.GetUserByEmailAsync(email);

        if (user == null || !_passwordService.VerifyPassword(password, user.PasswordHash))
            throw new AuthenticationException("Invalid email or password");

        user.LastLogin = DateTime.UtcNow;
        await _userService.UpdateUserAsync(user);

        return user;
    }

    public async Task<User> RegisterUserAsync(RegistrationRequest request)
    {
        // Validate request
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException("Email and password are required");

        if (!IsValidEmail(request.Email)) throw new ArgumentException("Invalid email");

        // Check if email already exists
        var existingUser = await _userService.GetUserByEmailAsync(request.Email);
        if (existingUser != null)
            throw new UserAlreadyExistsException($"Email '{request.Email}' is already taken");

        // Create new user
        var user = new User
        {
            Email = request.Email,
            PasswordHash = _passwordService.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow,
            LastLogin = DateTime.UtcNow,
            Verified = false,
            IsPaid = false
        };

        await _userService.AddUserAsync(user);

        await _verificationService.SendVerificationEmail(user.Email);

        return user;
    }

    private bool IsValidEmail(string email)
    {
        var trimmedEmail = email.Trim();

        if (trimmedEmail.EndsWith(".")) return false;
        try
        {
            var addr = new MailAddress(email);
            return addr.Address == trimmedEmail;
        }
        catch
        {
            return false;
        }
    }
}

// Custom exceptions
public class AuthenticationException : Exception
{
    public AuthenticationException(string message) : base(message)
    {
    }
}

public class UserAlreadyExistsException : Exception
{
    public UserAlreadyExistsException(string message) : base(message)
    {
    }
}