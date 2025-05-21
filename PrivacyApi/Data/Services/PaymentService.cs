using Stripe.Checkout;

namespace PrivacyApi.Data.Services;

public class PaymentService
{
    private readonly UserService _userService;
    
    public PaymentService(UserService userService)
    {
        _userService = userService;
    }
    
    public async Task FulfillCheckout(String sessionId) {
        var service = new SessionService();
        var checkoutSession = await service.GetAsync(sessionId);
        
        if (checkoutSession.PaymentStatus != "unpaid")
        {
            var user = await _userService.GetUserByEmailAsync(checkoutSession.CustomerEmail);

            if (user == null || user.IsPaid)
            {
                return;
            }
            
            user.IsPaid = true;
            
            await _userService.UpdateUserAsync(user);
        }
    }

}