using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using PrivacyApi.Data.Services;
using Stripe;
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

        apiGroup.MapPost("stripe-webhook", StripeWebhook)
            .WithDescription("StripeWebhook");

        return app;
    }

    private static async Task<IResult> CreateCheckoutSession(ClaimsPrincipal user, UserService userService,
        IConfiguration configuration)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Results.BadRequest(new { error = "Invalid user identifier in token" });

        var userInfo = await userService.GetUserAsync(userId);

        if (userInfo == null) return Results.BadRequest(new { error = "User not found using the identifier in token" });
        ;

        var websiteUrl = configuration["WebsiteUrl"];

        var options = new SessionCreateOptions
        {
            UiMode = "embedded",
            CustomerEmail = userInfo.Email,
            LineItems = new List<SessionLineItemOptions>
            {
                new()
                {
                    Price = configuration["Stripe:PriceId"],
                    Quantity = 1
                }
            },
            Mode = "payment",
            ReturnUrl = websiteUrl + "/return?session_id={CHECKOUT_SESSION_ID}"
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

    private static async Task<IResult> StripeWebhook(HttpContext context, PaymentService paymentService,
        IConfiguration configuration)
    {
        var json = await new StreamReader(context.Request.Body).ReadToEndAsync();

        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                context.Request.Headers["Stripe-Signature"],
                configuration["Stripe:WebhookSecret"]
            );

            if (
                stripeEvent.Type == EventTypes.CheckoutSessionCompleted ||
                stripeEvent.Type == EventTypes.CheckoutSessionAsyncPaymentSucceeded
            )
            {
                var session = stripeEvent.Data.Object as Session;

                if (session == null) return Results.BadRequest();

                await paymentService.FulfillCheckout(session.Id);
            }

            return Results.Ok();
        }
        catch (StripeException)
        {
            return Results.BadRequest();
        }
    }
}