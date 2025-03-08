import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useToast } from "../contexts/AppContext";

const SignOutButton = () => {
    //code to make sure you do not have to reload the page when you sign out 
    const queryClient = useQueryClient();
    const { showToast } = useToast()

    const mutation = useMutation({
        mutationFn: apiClient.signOut,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
          // Handle successful sign out
          showToast({message: "Signed Out!", type: "SUCCESS"})
        }, 
        onError: (error: Error) => {
          // Handle error
          showToast({message: error.message, type: "ERROR"})
        },
      });

      const handleClick = () => {
        mutation.mutate();
      }

    return (
        <button onClick={handleClick}className="flex items-center bg-white text-orange-600 px-3 py-2 text-sm md:text-base font-bold hover:bg-orange-500 hover:text-white rounded-2xl">
        Sign Out
      </button>
    )
}

export default SignOutButton;