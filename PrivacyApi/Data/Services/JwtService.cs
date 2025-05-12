using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using PrivacyApi.Data.Models.Token;
using PrivacyApi.Data.Models.User;

namespace PrivacyApi.Data.Services;

public class JwtService
{
    private readonly string _audience;
    private readonly int _expirationInDays;
    private readonly string _issuer;
    private readonly string _secret;

    private readonly TokenService _tokenService;

    public JwtService(IConfiguration configuration, TokenService tokenService)
    {
        var jwtSettings = configuration.GetSection("JwtSettings");
        _secret = jwtSettings["Secret"] ?? "YourDefaultSecretKeyHereMakeSureItIsAtLeast32BytesLong";
        _issuer = jwtSettings["Issuer"] ?? "YourIssuer";
        _audience = jwtSettings["Audience"] ?? "YourAudience";
        _expirationInDays = int.Parse(jwtSettings["ExpirationDays"] ?? "7");
        _tokenService = tokenService;
    }

    public async Task<string> GenerateToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_secret);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new(ClaimTypes.Role, user.IsPaid ? "Paid" : "Free")
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(_expirationInDays),
            Issuer = _issuer,
            Audience = _audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        await _tokenService.SaveTokenAsync(new Token
        {
            UserId = user.UserId,
            Value = tokenString
        });

        return tokenString;
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        if (!await _tokenService.TokenExists(token))
            return false;

        return true;
    }

    public async Task RevokeTokenAsync(string token)
    {
        await _tokenService.RevokeToken(token);
    }
}