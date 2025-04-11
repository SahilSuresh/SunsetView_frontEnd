import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from '../api-client';
import { loadStripe, Stripe } from "@stripe/stripe-js";

// Get Stripe publishable key from environment variables
const stripePublishableKey = import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY || "";

// Define types for toast messages
type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

// Define context type
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  stripePromise: Promise<Stripe | null>;
};

// Create context
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Initialize Stripe promise once to avoid recreating it on every render
const stripePromise = loadStripe(stripePublishableKey);

// Main toast and auth provider
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastMessage, setToastMessage] = useState<ToastMessage | undefined>(undefined);

  // Inside your ToastProvider component
const { isError, data } = useQuery({
  queryKey: ["validateToken"],
  queryFn: apiClient.validateToken,
  retry: false,
  // Add this option to prevent automatic refetching when validation fails
  refetchOnWindowFocus: false
});

// Determine if user is logged in based on the response
const isLoggedIn = !isError && data?.isAuthenticated !== false;

  return (
    <AppContext.Provider
      value={{
        showToast: (message: ToastMessage) => {
          setToastMessage(message);
        },
        isLoggedIn: !isError,
        stripePromise
      }}
    >
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={() => setToastMessage(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the app context
export const useToast = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};