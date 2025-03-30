using System.Security.Claims;
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
}