namespace PrivacyApi.Data.Repositories.Token;

public interface ITokenRepository
{
    Task<Models.Token.Token?> Get(int id);
    Task<Models.Token.Token?> GetByUserId(int id);
    Task<Models.Token.Token?> GetByValue(string token);
    Task Insert(Models.Token.Token token);
    Task Delete(int id);
    Task DeleteByUserId(int id);
    Task DeleteByValue(string token);
    Task Update(Models.Token.Token token);
    Task UpdateByUserId(Models.Token.Token token);
}