import {useState} from "react";
import {API_HOST} from "@/lib/common.ts";

function RetryVerification() {
    const [message, setMessage] = useState("");

    const handleRetry = async () => {
        try {
            const response = await fetch(API_HOST + '/resend-verification', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setMessage("Email sent successfully.");
            }

            if (response.status === 400) {
                const data = await response.json();

                if (data.error){
                    setMessage(data.error);
                }
            }
        } catch (error) {
            console.error('Error during resending verification:', error);
        }
    }

    return (
        <>
            <button onClick={handleRetry}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Resend verification email
            </button>

            {message &&
                <p>{message}</p>
            }
        </>
    )
}

export default RetryVerification;