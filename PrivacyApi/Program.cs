using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using PrivacyApi.Data;
using PrivacyApi.Data.Repositories.Token;
using PrivacyApi.Data.Repositories.User;
using PrivacyApi.Data.Services;
using PrivacyApi.Endpoints;
using Stripe;
using TokenService = PrivacyApi.Data.Services.TokenService;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("yarp.json", false, true);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

StripeConfiguration.ApiKey = builder.Configuration.GetSection("Stripe")["ApiKey"];

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

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("PaidOnly", policy =>
    {
        policy.RequireAuthenticatedUser()
            .RequireRole("Paid");
    });
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy<string>("FreeLimit", httpContext =>
    {
        var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString();

        if (string.IsNullOrEmpty(ipAddress))
            return RateLimitPartition.GetFixedWindowLimiter("unknown",
                partition => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 1,
                    QueueLimit = 0,
                    AutoReplenishment = false
                });

        var user = httpContext.User;

        if (user.Identity?.IsAuthenticated == true)
        {
            if (user.HasClaim(ClaimTypes.Role, "Paid")) return RateLimitPartition.GetNoLimiter(ipAddress);

            var userId = user.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;

            return RateLimitPartition.GetFixedWindowLimiter(userId,
                partition => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 500,
                    Window = TimeSpan.FromDays(1),
                    QueueLimit = 0,
                    AutoReplenishment = true
                });
        }


        return RateLimitPartition.GetFixedWindowLimiter(ipAddress,
            partition => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 500,
                Window = TimeSpan.FromDays(1),
                QueueLimit = 0,
                AutoReplenishment = true
            });
    });
});

builder.Services.AddSingleton<DataContext>();

builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ITokenRepository, TokenRepository>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<JwtService>();

builder.Services.AddHttpClient<EmailService>();
builder.Services.AddSingleton<EmailService>();

builder.Services.AddSingleton<VerificationService>();

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();

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

app.MapAuthEndpoints();
app.MapProfileEndpoints();
app.MapPaymentEndpoints();
app.MapReverseProxy();

app.MapFallbackToFile("index.html");

app.Run();