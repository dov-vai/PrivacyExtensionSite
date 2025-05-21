import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Check, Download, Eye, Globe, Lock, MessageCircleWarning, Shield, ShieldCheck, User} from 'lucide-react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {API_HOST, PRODUCT_NAME} from "@/lib/common.ts";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";

import {UserInfo} from "@/components/pages/profile/UserInfo.tsx";

export function LandingPage() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [user, setUser] = useState<UserInfo | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    return;
                }

                const response = await fetch(API_HOST + '/users/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                });

                if (!response.ok) {
                    return;
                }

                const userData = await response.json();
                setUser(userData);
            } catch (e) {
                console.error('Error fetching user profile', e);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="w-full min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans">
            <nav
                className={`sticky top-0 z-50 w-full ${scrollPosition > 50 ? 'bg-[#1e293b] shadow-md' : 'bg-transparent'} transition-all duration-300`}>
                <div className="container mx-auto flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                        <img src="/logo.png" alt="Logo" className="h-8 w-8"/>
                        <a href="#"
                           className="text-xl text-[#f8fafc] font-bold hover:bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] hover:text-transparent bg-clip-text">{PRODUCT_NAME}</a>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features"
                           className="text-[#f8fafc] hover:bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] hover:text-transparent bg-clip-text">
                            Features
                        </a>
                        <a href="#screenshots"
                           className="text-[#f8fafc] hover:bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] hover:text-transparent bg-clip-text">
                            See it in Action
                        </a>
                        <a href="#pricing"
                           className="text-[#f8fafc] hover:bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] hover:text-transparent bg-clip-text">
                            Pricing
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/profile"
                            className="text-[#f8fafc] hover:bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] hover:text-transparent bg-clip-text">
                            {user != null ? `Welcome, ${user.email.split("@")[0]}` : "Log in"}
                        </Link>
                        <div
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] flex items-center justify-center">
                            {user?.email.charAt(0)}

                            {!user &&
                                <User className="h-4 w-4 text-[#f8fafc]"/>
                            }

                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-20 md:pt-20 md:pb-24">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-80"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf]"></div>

                {/* Animated background effect */}
                <div
                    className="absolute top-20 right-0 w-96 h-96 bg-[#0ea5e9] rounded-full filter blur-[120px] opacity-20 animate-pulse"></div>
                <div
                    className="absolute bottom-20 left-0 w-96 h-96 bg-[#2dd4bf] rounded-full filter blur-[120px] opacity-20 animate-pulse delay-700"></div>

                <div className="container relative mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <Badge
                                className="px-3 py-1 bg-gradient-to-r from-[#0ea5e9]/10 to-[#2dd4bf]/10 text-[#0ea5e9] border-[#0ea5e9]/30 mb-4">
                                Privacy Made Simple
                            </Badge>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                                <span className="block">Protect Your Digital</span>
                                <span>Privacy with </span>
                                <span
                                    className="bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] text-transparent bg-clip-text">FalconFort</span>
                            </h1>

                            <p className="text-lg md:text-xl text-[#cbd5e1] max-w-xl">
                                Shield yourself from trackers, block unwanted ads, and browse the web with confidence.
                                Your data belongs to you.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button
                                    className="cursor-pointer bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] hover:opacity-90 text-white px-8 py-6 rounded-md transition-all">
                                    <Download className="mr-2 h-5 w-5"/>
                                    Get FalconFort
                                </Button>
                            </div>
                        </div>

                        {/* Right side - screenshot placeholder */}
                        <div className="flex-1 w-full max-w-lg">
                            <div className="relative">
                                <div
                                    className="absolute -inset-1 bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] rounded-lg blur-sm opacity-75"></div>
                                <div
                                    className="relative bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden shadow-xl">
                                    <div className="h-8 bg-[#0f172a] flex items-center px-4 gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                                    </div>
                                    <div className="h-80 flex items-center justify-center p-4">
                                        <img src="/dashboard.png" alt="Dashboard Screenshot"
                                             className="rounded shadow-md"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-[#0f172a]">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge className="px-3 py-1 bg-[#334155] text-[#cbd5e1] mb-4">
                            Powerful Protection
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] text-transparent bg-clip-text">
                            Privacy Features That Matter
                        </h2>
                        <p className="text-[#cbd5e1] text-lg">
                            FalconFort provides comprehensive protection with powerful yet easy-to-use features designed
                            to keep your online activities private.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Shield className="h-10 w-10 text-[#0ea5e9]"/>,
                                title: "Tracker Blocking",
                                description: "Stop companies from following your online activities across websites with our advanced tracker blocking technology."
                            },
                            {
                                icon: <Eye className="h-10 w-10 text-[#2dd4bf]"/>,
                                title: "Breach Protection",
                                description: "Check your email addresses for any data breaches that might have occured."
                            },
                            {
                                icon: <ShieldCheck className="h-10 w-10 text-[#0ea5e9]"/>,
                                title: "File Scanning",
                                description: "Automatically check downloaded files for viruses before opening them."
                            },
                            {
                                icon: <Globe className="h-10 w-10 text-[#2dd4bf]"/>,
                                title: "Privacy Dashboard",
                                description: "See exactly what's being blocked in real-time with our intuitive privacy dashboard and stats."
                            },
                            {
                                icon: <MessageCircleWarning className="h-10 w-10 text-[#0ea5e9]"/>,
                                title: "Phishing Protection",
                                description: "Get warned about potentially malicious websites and emails before they can harm your device or steal your information."
                            },
                            {
                                icon: <Lock className="h-10 w-10 text-[#2dd4bf]"/>,
                                title: "Cookie Manager",
                                description: "Take control of cookies with smart management that blocks tracking cookies while preserving functionality."
                            }
                        ].map((feature, index) => (
                            <Card key={index}
                                  className="bg-[#1e293b] border-[#334155] transition-all hover:shadow-xl hover:shadow-[#0ea5e9]/5 hover:-translate-y-1">
                                <CardHeader>
                                    <div
                                        className="w-14 h-14 rounded-lg bg-[#334155] flex items-center justify-center mb-4">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-[#f8fafc]">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[#cbd5e1]">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Screenshots Section */}
            <section id="screenshots" className="py-20 bg-[#1e293b]">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge className="px-3 py-1 bg-[#334155] text-[#cbd5e1] mb-4">
                            See It In Action
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] text-transparent bg-clip-text">
                            Simple, Powerful, Effective
                        </h2>
                        <p className="text-[#cbd5e1] text-lg">
                            FalconFort seamlessly integrates into your browser with a clean interface that puts you in
                            control.
                        </p>
                    </div>

                    <Tabs defaultValue="dashboard" className="max-w-3xl mx-auto">
                        <TabsList className="grid grid-cols-5 mb-8 mx-auto bg-[#334155]">
                            <TabsTrigger value="dashboard"
                                         className="cursor-pointer text-[#cbd5e1] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ea5e9] data-[state=active]:to-[#2dd4bf] data-[state=active]:text-white">
                                Dashboard
                            </TabsTrigger>
                            <TabsTrigger value="file-scan"
                                         className="cursor-pointer text-[#cbd5e1] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ea5e9] data-[state=active]:to-[#2dd4bf] data-[state=active]:text-white">
                                Files
                            </TabsTrigger>
                            <TabsTrigger value="email-breach"
                                         className="cursor-pointer text-[#cbd5e1] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ea5e9] data-[state=active]:to-[#2dd4bf] data-[state=active]:text-white">
                                Emails
                            </TabsTrigger>
                            <TabsTrigger value="cookies"
                                         className="cursor-pointer text-[#cbd5e1] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ea5e9] data-[state=active]:to-[#2dd4bf] data-[state=active]:text-white">
                                Cookies
                            </TabsTrigger>
                            <TabsTrigger value="trackers"
                                         className="cursor-pointer text-[#cbd5e1] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ea5e9] data-[state=active]:to-[#2dd4bf] data-[state=active]:text-white">
                                Trackers
                            </TabsTrigger>
                        </TabsList>

                        {['dashboard', 'file-scan', 'email-breach', 'cookies', 'trackers'].map((tab) => (
                            <TabsContent key={tab} value={tab}>
                                <div className="relative rounded-lg overflow-hidden border border-[#334155]">
                                    <div className="h-8 bg-[#0f172a] flex items-center px-4 gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                                    </div>

                                    <div className=" bg-[#1e293b] flex items-center justify-center p-4">
                                        <img src={`/${tab}.png`} alt={`FalconFort ${tab}`}
                                             className="w-full rounded shadow-md"/>
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-[#0f172a]">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge className="px-3 py-1 bg-[#334155] text-[#cbd5e1] mb-4">
                            Pricing
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] text-transparent bg-clip-text">
                            Choose Your Privacy Plan
                        </h2>
                        <p className="text-[#cbd5e1] text-lg">
                            Find the perfect plan for your privacy needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <Card
                            className="bg-[#1e293b] border-[#334155] transition-all hover:shadow-xl hover:shadow-[#0ea5e9]/5 hover:-translate-y-1">
                            <CardHeader className="text-[#f8fafc]">
                                <CardTitle>Free</CardTitle>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold">$0</span>
                                </div>
                            </CardHeader>
                            <CardContent className="text-[#cbd5e1]">
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2"/>
                                        <span>Tracker blocking</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2"/>
                                        <span>Basic cookie scanning</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2"/>
                                        <span>Privacy tips</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2"/>
                                        <span>Password strength</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="cursor-pointer w-full">Get Started</Button>
                            </CardFooter>
                        </Card>

                        <Card
                            className="bg-[#1e293b] border-[#334155] transition-all hover:shadow-xl hover:shadow-[#0ea5e9]/5 hover:-translate-y-1">
                            <CardHeader className="text-[#f8fafc]">
                                <CardTitle>Pro</CardTitle>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold">$30</span>
                                </div>
                            </CardHeader>
                            <CardContent className="text-[#cbd5e1]">
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2"/>
                                        <span>File scanning</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2"/>
                                        <span>Phishing email detection</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2"/>
                                        <span>Site security scanning</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2"/>
                                        <span>And more...</span>
                                    </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="cursor-pointer w-full bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf]"
                                    onClick={() => {
                                        navigate("checkout")
                                    }}>
                                    Purchase
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="py-20 bg-[#1e293b] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf]"></div>
                <div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-[#0ea5e9] rounded-full filter blur-[100px] opacity-10"></div>
                <div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#2dd4bf] rounded-full filter blur-[100px] opacity-10"></div>

                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] text-transparent bg-clip-text">
                            Start Protecting Your Privacy Today
                        </h2>
                        <p className="text-[#cbd5e1] text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of users who've taken control of their online privacy with FalconFort. Free
                            to use, easy to install, powerful protection.
                        </p>

                        <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-8 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        text: "Block over 10,000+ trackers",
                                        icon: <Check className="h-5 w-5 text-[#10b981]"/>
                                    },
                                    {text: "Protect from phishing", icon: <Check className="h-5 w-5 text-[#10b981]"/>},
                                    {text: "Speed up browsing", icon: <Check className="h-5 w-5 text-[#10b981]"/>},
                                    {text: "Virus protection", icon: <Check className="h-5 w-5 text-[#10b981]"/>},
                                    {text: "Password security", icon: <Check className="h-5 w-5 text-[#10b981]"/>},
                                    {text: "Free version available", icon: <Check className="h-5 w-5 text-[#10b981]"/>}
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="mr-3">{item.icon}</div>
                                        <span className="text-[#cbd5e1]">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            className="cursor-pointer bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] hover:opacity-90 text-white px-8 py-6 rounded-md text-lg transition-all">
                            <Download className="mr-2 h-5 w-5"/>
                            Install FalconFort Now
                        </Button>

                        <p className="text-[#64748b] text-sm mt-4">
                            Available for Chrome
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0f172a] py-12 border-t border-[#334155]">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-6 md:mb-0">
                            <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2"/>
                            <span className="text-xl font-bold">
                FalconFort
              </span>
                        </div>

                        <div className="mt-6 md:mt-0">
                            <p className="text-[#64748b] text-sm">
                                © {new Date().getFullYear()} FalconFort
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}