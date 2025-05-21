import {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router";
import {API_HOST} from "@/lib/common.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

function CheckoutReturn() {
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

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
            });
    }, []);

    if (status === 'open') {
        return (
            <Navigate to="/checkout"/>
        )
    }

    if (status === 'complete') {

    }

    return (
        <div className="w-full min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans p-8">
            <div className="max-w-md mx-auto space-y-12">
                <div className="relative flex justify-center items-center mt-8 mb-12">
                    <div className="flex items-center">
                        <img src="/logo.png" className="h-8 w-8 text-[#0ea5e9] mr-2" alt="Logo"/>
                        <span className="text-xl font-bold">FalconFort</span>
                    </div>
                </div>

                <Card className="bg-[#1e293b] border-[#334155]">
                    <CardHeader>
                        <CardTitle className="text-[#f8fafc] text-center text-2xl">Thank you for your
                            purchase!</CardTitle>
                        <CardDescription className="text-[#cbd5e1] text-center">
                            We hope you enjoy your FalconFort Pro license.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="cursor-pointer w-full bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] hover:opacity-90 text-white"
                            onClick={() => {
                                navigate("/profile")
                            }}
                        >
                            Go to Profile
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default CheckoutReturn;