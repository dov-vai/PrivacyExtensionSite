import {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {MoveLeft} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/separator';
import {Link, useNavigate} from 'react-router';
import {API_HOST} from "@/lib/common.ts";
import DeleteAccount from "@/components/pages/profile/DeleteAccount.tsx";
import Logout from "@/components/pages/profile/Logout.tsx";
import VerifyEmail from "@/components/pages/profile/VerifyEmail.tsx";
import {UserInfo} from "@/components/pages/profile/UserInfo.tsx";

export function ProfilePage() {
    const [user, setUser] = useState<UserInfo | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
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
                    if (response.status === 401) {
                        // Unauthorized, redirect to login
                        navigate("/auth/login");
                        return;
                    }
                    throw new Error('Failed to fetch user profile');
                }

                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching profile:', error);
                navigate("/auth/login");
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="w-full min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans p-8">
            <div className="max-w-md mx-auto space-y-8">
                <Card className="bg-[#1e293b] border-[#334155]">
                    <CardHeader>
                        <Link to="/">
                            <MoveLeft className="text-[#cbd5e1]"/>
                        </Link>

                        <div className="flex justify-center mb-4">
                            <div
                                className="w-14 h-14 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] flex items-center justify-center text-white text-2xl font-bold">
                                {user?.email.charAt(0)}
                            </div>
                        </div>
                        <CardTitle className="text-[#f8fafc] text-center text-2xl">{user?.email}</CardTitle>
                        <div className="flex justify-center">
                            <Badge
                                className="bg-gradient-to-r from-[#0ea5e9]/10 to-[#2dd4bf]/10 text-[#0ea5e9] border-[#0ea5e9]/30">
                                {user?.isPaid ? "Pro" : "Free"} Plan
                            </Badge>
                            {user?.isPaid && (
                                <Badge
                                    className="bg-gradient-to-r from-[#0ea5e9]/10 to-[#2dd4bf]/10 text-[#0ea5e9] border-[#0ea5e9]/30">
                                    Upgrade to Pro
                                </Badge>
                            )}

                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {user && <VerifyEmail user={user}/>}

                        {/* Account info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-[#f8fafc]">Account Information</h3>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-[#cbd5e1]">Email</span>
                                    <span className="text-[#f8fafc] font-medium">{user?.email}</span>
                                </div>
                                <Separator className="bg-[#334155]"/>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-[#cbd5e1]">Member since</span>
                                    <span className="text-[#f8fafc] font-medium">{user?.createdAt.split("T")[0]}</span>
                                </div>
                                <Separator className="bg-[#334155]"/>
                            </div>
                        </div>

                        {/* Account actions */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-[#f8fafc]">Account Actions</h3>
                            <div className="space-y-4">
                                <Logout/>
                                <DeleteAccount/>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}