import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useState } from "react";
import { useToast } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

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
  
  const { 
    register, 
    watch, 
    handleSubmit, 
    formState: { errors }, 
  } = useForm<RegisterFormData>();

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) => apiClient.register(data),
    onSuccess: async () => {
        showToast({message: "Registration confirmed!", type:"SUCCESS"});
        await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
        navigate("/");
    },
    onError: (error: Error) => {
        showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

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

        <div className="pt-2">
          <button
            type="submit" 
            className="bg-orange-600 text-white p-3 text-base font-bold hover:bg-orange-400 rounded-3xl w-full sm:w-auto sm:px-6"
            disabled={mutation.isPending}>
            {mutation.isPending ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;