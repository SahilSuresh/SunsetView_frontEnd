import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useToast } from "../contexts/AppContext";

const SignOutButton = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation({
        mutationFn: apiClient.signOut,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
            showToast({ message: "Signed Out!", type: "SUCCESS" });
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });

    const handleClick = () => {
        mutation.mutate();
    };

    return (
        <button 
            onClick={handleClick}
            className="flex items-center bg-white/10 border border-white text-white px-4 py-2 font-bold hover:bg-white hover:text-orange-500 transition-colors rounded-full"
        >
            Sign Out
        </button>
    );
};

export default SignOutButton;