using Microsoft.Data.Sqlite;
using PrivacyApi.Data.Models.Token;
using PrivacyApi.Data.Repositories.Token;

namespace PrivacyApi.Data.Services;

public class TokenService
{
    private readonly ITokenRepository _tokenRepository;

    public TokenService(ITokenRepository tokenRepository)
    {
        _tokenRepository = tokenRepository;
    }

    public async Task SaveTokenAsync(Token token)
    {
        try
        {
            await _tokenRepository.Insert(token);
        }
        catch (SqliteException ex)
        {
            await _tokenRepository.UpdateByUserId(token);
        }
    }

    public async Task<bool> TokenExists(string token)
    {
        return await _tokenRepository.GetByValue(token) != null;
    }

    public async Task RevokeToken(string token)
    {
        await _tokenRepository.DeleteByValue(token);
    }
}