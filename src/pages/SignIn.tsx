import { useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { useToast } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type LoginFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Moved state hooks inside the component
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormData>();

  const mutation = useMutation({
    mutationFn: apiClient.signIn,
    onSuccess: async () => {
      showToast({ message: "Sign in Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: "Sign in Unsuccessful!", type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold mx-5">Sign In</h2>

      <label className="text-gray-700 text-sm font-bold flex-1 mx-5">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", {
            required: "Please enter your email",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
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
      
      <div className="flex flex-col mx-5 gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col">
          <span className="text-sm">Not Register?</span>
          <Link className="text-sm underline text-orange-600" to="/register">Join Now</Link>
        </div>
        
        <button
          type="submit"
          className="bg-orange-600 text-white p-3 text-1xl font-bold hover:bg-orange-400 rounded-3xl"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Signin..." : "Login"}
        </button>
      </div>
    </form>
  );
};

export default SignIn;