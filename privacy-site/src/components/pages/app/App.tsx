import {Navigate, Route, Routes} from 'react-router';
import LandingPage from "@/components/pages/landing/LandingPage.tsx";
import AuthPage from "@/components/pages/auth/AuthPage.tsx";
import {ReactNode} from "react";
import Dashboard from "@/components/pages/dashboard/Dashboard.tsx";

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