namespace PrivacyApi.Data.Models.Token;

public class Token
{
    public int TokenId { get; set; }
    public int UserId { get; set; }
    public required string Value { get; set; }
}