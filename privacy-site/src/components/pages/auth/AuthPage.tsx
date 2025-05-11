import {useEffect, useState} from 'react';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {LoginForm} from './LoginForm';
import {Route, Routes, useLocation, useNavigate} from "react-router";
import {RegisterForm} from "@/components/pages/auth/RegisterForm.tsx";

export default function AuthPage() {
    const location = useLocation();
    const [currentTab, setCurrentTab] = useState('login');
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentTab(location.pathname === '/auth/register' ? 'register' : 'login');
    }, [location])

    return (
        <div className="w-full min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans p-8">
            <div className="max-w-md mx-auto space-y-8">
                <div className="flex justify-center">
                    <div className="flex items-center">
                        <img src="/logo.png" className="h-8 w-8 text-[#0ea5e9] mr-2" alt="Logo"/>
                        <span className="text-xl font-bold">FalconFort</span>
                    </div>
                </div>

                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-8 bg-[#334155] mx-auto">
                        <TabsTrigger
                            value="login"
                            className="text-[#cbd5e1] cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ea5e9] data-[state=active]:to-[#2dd4bf] data-[state=active]:text-white"
                            onClick={() => navigate("/auth/login")}
                        >
                            Login
                        </TabsTrigger>
                        <TabsTrigger
                            value="register"
                            className="text-[#cbd5e1] cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ea5e9] data-[state=active]:to-[#2dd4bf] data-[state=active]:text-white"
                            onClick={() => navigate("/auth/register")}
                        >
                            Register
                        </TabsTrigger>
                    </TabsList>

                    <Routes>
                        <Route
                            path="register"
                            element={<RegisterForm/>}
                        />
                        <Route
                            path="login/:registered?"
                            element={<LoginForm/>}
                        />
                        <Route
                            path="*"
                            element={<LoginForm/>}/>
                    </Routes>
                </Tabs>
            </div>
        </div>
    );
}