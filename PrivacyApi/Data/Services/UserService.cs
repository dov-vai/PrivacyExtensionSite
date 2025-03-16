using PrivacyApi.Data.Models.User;
using PrivacyApi.Data.Repositories.User;

namespace PrivacyApi.Data.Services;

public class UserService
{
    private readonly IUserRepository _userRepository;
    private readonly PasswordService _passwordService;

    public UserService(IUserRepository userRepository, PasswordService passwordService)
    {
        _userRepository = userRepository;
        _passwordService = passwordService;
    }

    public async Task AddUserAsync(User user)
    {
        await _userRepository.Insert(user);
    }

    public async Task<User?> GetUserAsync(int id)
    {
        return await _userRepository.Get(id);
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await _userRepository.GetByUsername(username);
    }
    
    public async Task<User> RegisterUserAsync(RegistrationRequest request)
    {
        var user = new User
        {
            Username = request.Username,
            PasswordHash = _passwordService.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow,
            LastLogin = DateTime.UtcNow,
            IsPaid = false
        };
        
        await _userRepository.Insert(user);
        
        return user;
    }
}