import {useCallback, useEffect, useState} from "react";
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
import {API_HOST, STRIPE_KEY} from "@/lib/common.ts";
import {loadStripe} from "@stripe/stripe-js";
import {useLocation, useNavigate} from "react-router";

const stripePromise = loadStripe(STRIPE_KEY);

function CheckoutForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("Token not set");
                }

                const response = await fetch(API_HOST + '/users/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const userData = await response.json();

                // paid already, redirect
                if (userData.isPaid) {
                    navigate("/profile");
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                navigate("/auth/login", {
                    state: {
                        from: location,
                        message: "Please log in or register before purchasing."
                    }
                });
            }
        };

        fetchUserProfile();

        return () => {
            const checkoutElement = document.getElementById('checkout');
            if (checkoutElement) {
                while (checkoutElement.firstChild) {
                    checkoutElement.removeChild(checkoutElement.firstChild);
                }
            }
        };
    }, [navigate, location]);

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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div id="checkout">
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
            >
                <EmbeddedCheckout/>
            </EmbeddedCheckoutProvider>
        </div>
    )
}

export default CheckoutForm;