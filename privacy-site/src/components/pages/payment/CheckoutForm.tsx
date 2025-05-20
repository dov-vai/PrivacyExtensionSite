import {useCallback} from "react";
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
import {API_HOST, STRIPE_KEY} from "@/lib/common.ts";
import {loadStripe} from "@stripe/stripe-js";

const stripePromise = loadStripe(STRIPE_KEY);

function CheckoutForm () {
    const fetchClientSecret = useCallback(() => {
        return fetch(API_HOST + "/create-checkout-session", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then((res) => res.json())
            .then((data) => data.clientSecret);
    }, []);

    const options = {fetchClientSecret};

    return (
        <div id="checkout">
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    )
}

export default CheckoutForm;