using Microsoft.Data.Sqlite;
using PrivacyApi.Data.Models.User;
using PrivacyApi.Data.Services;

namespace PrivacyApi.Endpoints;

public static class AuthEndpoints
{
    public static WebApplication MapAuthEndpoints(this WebApplication app)
    {
        var apiGroup = app.MapGroup("/api").WithOpenApi();

        apiGroup.MapPost("/login", Login)
            .WithName("Login");

        apiGroup.MapPost("/logout", Logout)
            .RequireAuthorization()
            .WithName("Logout");

        apiGroup.MapPost("/register", Register)
            .WithName("RegisterUser");

        return app;
    }

    private static async Task<IResult> Login(LoginRequest request, AuthService authService, JwtService jwtService,
        ILogger<Program> logger)
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
    }

    private static async Task<IResult> Logout(HttpContext httpContext, JwtService jwtService)
    {
        var authHeader = httpContext.Request.Headers["Authorization"].FirstOrDefault();
        if (authHeader != null && authHeader.StartsWith("Bearer "))
        {
            var token = authHeader.Substring("Bearer ".Length).Trim();
            await jwtService.RevokeTokenAsync(token);
            return Results.Ok();
        }

        return Results.BadRequest();
    }

    private static async Task<IResult> Register(RegistrationRequest request, AuthService authService,
        ILogger<Program> logger)
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
    }
}