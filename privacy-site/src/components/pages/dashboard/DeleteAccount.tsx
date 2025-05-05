import {useNavigate} from "react-router";
import {useState} from "react";
import {API_HOST} from "@/lib/common.ts";

interface DeletionData {
    password: string;
}

function DeleteAccount() {
    const navigate = useNavigate();
    const [deletionData, setDeletionData] = useState<DeletionData>({password: ""});
    const [error, setError] = useState("");
    
    const handleDelete = async () => {
        try {
            const response = await fetch(API_HOST + '/users/delete', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deletionData)
            });
            
            if (response.ok) {
                localStorage.removeItem('token');
                navigate('/auth/login');
            }
            
            if (response.status === 400) {
                const data = await response.json();
                
                if (data.error){
                    setError(data.error);
                }
            }
        } catch (error) {
            console.error('Error during deletion:', error);
        }
    }
    
    return (
        <>
            <p>Delete account?</p>
            <input type='password'
                   placeholder="Enter password"
                   value={deletionData.password}
                   onChange={e => setDeletionData({password: e.currentTarget.value})}
            />
            <button onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Delete Account
            </button>

            {error && 
                <p>{error}</p>
            }
        </>
    )
}

export default DeleteAccount;