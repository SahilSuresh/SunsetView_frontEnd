import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useState } from "react"; // Add this for state management

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
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
    onSuccess: () => {
        console.log("Registration successful");
    },
    onError: (error: Error) => {
        console.log(error.message);
    }
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-2xl font-bold mx-5">Create an Account</h2>
      
      {/* Display any API errors */}
      {mutation.isError && (
        <div className="text-red-500 mx-5">
          {mutation.error instanceof Error ? mutation.error.message : "An error occurred"}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-5 mx-5">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", {
              required: "Please enter your first name",
            })}
          ></input>
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", {
              required: "Please enter your last name",
            })}
          ></input>
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>

      <label className="text-gray-700 text-sm font-bold flex-1 mx-5">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { 
            required: "Please enter your email",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address"
            }
          })}
        ></input>
        {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
      </label>

      <label className="text-gray-700 text-sm font-bold flex-1 mx-5">
        Password
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="border rounded w-full py-1 px-2 font-normal"
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
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-sm font-bold flex-1 mx-5">
        ConfirmPassword
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="border rounded w-full py-1 px-2 font-normal"
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
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>

      <span>
        <button
        type="submit" 
        className="bg-orange-600 text-white p-3 text-1xl font-bold hover:bg-orange-400 mx-5 rounded-3xl"
        disabled={mutation.isPending}>
          {mutation.isPending ? "Creating Account..." : "Create Account"}
        </button>
      </span>
    </form>
  );
};

export default Register;