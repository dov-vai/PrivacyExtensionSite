namespace PrivacyApi.Data.Services;

public class EmailService
{
    private readonly HttpClient _httpClient;

    public EmailService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        var apiKey = configuration["EmailService:MailerooApiKey"] ??
                     throw new ArgumentException("EmailService:MailerooApiKey is required in configuration");
        ;

        _httpClient.DefaultRequestHeaders.Add("X-API-Key", apiKey);
    }

    public async Task<bool> Send(string from, string[] to, string subject, string html)
    {
        var uri = new Uri("https://smtp.maileroo.com/send");

        var content = new MultipartFormDataContent();

        content.Add(new StringContent(from), "from");
        content.Add(new StringContent(string.Join(',', to)), "to");
        content.Add(new StringContent(subject), "subject");
        content.Add(new StringContent(html), "html");

        var response = await _httpClient.PostAsync(uri, content);

        if (response.IsSuccessStatusCode) return true;

        return false;
    }
}