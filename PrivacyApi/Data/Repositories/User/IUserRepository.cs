namespace PrivacyApi.Data.Repositories.User;

public interface IUserRepository
{
    Task<Models.User.User?> Get(int id);
    Task Insert(Models.User.User user);
    Task Delete(int id);
    Task<Models.User.User?> GetByUsername(string username);
}