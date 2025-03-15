using PrivacyApi.Data.Repositories.User;

namespace PrivacyApi.Data.Services.User;

public class UserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task AddUserAsync(Models.User.User user)
    {
        await _userRepository.Insert(user);
    }

    public async Task<Models.User.User?> GetUserAsync(int id)
    {
        return await _userRepository.Get(id);
    }
}