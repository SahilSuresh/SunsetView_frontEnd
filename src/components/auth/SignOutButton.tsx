import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../../api-client";
import { useToast } from "../../contexts/AppContext";

interface SignOutButtonProps {
  className?: string;
}

const SignOutButton = ({ className = "" }: SignOutButtonProps) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const mutation = useMutation({
        mutationFn: apiClient.signOut,
        onSuccess: async () => {
            // First, remove the validateToken query from cache 
            // instead of invalidating it
            queryClient.removeQueries({ queryKey: ["validateToken"] });
            
            // Then show the toast message
            showToast({ message: "Signed Out!", type: "SUCCESS" });
            
            // Optionally, you can set a default value for the validateToken query
            queryClient.setQueryData(["validateToken"], { isAuthenticated: false });
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
            className={className}
        >
            Sign Out
        </button>
    );
};

export default SignOutButton;