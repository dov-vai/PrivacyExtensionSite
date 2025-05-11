import {LogOut} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {API_HOST} from "@/lib/common.ts";
import {useNavigate} from "react-router";

function Logout() {
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
            navigate('/auth/login');
        });
    }

    return (
        <Button
            variant="outline"
            className="bg-[#334155] w-full justify-start border-[#334155] text-[#cbd5e1] hover:bg-[#334155] hover:text-[#f8fafc] hover:border-[#0ea5e9]"
            onClick={handleLogout}
        >
            <LogOut className="mr-2 h-4 w-4"/>
            Logout
        </Button>
    )
}

export default Logout;