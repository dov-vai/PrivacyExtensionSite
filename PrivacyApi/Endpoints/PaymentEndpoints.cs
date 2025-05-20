using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;

namespace PrivacyApi.Endpoints;

public static class PaymentEndpoints
{
    public static WebApplication MapPaymentEndpoints(this WebApplication app)
    {
        var apiGroup = app.MapGroup("/api").WithOpenApi();

        apiGroup.MapPost("create-checkout-session", CreateCheckoutSession)
            .RequireAuthorization()
            .WithName("CreateCheckoutSession");

        apiGroup.MapGet("session-status", SessionStatus)
            .RequireAuthorization()
            .WithDescription("SessionStatus");

        return app;
    }

    private static async Task<IResult> CreateCheckoutSession(IConfiguration configuration)
    {
        var apiUrl = configuration["WebsiteUrl"];

        var options = new SessionCreateOptions
        {
            UiMode = "embedded",
            LineItems = new List<SessionLineItemOptions>
            {
                new()
                {
                    Price = configuration["Stripe:PriceId"],
                    Quantity = 1
                }
            },
            Mode = "payment",
            ReturnUrl = apiUrl + "/return?session_id={CHECKOUT_SESSION_ID}"
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);


        return Results.Json(new { clientSecret = session.ClientSecret });
    }

    private static async Task<IResult> SessionStatus([FromQuery(Name = "session_id")] string sessionId)
    {
        var sessionService = new SessionService();
        var session = await sessionService.GetAsync(sessionId);

        return Results.Json(new { status = session.Status, customer_email = session.CustomerDetails.Email });
    }
}