import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as apiClient from "../../api-client";
import { useToast } from "../../contexts/AppContext";

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  // State to track token validation status
  const [tokenStatus, setTokenStatus] = useState<
    "validating" | "valid" | "invalid" | null
  >("validating");
  
  // State to track if password was successfully reset
  const [resetSuccess, setResetSuccess] = useState(false);
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();
  
  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenStatus("invalid");
        return;
      }
      
      try {
        await apiClient.validateResetToken(token);
        setTokenStatus("valid");
      } catch (error) {
        setTokenStatus("invalid");
        showToast({ 
          message: "This password reset link is invalid or has expired", 
          type: "ERROR" 
        });
      }
    };
    
    validateToken();
  }, [token]);
  
  // Password reset mutation
  const resetMutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) => 
      apiClient.resetPassword(token || "", data.password, data.confirmPassword),
    onSuccess: () => {
      showToast({ 
        message: "Password reset successful! You can now log in with your new password.", 
        type: "SUCCESS" 
      });
      setResetSuccess(true);
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/sign-in");
      }, 3000);
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });
  
  const onSubmit = handleSubmit((data) => {
    resetMutation.mutate(data);
  });
  
  // Show appropriate UI based on token validation status
  if (tokenStatus === "validating") {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
          <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin my-4"></div>
          <p className="text-gray-600">Validating your reset link...</p>
        </div>
      </div>
    );
  }
  
  if (tokenStatus === "invalid") {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
          <div className="text-center my-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl text-gray-800 font-semibold mb-2">Invalid or Expired Link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired.
              Please request a new password reset link.
            </p>
            <Link 
              to="/forgot-password"
              className="bg-gradient-to-r from-orange-300 to-orange-500 text-white px-6 py-2 rounded-full font-bold hover:from-orange-400 hover:to-orange-600 transition-colors shadow-md"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        
        {resetSuccess ? (
          <div className="text-center my-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl text-gray-800 font-semibold mb-2">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Link 
              to="/sign-in"
              className="bg-gradient-to-r from-orange-300 to-orange-500 text-white px-6 py-2 rounded-full font-bold hover:from-orange-400 hover:to-orange-600 transition-colors shadow-md"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  {...register("password", {
                    required: "Please enter your password",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    validate: {
                      hasUpperCase: (value) => 
                        /[A-Z]/.test(value) || "Password must contain at least 1 uppercase letter",
                      hasLowerCase: (value) => 
                        /[a-z]/.test(value) || "Password must contain at least 1 lowercase letter",
                      hasNumber: (value) => 
                        /[0-9]/.test(value) || "Password must contain at least 1 number",
                      hasSpecialChar: (value) => 
                        /[!@#$%^&*(),.?":{}|<>]/.test(value) || 
                        "Password must contain at least 1 special character"
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  {...register("confirmPassword", {
                    validate: (val) => {
                      if (!val) {
                        return "Please confirm your password";
                      } else if (watch("password") !== val) {
                        return "Passwords do not match";
                      }
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword.message}</span>
              )}
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={resetMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-300 to-orange-500 text-white py-2 rounded-md font-bold hover:from-orange-400 hover:to-orange-600 transition-colors shadow-sm disabled:opacity-70"
              >
                {resetMutation.isPending ? "Resetting..." : "Reset Password"}
              </button>
            </div>
            
            <div className="text-center">
              <Link to="/sign-in" className="text-orange-500 hover:text-orange-600 font-medium">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;