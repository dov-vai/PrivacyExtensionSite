import {useEffect, useState} from "react";
import {Navigate} from "react-router";
import {API_HOST} from "@/lib/common.ts";

function CheckoutReturn() {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');

        fetch(API_HOST + `/session-status?session_id=${sessionId}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            })
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
            });
    }, []);

    if (status === 'open') {
        return (
            <Navigate to="/checkout"/>
        )
    }

    if (status === 'complete') {
        return (
            <section id="success">
                <p>
                    We appreciate your business! A confirmation email will be sent to {customerEmail}.

                    If you have any questions, please email <a href="mailto:orders@example.com">falconfort@dov.lt</a>.
                </p>
            </section>
        )
    }

    return null;
}

export default CheckoutReturn;