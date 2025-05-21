import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router";

function EmailVerified() {
    const navigate = useNavigate();
    
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
                        <CardTitle className="text-[#f8fafc] text-center text-2xl">Email verified</CardTitle>
                        <CardDescription className="text-[#cbd5e1] text-center">
                            Email verified successfully. You may now log in.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="cursor-pointer w-full bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] hover:opacity-90 text-white"
                            onClick={() => {
                                navigate("/auth/login")
                            }}
                        >
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default EmailVerified