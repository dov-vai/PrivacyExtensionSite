using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
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

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.ExpireTimeSpan = TimeSpan.FromDays(7);
        options.SlidingExpiration = true;
        options.LoginPath = "/login";
        options.LogoutPath = "/logout";
        options.AccessDeniedPath = "/access-denied";
    });

builder.Services.AddAuthorization();

builder.Services.AddSingleton<DataContext>();

builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AuthService>();


var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

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

app.MapGet("/users/me", async (ClaimsPrincipal user, UserService userService) =>
    {
        // get the user ID from the authenticated user's claims
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Results.BadRequest(new { error = "Invalid user identifier in token" });

        var userInfo = await userService.GetUserAsync(userId);

        if (userInfo == null) return Results.NotFound();

        return Results.Ok(new
        {
            userId = userInfo.UserId,
            username = userInfo.Username,
            createdAt = userInfo.CreatedAt,
            lastLogin = userInfo.LastLogin,
            isPaid = userInfo.IsPaid
        });
    })
    .RequireAuthorization()
    .WithName("GetCurrentUser")
    .WithOpenApi();

app.MapPost("/login",
        async (LoginRequest request, AuthService authService, HttpContext httpContext, ILogger<Program> logger) =>
        {
            try
            {
                var user = await authService.ValidateUserAsync(request.Username, request.Password);

                // create claims for the user
                var claims = new List<Claim>
                {
                    new(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new(ClaimTypes.Name, user.Username),
                    new("IsPaid", user.IsPaid.ToString())
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7)
                };

                await httpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties);

                return Results.Ok(new
                {
                    message = "Login successful",
                    user = new
                    {
                        userId = user.UserId,
                        username = user.Username,
                        isPaid = user.IsPaid
                    }
                });
            }
            catch (AuthenticationException ex)
            {
                return Results.Unauthorized();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error during registration");
                return Results.Problem(
                    statusCode: 500,
                    title: "Internal Server Error",
                    detail: "An unexpected error occured"
                );
            }
        })
    .WithName("Login")
    .WithOpenApi();


app.MapPost("/register", async (RegistrationRequest request, AuthService authService, ILogger<Program> logger) =>
    {
        try
        {
            var user = await authService.RegisterUserAsync(request);

            return Results.Created($"/users/{user.UserId}", new
            {
                userId = user.UserId,
                username = user.Username
            });
        }
        catch (ArgumentException ex)
        {
            return Results.BadRequest(new
            {
                error = "Validation Error",
                message = ex.Message
            });
        }
        catch (UserAlreadyExistsException ex)
        {
            return Results.Conflict(new
            {
                error = "Registration Error",
                message = ex.Message
            });
        }
        catch (SqliteException ex)
        {
            return Results.BadRequest(new
            {
                error = "Database Error",
                message = ex.Message
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error during registration");
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