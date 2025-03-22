using Dapper;

namespace PrivacyApi.Data.Repositories.Token;

public class TokenRepository : ITokenRepository
{
    private readonly DataContext _context;

    public TokenRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<Models.Token.Token?> Get(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  SELECT
                    token_id as TokenId,
                    user_id as UserId,
                    token as Value
                  FROM tokens
                  WHERE token_id = @id
                  """;
        return await connection.QuerySingleOrDefaultAsync<Models.Token.Token?>(sql, new { id });
    }

    public async Task<Models.Token.Token?> GetByUserId(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  SELECT
                    token_id as TokenId,
                    user_id as UserId,
                    token as Value
                  FROM tokens
                  WHERE user_id = @id
                  """;
        return await connection.QuerySingleOrDefaultAsync<Models.Token.Token?>(sql, new { id });
    }

    public async Task<Models.Token.Token?> GetByValue(string token)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  SELECT
                    token_id as TokenId,
                    user_id as UserId,
                    token as Value
                  FROM tokens
                  WHERE token = @token
                  """;
        return await connection.QuerySingleOrDefaultAsync<Models.Token.Token?>(sql, new { token });
    }

    public async Task Insert(Models.Token.Token token)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  INSERT INTO tokens (user_id, token)
                  VALUES (@UserId, @Value)
                  """;
        await connection.ExecuteAsync(sql, token);
    }

    public async Task Delete(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  DELETE FROM tokens
                  WHERE token_id = @id
                  """;
        await connection.ExecuteAsync(sql, new { id });
    }

    public async Task DeleteByUserId(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  DELETE FROM tokens
                  WHERE user_id = @id
                  """;
        await connection.ExecuteAsync(sql, new { id });
    }

    public async Task DeleteByValue(string token)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  DELETE FROM tokens
                  WHERE token = @token
                  """;
        await connection.ExecuteAsync(sql, new { token });
    }

    public async Task Update(Models.Token.Token token)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  UPDATE tokens
                  SET token = @Value
                  WHERE token_id = @TokenId
                  """;
        await connection.ExecuteAsync(sql, token);
    }

    public async Task UpdateByUserId(Models.Token.Token token)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  UPDATE tokens
                  SET token = @Value
                  WHERE user_id = @UserId
                  """;
        await connection.ExecuteAsync(sql, token);
    }
}