import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useState } from "react";
import { useToast } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State to track if registration was successful but requires verification
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  
  const { 
    register, 
    watch, 
    handleSubmit, 
    formState: { errors }, 
  } = useForm<RegisterFormData>();

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => apiClient.register(data),
    onSuccess: async (data) => {
      // Check if registration requires email verification
      if (data.requiresVerification) {
        setRegistrationComplete(true);
        setRegisteredEmail(watch("email"));
        showToast({
          message: "Registration successful! Please check your email to verify your account.",
          type: "SUCCESS"
        });
      } else {
        // If no verification needed, proceed as before
        showToast({message: "Registration confirmed!", type:"SUCCESS"});
        await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
        navigate("/");
      }
    },
    onError: (error: Error) => {
        showToast({ message: error.message, type: "ERROR" });
    },
  });
  
  // Handle resend verification email
  const [resendingEmail, setResendingEmail] = useState(false);
  
  const handleResendVerification = async () => {
    if (!registeredEmail) return;
    
    setResendingEmail(true);
    try {
      await apiClient.resendVerificationEmail(registeredEmail);
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
      setResendingEmail(false);
    }
  };

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  // Show success message after registration
  if (registrationComplete) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col gap-5 bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification email to <strong>{registeredEmail}</strong>.
              Please check your inbox and click the verification link to complete your registration.
            </p>
            
            <div className="mb-4 text-sm text-gray-600">
              Didn't receive the email? Check your spam folder or click below to resend.
            </div>
            
            <button
              onClick={handleResendVerification}
              disabled={resendingEmail}
              className="bg-gradient-to-r from-orange-300 to-orange-500 text-white px-6 py-2 rounded-full font-bold hover:from-orange-400 hover:to-orange-600 transition-colors shadow-md disabled:opacity-70 mb-4"
            >
              {resendingEmail ? "Sending..." : "Resend Verification Email"}
            </button>
            
            <div className="mt-4">
              <Link to="/sign-in" className="text-orange-500 hover:text-orange-600 font-medium">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
      <form className="flex flex-col gap-5 bg-white rounded-lg shadow-md p-6" onSubmit={onSubmit}>
        <h2 className="text-2xl sm:text-3xl font-bold">Create an Account</h2>
        
        {/* Display any API errors */}
        {mutation.isError && (
          <div className="text-red-500">
            {mutation.error instanceof Error ? mutation.error.message : "An error occurred"}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-5">
          <label className="text-gray-700 text-sm font-bold flex-1">
            First Name
            <input
              className="border rounded w-full py-2 px-3 font-normal mt-1"
              {...register("firstName", {
                required: "Please enter your first name",
              })}
            />
            {errors.firstName && (
              <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>
            )}
          </label>

          <label className="text-gray-700 text-sm font-bold flex-1">
            Last Name
            <input
              className="border rounded w-full py-2 px-3 font-normal mt-1"
              {...register("lastName", {
                required: "Please enter your last name",
              })}
            />
            {errors.lastName && (
              <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>
            )}
          </label>
        </div>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            type="email"
            className="border rounded w-full py-2 px-3 font-normal mt-1"
            {...register("email", { 
              required: "Please enter your email",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address"
              }
            })}
          />
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

        <label className="text-gray-700 text-sm font-bold flex-1">
          Confirm Password
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="border rounded w-full py-2 px-3 font-normal mt-1"
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
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 top-1"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</span>
          )}
        </label>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center pt-2">
          <div className="flex flex-col">
            <span className="text-sm">Already registered?</span>
            <Link className="text-sm underline text-orange-600" to="/sign-in">Sign in here</Link>
          </div>
          
          <button
            type="submit" 
            className="bg-gradient-to-r from-orange-300 to-orange-500 text-white p-3 text-base font-bold hover:from-orange-400 hover:to-orange-600 rounded-3xl w-full sm:w-auto sm:px-6 transition-colors shadow-sm"
            disabled={mutation.isPending}>
            {mutation.isPending ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;