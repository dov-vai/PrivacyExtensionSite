import {Route, Routes} from 'react-router';
import {LandingPage} from "@/components/pages/landing/LandingPage.tsx";
import AuthPage from '../auth/AuthPage';
import {ProfilePage} from "@/components/pages/profile/ProfilePage.tsx";
import CheckoutForm from "@/components/pages/payment/CheckoutForm.tsx";
import CheckoutReturn from "@/components/pages/payment/CheckoutReturn.tsx";
import EmailVerified from "@/components/pages/verification/EmailVerified.tsx";
import VerifyExpired from "@/components/pages/verification/VerifyExpired.tsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/auth/*" element={<AuthPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/checkout" element={<CheckoutForm/>}/>
            <Route path="/return" element={<CheckoutReturn/>}/>
            <Route path="/verified" element={<EmailVerified/>}/>
            <Route path="/expired" element={<VerifyExpired/>}/>
            <Route path="*" element={<LandingPage/>}/>
        </Routes>
    );
};

export default App;