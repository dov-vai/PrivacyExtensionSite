using PrivacyApi.Data.Models.User;

namespace PrivacyApi.Data.Services;

public class AuthService
{
    private readonly PasswordService _passwordService;
    private readonly UserService _userService;

    public AuthService(UserService userService, PasswordService passwordService)
    {
        _userService = userService;
        _passwordService = passwordService;
    }

    public async Task<User> ValidateUserAsync(string username, string password)
    {
        var user = await _userService.GetUserByUsernameAsync(username);

        if (user == null || !_passwordService.VerifyPassword(password, user.PasswordHash))
            throw new AuthenticationException("Invalid username or password");

        user.LastLogin = DateTime.UtcNow;
        await _userService.UpdateUserAsync(user);

        return user;
    }

    public async Task<User> RegisterUserAsync(RegistrationRequest request)
    {
        // Validate request
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException("Username and password are required");

        // Check if username already exists
        var existingUser = await _userService.GetUserByUsernameAsync(request.Username);
        if (existingUser != null)
            throw new UserAlreadyExistsException($"Username '{request.Username}' is already taken");

        // Create new user
        var user = new User
        {
            Username = request.Username,
            PasswordHash = _passwordService.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow,
            LastLogin = DateTime.UtcNow,
            IsPaid = false
        };

        await _userService.AddUserAsync(user);

        return user;
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