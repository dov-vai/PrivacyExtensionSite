using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.Sqlite;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using PrivacyApi.Data;
using PrivacyApi.Data.Models.User;
using PrivacyApi.Data.Repositories.Token;
using PrivacyApi.Data.Repositories.User;
using PrivacyApi.Data.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.ASCII.GetBytes(jwtSettings["Secret"] ?? "YourDefaultSecretKeyHereMakeSureItIsAtLeast32BytesLong");
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = jwtSettings["Issuer"] ?? "YourIssuer",
            ValidAudience = jwtSettings["Audience"] ?? "YourAudience",
            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var jwtService = context.HttpContext.RequestServices.GetRequiredService<JwtService>();
                var token = context.SecurityToken as JsonWebToken;
                var isValid = await jwtService.ValidateTokenAsync(token.EncodedToken);
                if (!isValid) context.Fail("Token has been revoked");
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddSingleton<DataContext>();

builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ITokenRepository, TokenRepository>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<JwtService>();


var app = builder.Build();

app.UseStaticFiles();
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

var apiGroup = app.MapGroup("/api").WithOpenApi();

apiGroup.MapGet("/users/{id}", async (int id, UserService userService) =>
    {
        var user = await userService.GetUserAsync(id);

        if (user == null) return Results.NotFound();

        return Results.Ok(user);
    })
    .WithName("GetUser");

apiGroup.MapPost("/users", async (User user, UserService userService) =>
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
    .WithName("AddUser");

apiGroup.MapGet("/users/me", async (ClaimsPrincipal user, UserService userService) =>
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
    .WithName("GetCurrentUser");

apiGroup.MapPost("/login",
        async (LoginRequest request, AuthService authService, JwtService jwtService, ILogger<Program> logger) =>
        {
            try
            {
                var user = await authService.ValidateUserAsync(request.Username, request.Password);

                var token = await jwtService.GenerateToken(user);

                return Results.Ok(new
                {
                    userId = user.UserId,
                    username = user.Username,
                    isPaid = user.IsPaid,
                    token
                });
            }
            catch (AuthenticationException ex)
            {
                return Results.Unauthorized();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error during login");
                return Results.Problem(
                    statusCode: 500,
                    title: "Internal Server Error",
                    detail: "An unexpected error occurred"
                );
            }
        })
    .WithName("Login");

apiGroup.MapPost("/logout", async (HttpContext httpContext, JwtService jwtService) =>
    {
        var authHeader = httpContext.Request.Headers["Authorization"].FirstOrDefault();
        if (authHeader != null && authHeader.StartsWith("Bearer "))
        {
            var token = authHeader.Substring("Bearer ".Length).Trim();
            await jwtService.RevokeTokenAsync(token);
            return Results.Ok();
        }

        return Results.BadRequest();
    })
    .RequireAuthorization()
    .WithName("Logout");

apiGroup.MapPost("/register", async (RegistrationRequest request, AuthService authService, ILogger<Program> logger) =>
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
    .WithName("RegisterUser");

app.MapFallbackToFile("index.html");

app.Run();