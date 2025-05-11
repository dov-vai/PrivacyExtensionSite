import {Button} from "@/components/ui/button.tsx";
import {Alert, AlertDescription} from "@/components/ui/alert.tsx";
import {AlertTriangle, MailCheck} from "lucide-react";
import {useState} from "react";
import {API_HOST} from "@/lib/common.ts";

import {UserInfo} from "@/components/pages/profile/UserInfo.tsx";

interface VerifyEmailProps {
    user: UserInfo
}

function VerifyEmail({user}: VerifyEmailProps) {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleResend = async () => {
        setError('');
        setSuccess(false);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Token not set");
            }

            const response = await fetch(API_HOST + '/resend-verification', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (!response.ok) {
                const msg = await response.json();

                if (msg.error) {
                    throw new Error(msg.error);
                }

                throw new Error("Failed to resend verification");
            }
            setSuccess(true);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }

    return (
        <>
            {!user?.verified && (
                <>
                    {success && (
                        <Alert className="bg-green-500/10 text-green-500 border border-green-500/30">
                            <MailCheck className="h-4 w-4"/>
                            <AlertDescription className="text-[#cbd5e1]">Email sent successfully</AlertDescription>
                        </Alert>
                    )}
                    {error && (
                        <Alert className="bg-red-500/10 text-red-500 border border-red-500/30">
                            <AlertTriangle className="h-4 w-4"/>
                            <AlertDescription className="text-[#cbd5e1]">{error}</AlertDescription>
                        </Alert>
                    )}

                    <Alert className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 flex items-center">
                        <AlertTriangle className="h-4 w-4"/>

                        <div className="flex items-center justify-between w-full">
                            <AlertDescription className="text-[#cbd5e1]">Please verify your email
                                address</AlertDescription>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
                                onClick={handleResend}
                            >
                                Resend Link
                            </Button>

                        </div>
                    </Alert>
                </>
            )}
        </>
    )
}

export default VerifyEmail;