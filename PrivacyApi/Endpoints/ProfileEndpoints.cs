using System.Security.Claims;
using PrivacyApi.Data.Models.User;
using PrivacyApi.Data.Services;

namespace PrivacyApi.Endpoints;

public static class ProfileEndpoints
{
    public static WebApplication MapProfileEndpoints(this WebApplication app)
    {
        var apiGroup = app.MapGroup("/api").WithOpenApi();

        apiGroup.MapGet("/users/me", GetCurrentUser)
            .RequireAuthorization()
            .WithName("GetCurrentUser");

        apiGroup.MapPost("/users/delete", DeleteCurrentUser)
            .RequireAuthorization()
            .WithName("DeleteCurrentUser");

        return app;
    }

    private static async Task<IResult> GetCurrentUser(ClaimsPrincipal user, UserService userService)
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
    }

    private static async Task<IResult> DeleteCurrentUser(DeletionRequest request, ClaimsPrincipal user,
        UserService userService, AuthService authService)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Results.BadRequest(new { error = "Invalid user identifier in token" });

        var userInfo = await userService.GetUserAsync(userId);

        if (userInfo == null) return Results.NotFound();

        try
        {
            await authService.ValidateUserAsync(userInfo.Username, request.Password);
        }
        catch (AuthenticationException ex)
        {
            return Results.BadRequest(new { error = "Wrong password" });
        }

        await userService.DeleteUserAsync(userInfo);

        return Results.Ok();
    }
}