import {FormEvent, useState} from "react";
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Eye, EyeOff} from "lucide-react";

export interface LoginFormData {
    email: string;
    password: string;
}

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
    loading: boolean;
    showPassword: boolean;
    togglePasswordVisibility: () => void;
}

function LoginForm({onSubmit, loading, showPassword, togglePasswordVisibility}: LoginFormProps) {
    const [loginForm, setLoginForm] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(loginForm);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                    </a>
                </div>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400"/>
                        ) : (
                            <Eye className="h-5 w-5 text-gray-400"/>
                        )}
                    </button>
                </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    );
}

export default LoginForm;