import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useToast } from "../contexts/AppContext";

interface SignOutButtonProps {
  className?: string;
}

const SignOutButton = ({ className = "" }: SignOutButtonProps) => {
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

    // Use provided className or default styling
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