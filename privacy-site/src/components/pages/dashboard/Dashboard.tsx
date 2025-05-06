import {useNavigate} from "react-router";
import {API_HOST} from "@/lib/common.ts";
import DeleteAccount from "@/components/pages/dashboard/DeleteAccount.tsx";
import RetryVerification from "@/components/pages/dashboard/RetryVerification.tsx";

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        fetch(API_HOST + '/logout', {
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
        <>
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold mb-4">PrivacyGuard Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                </div>
                <p>Welcome to your privacy dashboard! This area would contain your privacy statistics and settings.</p>

                <DeleteAccount />
                <RetryVerification />
            </div>
        </>
        
    );
}

export default Dashboard;