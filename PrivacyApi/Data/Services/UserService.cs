using PrivacyApi.Data.Models.User;
using PrivacyApi.Data.Repositories.User;

namespace PrivacyApi.Data.Services;

public class UserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
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

    public async Task UpdateUserAsync(User user)
    {
        await _userRepository.Update(user);
    }
}