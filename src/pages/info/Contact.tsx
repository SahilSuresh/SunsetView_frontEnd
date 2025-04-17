// pages/Contact.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/AppContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as apiClient from "../../api-client";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  bookingId?: string;
};

const Contact = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCancellation, setIsCancellation] = useState(false);
  
  // Get current user data to pre-fill the form
  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: apiClient.getCurrentUser,
    // Only fetch if we're logged in
    enabled: location.search.includes("bookingId"),
    retry: false,
    refetchOnWindowFocus: false
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ContactFormData>();
  
  // Get the subject and watch it for changes
  const watchSubject = watch("subject");
  
  // Check if this is a cancellation request (from query params)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookingId = params.get("bookingId");
    const hotelName = params.get("hotel");
    const bookingDate = params.get("date");
    
    if (bookingId && hotelName) {
      setIsCancellation(true);
      setValue("subject", "Booking Cancellation Request");
      setValue("message", 
        `I would like to request cancellation for my booking:\n\n` +
        `Booking ID: ${bookingId}\n` +
        `Hotel: ${hotelName}\n` +
        (bookingDate ? `Date: ${bookingDate}\n\n` : "\n\n") +
        `Reason for cancellation:\n\n` +
        `[Please provide your reason here]`
      );
      
      // Store booking ID in a hidden field
      setValue("bookingId", bookingId);
      
      // Auto-fill name and email if user data is available
      if (userData) {
        setValue("name", `${userData.firstName} ${userData.lastName}`);
        setValue("email", userData.email);
      }
    }
  }, [location.search, setValue, userData]);
  
  // Detect when subject changes to/from cancellation
  useEffect(() => {
    if (watchSubject === "Booking Cancellation Request") {
      setIsCancellation(true);
    } else if (isCancellation && watchSubject !== "Booking Cancellation Request") {
      setIsCancellation(false);
    }
  }, [watchSubject, isCancellation]);
  
  // Submit contact form
  const mutation = useMutation({
    mutationFn: (data: ContactFormData) => apiClient.submitContactForm(data),
    onSuccess: () => {
      showToast({ 
        message: isCancellation 
          ? "Cancellation request sent! We'll review it shortly." 
          : "Message sent successfully! We'll get back to you soon.", 
        type: "SUCCESS" 
      });
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });
  
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>
          
          {isCancellation && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-orange-700">
                    You're submitting a booking cancellation request. Our team will review it and get back to you within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                {...register("subject", { required: "Subject is required" })}
              >
                <option value="">Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Booking Question">Booking Question</option>
                <option value="Booking Cancellation Request">Booking Cancellation Request</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </select>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                rows={6}
                className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                {...register("message", { 
                  required: "Message is required",
                  minLength: {
                    value: 10,
                    message: "Message must be at least 10 characters"
                  }
                })}
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>
            
            {isCancellation && (
              <input type="hidden" {...register("bookingId")} />
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70"
              >
                {mutation.isPending 
                  ? (isCancellation ? "Sending Request..." : "Sending...") 
                  : (isCancellation ? "Send Cancellation Request" : "Send Message")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;