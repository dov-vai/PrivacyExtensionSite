using PrivacyApi.Data.Models.User;
using PrivacyApi.Data.Repositories.Token;
using PrivacyApi.Data.Repositories.User;

namespace PrivacyApi.Data.Services;

public class UserService
{
    private readonly ITokenRepository _tokenRepository;
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository, ITokenRepository tokenRepository)
    {
        _userRepository = userRepository;
        _tokenRepository = tokenRepository;
    }

    public async Task AddUserAsync(User user)
    {
        await _userRepository.Insert(user);
    }

    public async Task<User?> GetUserAsync(int id)
    {
        return await _userRepository.Get(id);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _userRepository.GetByEmail(email);
    }

    public async Task UpdateUserAsync(User user)
    {
        await _userRepository.Update(user);
    }

    public async Task DeleteUserAsync(User user)
    {
        var userId = user.UserId;

        await _tokenRepository.DeleteByUserId(userId);
        await _userRepository.Delete(userId);
    }
}