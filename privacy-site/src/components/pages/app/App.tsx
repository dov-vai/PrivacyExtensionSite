import {Navigate, Route, Routes, useNavigate} from 'react-router';
import LandingPage from "@/components/pages/landing/LandingPage.tsx";
import AuthPage from "@/components/pages/auth/AuthPage.tsx";
import {ReactNode} from "react";
import {API_HOST} from "@/lib/common.ts";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        fetch(API_HOST + '/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).catch(err => {
            console.error('Error during logout:', err);
        }).finally(() => {
            localStorage.removeItem('token');
            navigate('/login');
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4">PrivacyGuard Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>
            <p>Welcome to your privacy dashboard! This area would contain your privacy statistics and settings.</p>
        </div>
    );
};

const ProtectedRoute = ({children}: { children: ReactNode }) => {
    const isAuthenticated = true;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return children;
};

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/auth/*" element={<AuthPage/>}/>
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard/>
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
};

export default App;