import {useCallback, useEffect, useState} from "react";
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
import {API_HOST, STRIPE_KEY} from "@/lib/common.ts";
import {loadStripe} from "@stripe/stripe-js";
import {Link, useLocation, useNavigate} from "react-router";
import {MoveLeft} from "lucide-react";

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

    return (
        <div className="w-full min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans p-8">
            <div className="max-w-md mx-auto space-y-12">
                <div className="relative flex justify-center items-center mt-8 mb-12">
                    <div className="absolute left-0">
                        <Link to="/">
                            <MoveLeft className="text-[#cbd5e1] h-6 w-6"/>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <img src="/logo.png" className="h-8 w-8 text-[#0ea5e9] mr-2" alt="Logo"/>
                        <span className="text-xl font-bold">FalconFort</span>
                    </div>
                </div>
            </div>

            {!isLoading && (
                <div id="checkout" className="mt-8 mb-16">
                    <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={{
                            fetchClientSecret,
                        }}
                    >
                        <EmbeddedCheckout/>
                    </EmbeddedCheckoutProvider>
                </div>
            )}
        </div>
    )
}

export default CheckoutForm;