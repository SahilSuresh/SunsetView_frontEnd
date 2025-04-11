import { useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useToast } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export type LoginFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  
  // State for unverified user email (for resend verification option)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // State for resend verification loading
  const [resendingVerification, setResendingVerification] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<LoginFormData>();
  
  const watchEmail = watch("email");

  const mutation = useMutation({
    mutationFn: apiClient.signIn,
    onSuccess: async () => {
      showToast({ message: "Sign in Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      // Reset unverified email if login is successful
      setUnverifiedEmail(null);
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error, variables) => {
      // Check if the error response indicates email verification required
      if (error.message.includes("verify your email")) {
        setUnverifiedEmail(variables.email);
        showToast({ message: error.message, type: "ERROR" });
      } else {
        setUnverifiedEmail(null);
        showToast({ message: "Invalid email or password", type: "ERROR" });
      }
    },
  });
  
  // Resend verification email mutation
  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    
    setResendingVerification(true);
    try {
      await apiClient.resendVerificationEmail(unverifiedEmail);
      showToast({ 
        message: "Verification email sent. Please check your inbox.", 
        type: "SUCCESS" 
      });
    } catch (error) {
      showToast({ 
        message: error instanceof Error ? error.message : "Failed to resend verification email", 
        type: "ERROR" 
      });
    } finally {
      setResendingVerification(false);
    }
  };

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
      <form className="flex flex-col gap-5 bg-white rounded-lg shadow-md p-6" onSubmit={onSubmit}>
        <h2 className="text-2xl sm:text-3xl font-bold">Sign In</h2>

        {unverifiedEmail && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-2">
            <h3 className="text-sm font-medium text-yellow-800 mb-1">Email verification required</h3>
            <p className="text-sm text-yellow-700 mb-2">
              Please verify your email address before signing in.
            </p>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendingVerification}
              className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
            >
              {resendingVerification ? "Sending..." : "Resend verification email"}
            </button>
          </div>
        )}

        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            type="email"
            className="border rounded w-full py-2 px-3 font-normal mt-1"
            {...register("email", {
              required: "Please enter your email",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
          ></input>
          {errors.email && (
            <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
          )}
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Password
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="border rounded w-full py-2 px-3 font-normal mt-1"
              {...register("password", {
                required: "Please enter your password",
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 top-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
          )}
        </label>
        
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600">
            Forgot your password?
          </Link>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center pt-2">
          <div className="flex flex-col">
            <span className="text-sm">Not Registered?</span>
            <Link className="text-sm underline text-orange-600" to="/register">Join Now</Link>
          </div>
          
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-300 to-orange-500 text-white p-3 text-base font-bold hover:from-orange-400 hover:to-orange-600 rounded-3xl w-full sm:w-auto sm:px-6 transition-colors shadow-sm"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Login..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;