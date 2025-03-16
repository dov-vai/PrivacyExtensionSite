using Microsoft.Data.Sqlite;
using PrivacyApi.Data;
using PrivacyApi.Data.Models.User;
using PrivacyApi.Data.Repositories.User;
using PrivacyApi.Data.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<DataContext>();

builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<UserService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// initialize database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
    await context.Init();
}

app.MapGet("/users/{id}", async (int id, UserService userService) =>
    {
        var user = await userService.GetUserAsync(id);

        if (user == null) return Results.NotFound();

        return Results.Ok(user);
    })
    .WithName("GetUser")
    .WithOpenApi();

app.MapPost("/users", async (User user, UserService userService) =>
    {
        try
        {
            await userService.AddUserAsync(user);
        }
        catch (SqliteException e)
        {
            return Results.BadRequest(new
            {
                error = "Database Error",
                message = e.Message
            });
        }

        return Results.Ok();
    })
    .WithName("AddUser")
    .WithOpenApi();

app.MapPost("/register", async (RegistrationRequest request, UserService userService, ILogger<Program> logger) =>
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return Results.BadRequest(new
            {
                error = "Validation Error",
                message = "Username and password are required"
            });

        var existingUser = await userService.GetUserByUsernameAsync(request.Username);
        if (existingUser != null)
            return Results.BadRequest(new
            {
                error = "Registration Error",
                message = "Username already exists"
            });

        try
        {
            var user = await userService.RegisterUserAsync(request);
            return Results.Created($"/users/{user.UserId}", user);
        }
        catch (SqliteException e)
        {
            return Results.BadRequest(new 
            {
                error = "Database Error",
                message = e.Message
            });
        }
        catch (Exception e)
        {
            logger.LogError(e, "Unexpected error during registration");
            return Results.Problem(
                statusCode: 500,
                title: "Internal Server Error",
                detail: "An unexpected error occured"
            );
        }
    })
    .WithName("RegisterUser")
    .WithOpenApi();

app.Run();