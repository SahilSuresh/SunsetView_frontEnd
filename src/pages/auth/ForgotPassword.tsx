import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as apiClient from "../../api-client";
import { useToast } from "../../contexts/AppContext";

type ForgotPasswordFormData = {
  email: string;
};

const ForgotPassword = () => {
  const { showToast } = useToast();
  const [emailSent, setEmailSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();
  
  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) => 
      apiClient.requestPasswordReset(data.email),
    onSuccess: () => {
      showToast({ 
        message: "Check your email for password reset instructions", 
        type: "SUCCESS" 
      });
      setEmailSent(true);
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });
  
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });
  
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
        
        {emailSent ? (
          <div className="text-center my-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl text-gray-800 font-semibold mb-2">Email Sent!</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to your email address.
              Please check your inbox (and spam folder) for the email.
            </p>
            <p className="text-gray-600 mb-4">
              The link will expire in 1 hour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setEmailSent(false)}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Try a different email
              </button>
              <Link 
                to="/sign-in"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>
              )}
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-gradient-to-r from-orange-300 to-orange-500 text-white py-2 rounded-md font-bold hover:from-orange-400 hover:to-orange-600 transition-colors shadow-sm disabled:opacity-70"
              >
                {mutation.isPending ? "Sending..." : "Reset Password"}
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

export default ForgotPassword;