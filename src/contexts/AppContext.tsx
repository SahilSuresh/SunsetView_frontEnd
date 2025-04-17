import React, { useContext, useState, useEffect } from "react";
import Toast from "../components/common/Toast";
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

// Define context type - Updated to include isAdmin
type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  isAdmin: boolean; // For admin status
  stripePromise: Promise<Stripe | null>;
};

// Create context
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Initialize Stripe promise once to avoid recreating it on every render
const stripePromise = loadStripe(stripePublishableKey);

// Main toast and auth provider
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastMessage, setToastMessage] = useState<ToastMessage | undefined>(undefined);

  // Inside your ToastProvider component - updated to properly handle isAdmin
  const { isError, data, refetch } = useQuery({
    queryKey: ["validateToken"],
    queryFn: apiClient.validateToken,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  // Add a side effect to log authentication data for debugging
  useEffect(() => {
    console.log("Auth data:", { isError, data });
    console.log("isAdmin status:", data?.isAdmin);
  }, [isError, data]);

  // Determine if user is logged in based on the response
  const isLoggedIn = !isError && data?.userId !== undefined;
  
  // Determine if user is an admin - ensure we check for exactly true
  const isAdmin = !isError && data?.isAdmin === true;

  // For debugging in development
  if (process.env.NODE_ENV !== 'production') {
    console.log("Auth state:", { isLoggedIn, isAdmin, data });
  }

  return (
    <AppContext.Provider
      value={{
        showToast: (message: ToastMessage) => {
          setToastMessage(message);
        },
        isLoggedIn,
        isAdmin,
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