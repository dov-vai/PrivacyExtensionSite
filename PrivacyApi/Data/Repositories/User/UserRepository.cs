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
                    email as Email,
                    password_hash as PasswordHash,
                    created_at as CreatedAt,
                    last_login as LastLogin,
                    verified as Verified,
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
                      (email, password_hash, created_at, last_login, verified, paid)
                  VALUES
                      (@Email, @PasswordHash, @CreatedAt, @LastLogin, @Verified, @IsPaid)
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

    public async Task<Models.User.User?> GetByEmail(string email)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  SELECT
                     user_id as UserId,
                     email as Email,
                     password_hash as PasswordHash,
                     created_at as CreatedAt,
                     last_login as LastLogin,
                     verified as Verified,
                     paid as IsPaid 
                  FROM users
                  WHERE email = @email
                  """;
        return await connection.QuerySingleOrDefaultAsync<Models.User.User?>(sql, new { email });
    }

    public async Task Update(Models.User.User user)
    {
        using var connection = _context.CreateConnection();
        var sql = """
                  UPDATE users
                  SET
                    email = @Email, 
                    password_hash = @PasswordHash,
                    last_login = @LastLogin,
                    verified = @Verified,
                    paid = @IsPaid
                  WHERE email = @Email
                  """;
        await connection.ExecuteAsync(sql, user);
    }
}