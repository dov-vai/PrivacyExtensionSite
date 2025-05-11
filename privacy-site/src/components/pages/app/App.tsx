import {Route, Routes} from 'react-router';
import {LandingPage} from "@/components/pages/landing/LandingPage.tsx";
import AuthPage from '../auth/AuthPage';
import {ProfilePage} from "@/components/pages/profile/ProfilePage.tsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/auth/*" element={<AuthPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="*" element={<LandingPage/>}/>
        </Routes>
    );
};

export default App;