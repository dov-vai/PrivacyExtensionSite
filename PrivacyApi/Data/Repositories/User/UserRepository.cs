using Dapper;

namespace PrivacyApi.Data.Repositories.User;

public class UserRepository : IUserRepository
{
    private readonly DataContext _context;

    public UserRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<Models.User.User?> Get(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  SELECT
                    user_id as UserId,
                    username as Username,
                    password_hash as PasswordHash,
                    created_at as CreatedAt,
                    last_login as LastLogin,
                    paid as IsPaid
                  FROM users
                  WHERE user_id = @id
                  """;
        return await connection.QuerySingleOrDefaultAsync<Models.User.User?>(sql, new { id });
    }

    public async Task Insert(Models.User.User user)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  INSERT INTO users
                      (user_id, username, password_hash, created_at, last_login, paid)
                  VALUES
                      (@UserId, @Username, @PasswordHash, @CreatedAt, @LastLogin, @IsPaid)
                  """;
        await connection.ExecuteAsync(sql, user);
    }

    public async Task Delete(int id)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  DELETE FROM users
                  WHERE user_id = @id
                  """;
        await connection.ExecuteAsync(sql, new { id });
    }

    public async Task<Models.User.User?> GetByUsername(string username)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  SELECT *
                  FROM users
                  WHERE username = @username
                  """;
        return await connection.QuerySingleOrDefaultAsync<Models.User.User?>(sql, new { username });
    }
}