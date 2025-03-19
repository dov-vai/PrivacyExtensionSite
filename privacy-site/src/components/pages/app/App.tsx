import {Navigate, Route, Routes} from 'react-router';
import LandingPage from "@/components/pages/landing/LandingPage.tsx";
import AuthPage from "@/components/pages/auth/AuthPage.tsx";
import {ReactNode} from "react";

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-2xl font-bold mb-4">PrivacyGuard Dashboard</h1>
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