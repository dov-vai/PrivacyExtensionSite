import {useState} from 'react';
import {Link, Navigate, Route, Routes, useLocation, useNavigate} from 'react-router';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {AlertCircle, Shield} from 'lucide-react';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {PRODUCT_NAME, API_HOST} from "@/lib/common.ts";
import LoginForm, {LoginFormData} from "@/components/pages/auth/LoginForm.tsx";
import RegisterForm, {RegisterFormData} from "@/components/pages/auth/RegisterForm.tsx";


function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (loginData: LoginFormData) => {
        setError('');
        setLoading(true);

        try {
            const response = await fetch(API_HOST + '/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(loginData),
            });

            if (!response.ok) throw new Error('Login failed');
            
            const data = await response.json();
            
            localStorage.setItem("token", data.token);
            
            setTimeout(() => {
                navigate('/dashboard');
                setLoading(false);
            }, 1000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to login. Please try again.');
            }
            setLoading(false);
        }
    };

    const handleRegister = async (registerData: RegisterFormData) => {
        setError('');

        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(API_HOST + '/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(registerData),
            });

            if (!response.ok) throw new Error('Registration failed');

            setTimeout(() => {
                navigate('/dashboard');
                setLoading(false);
            }, 1000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to register. Please try again.');
            }
            setLoading(false);
        }
    };

    const isLoginPage = location.pathname === '/auth/login';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Shield className="h-12 w-12 text-indigo-600"/>
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">{PRODUCT_NAME}</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Protect your privacy with just a few clicks
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card>
                    <CardHeader>
                        <Tabs value={isLoginPage ? 'login' : 'register'}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login" asChild>
                                    <Link to="/auth/login">Login</Link>
                                </TabsTrigger>
                                <TabsTrigger value="register" asChild>
                                    <Link to="/auth/register">Register</Link>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4"/>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Routes>
                            <Route
                                path="login"
                                element={
                                    <LoginForm
                                        onSubmit={handleLogin}
                                        loading={loading}
                                        showPassword={showPassword}
                                        togglePasswordVisibility={togglePasswordVisibility}
                                    />
                                }
                            />
                            <Route
                                path="register"
                                element={
                                    <RegisterForm
                                        onSubmit={handleRegister}
                                        loading={loading}
                                        showPassword={showPassword}
                                        togglePasswordVisibility={togglePasswordVisibility}
                                    />
                                }
                            />
                            <Route path="*" element={<Navigate to="login" replace/>}/>
                        </Routes>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link
                            to="/"
                            className="text-sm text-gray-600 hover:text-indigo-600 flex items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Back to home
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default AuthPage;