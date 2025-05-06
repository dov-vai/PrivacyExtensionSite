using System.Security.Cryptography;
using PrivacyApi.Data.Models.User;

namespace PrivacyApi.Data.Services;

public class VerificationService
{
    private readonly string _apiUrl;
    private readonly EmailService _emailService;
    private readonly string _from;
    private readonly Dictionary<string, Verification> _verifications;


    public VerificationService(EmailService emailService, IConfiguration configuration)
    {
        _emailService = emailService;
        _verifications = new Dictionary<string, Verification>();

        _from = configuration["EmailService:From"] ??
                throw new ArgumentException("EmailService:From is required in configuration");

        _apiUrl = configuration["ApiUrl"] ??
                  throw new ArgumentException("ApiUrl is required in configuration");
        ;
    }

    public Verification? VerifyToken(string token)
    {
        if (!_verifications.ContainsKey(token)) return null;

        if (_verifications[token].CreatedAt.AddMinutes(15) < DateTime.Now)
        {
            _verifications.Remove(token);
            return null;
        }

        _verifications.Remove(token, out var verification);

        return verification;
    }

    public void CleanOldTokens()
    {
        foreach (var (token, verification) in _verifications)
            if (verification.CreatedAt.AddMinutes(15) < DateTime.Now)
                _verifications.Remove(token);

        _verifications.TrimExcess();
    }

    private string GenerateToken(int length)
    {
        return RandomNumberGenerator.GetString(
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
            length);
    }

    public bool VerificationInProgress(string to)
    {
        foreach (var (token, verification) in _verifications)
            if (verification.Email == to)
            {
                if (verification.CreatedAt.AddMinutes(15) > DateTime.Now) return true;
                return false;
            }

        return false;
    }

    public async Task<bool> SendVerificationEmail(string to)
    {
        var token = GenerateToken(32);

        var verificationUrl = $"{_apiUrl}/verify?token={token}";

        var body =
            $"<p>Verify your FalconFort account by clicking the link below:</p> <a href=\"{verificationUrl}\">{verificationUrl}</a> <p>Valid for 15 minutes.</p>";

        var sent = await _emailService.Send(
            _from,
            new[] { to },
            "Verify your FalconFort account",
            body
        );

        if (sent)
        {
            _verifications.Add(token, new Verification
            {
                Token = token,
                Email = to,
                CreatedAt = DateTime.Now
            });

            return true;
        }

        return false;
    }
}