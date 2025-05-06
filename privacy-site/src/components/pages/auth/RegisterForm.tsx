import {FormEvent, useState} from "react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Eye, EyeOff} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
}

interface RegisterFormProps {
    onSubmit: (data: RegisterFormData) => void;
    loading: boolean;
    showPassword: boolean;
    togglePasswordVisibility: () => void;
}


function RegisterForm({onSubmit, loading, showPassword, togglePasswordVisibility}: RegisterFormProps) {
    const [registerForm, setRegisterForm] = useState<RegisterFormData>({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(registerForm);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                    id="register-email"
                    type="email"
                    placeholder="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                    <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
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
            <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                />
            </div>
            <div className="flex items-center">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500">
                        Privacy Policy
                    </a>
                </label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Registering...' : 'Create Account'}
            </Button>
        </form>
    );
}

export default RegisterForm;