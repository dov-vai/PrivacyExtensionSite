using System.Data;
using Dapper;
using Microsoft.Data.Sqlite;

namespace PrivacyApi.Data;

public class DataContext
{
    private readonly IConfiguration _configuration;

    public DataContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // Behind the scenes the connections are pooled (reused).
    // It is safer to create a connection and dispose it each SQL query.
    // https://learn.microsoft.com/en-us/dotnet/framework/data/adonet/sql-server-connection-pooling
    public IDbConnection CreateConnection()
    {
        return new SqliteConnection(_configuration.GetConnectionString("Database"));
    }

    public async Task Init()
    {
        var dbPath = _configuration["Paths:Db"];

        if (File.Exists(dbPath))
            return;

        var dbInitSql = _configuration["Paths:DbInitSql"];

        if (!File.Exists(dbInitSql))
            throw new FileNotFoundException(dbInitSql);

        using var connection = CreateConnection();

        var sql = File.ReadAllText(dbInitSql);

        await connection.ExecuteAsync(sql);
    }
}