import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {AlertTriangle, Trash2} from "lucide-react";
import {API_HOST} from "@/lib/common.ts";
import {useNavigate} from "react-router";
import {useState} from "react";
import {Alert, AlertDescription} from "@/components/ui/alert.tsx";
import {Input} from "@/components/ui/input.tsx";

function DeleteAccount() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setError("");
        try {
            const response = await fetch(API_HOST + '/users/delete', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({password})
            });

            if (response.ok) {
                localStorage.removeItem('token');
                navigate('/auth/login');
            }

            if (response.status === 400) {
                const data = await response.json();

                if (data.error) {
                    setError(data.error);
                }
            }
        } catch (error) {
            console.error('Error during deletion:', error);
        }
    }

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="bg-[#334155] w-full justify-start border-[#334155] text-red-500 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500"
                    >
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Delete Account
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#1e293b] border-[#334155] text-[#f8fafc]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#f8fafc]">Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#cbd5e1]">
                            This action cannot be undone. This will permanently delete your account and remove your data
                            from our servers.
                        </AlertDialogDescription>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Confirm password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-[#0f172a] border-[#334155] text-[#f8fafc] focus:border-[#0ea5e9] focus:ring-[#0ea5e9]/20"
                            required
                        />
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="bg-[#334155] text-[#cbd5e1] hover:bg-[#475569] hover:text-[#f8fafc]">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={handleDelete}
                        >
                            Delete Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {error && (
                <Alert className="bg-red-500/10 text-red-500 border border-red-500/30">
                    <AlertTriangle className="h-4 w-4"/>
                    <AlertDescription className="text-[#cbd5e1]">Account deletion error: {error}</AlertDescription>
                </Alert>
            )}
        </>
    )
}

export default DeleteAccount;