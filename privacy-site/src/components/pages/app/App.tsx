import {Route, Routes} from 'react-router';
import {LandingPage} from "@/components/pages/landing/LandingPage.tsx";
import AuthPage from '../auth/AuthPage';
import {ProfilePage} from "@/components/pages/profile/ProfilePage.tsx";
import CheckoutForm from "@/components/pages/payment/CheckoutForm.tsx";
import CheckoutReturn from "@/components/pages/payment/CheckoutReturn.tsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/auth/*" element={<AuthPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/checkout" element={<CheckoutForm/>}/>
            <Route path="/return" element={<CheckoutReturn/>}/>
            <Route path="*" element={<LandingPage/>}/>
        </Routes>
    );
};

export default App;