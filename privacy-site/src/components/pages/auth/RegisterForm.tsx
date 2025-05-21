import {FormEvent, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {AlertTriangle, Eye, EyeOff, Lock, Mail, MoveLeft, User} from 'lucide-react';
import {API_HOST} from "@/lib/common.ts";
import {Link, useNavigate} from "react-router";

export function RegisterForm() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(API_HOST + '/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: email, password: password}),
            });

            if (!response.ok) throw new Error('Registration failed');

            navigate('/auth/login', {state: {message: "Account registered successfully. Please verify your email before logging in."}});
            setIsLoading(false);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to register. Please try again.');
            }
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-[#1e293b] border-[#334155]">
            <CardHeader>
                <Link to="/">
                    <MoveLeft className="text-[#cbd5e1]"/>
                </Link>

                <div className="flex justify-center mb-4">
                    <div
                        className="w-14 h-14 rounded-full bg-gradient-to-r from-[#0ea5e9]/20 to-[#2dd4bf]/20 flex items-center justify-center">
                        <User className="h-8 w-8 text-[#2dd4bf]"/>
                    </div>
                </div>
                <CardTitle className="text-[#f8fafc] text-center text-2xl">Create Account</CardTitle>
                <CardDescription className="text-[#cbd5e1] text-center">Join FalconFort and take control of your
                    privacy</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert className="bg-red-500/10 text-red-500 border border-red-500/30">
                            <AlertTriangle className="h-4 w-4"/>
                            <AlertDescription className="text-[#cbd5e1]">{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-[#cbd5e1]">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-[#64748b]"/>
                            <Input
                                id="register-email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-[#0f172a] border-[#334155] pl-10 text-[#f8fafc] focus:border-[#0ea5e9] focus:ring-[#0ea5e9]/20"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-[#cbd5e1]">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-[#64748b]"/>
                            <Input
                                id="register-password"
                                type={passwordVisible ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-[#0f172a] border-[#334155] pl-10 pr-10 text-[#f8fafc] focus:border-[#0ea5e9] focus:ring-[#0ea5e9]/20"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="cursor-pointer absolute right-3 top-3 text-[#64748b] hover:text-[#cbd5e1]"
                            >
                                {passwordVisible ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-[#cbd5e1]">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-[#64748b]"/>
                            <Input
                                id="confirm-password"
                                type={passwordVisible ? "text" : "password"}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-[#0f172a] border-[#334155] pl-10 text-[#f8fafc] focus:border-[#0ea5e9] focus:ring-[#0ea5e9]/20"
                                required
                            />
                        </div>
                    </div>

                    {/*<div className="flex items-center space-x-2">*/}
                    {/*    <Switch id="terms" className="data-[state=checked]:bg-[#0ea5e9]" />*/}
                    {/*    <Label htmlFor="terms" className="text-xs text-[#cbd5e1]">*/}
                    {/*        I agree to the <a href="#" className="text-[#0ea5e9] hover:text-[#2dd4bf]">Terms of Service</a> and <a href="#" className="text-[#0ea5e9] hover:text-[#2dd4bf]">Privacy Policy</a>*/}
                    {/*    </Label>*/}
                    {/*</div>*/}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer w-full bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] hover:opacity-90 text-white"
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}