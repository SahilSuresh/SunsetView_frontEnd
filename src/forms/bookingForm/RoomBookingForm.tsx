import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useStripe,
  useElements,
  PaymentElement
} from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import * as apiClient from "../../api-client";
import { useToast } from "../../contexts/AppContext";
import { useSearch } from "../../contexts/SearchContext";
import { PaymentIntentResponse, UserType } from "../../../../backEnd/src/share/type";

type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childrenCount: number;
  checkIn: Date;
  checkOut: Date;
  hotelId: string;
  paymentIntentId: string;
  bookingTotalCost: number;
};

const RoomBookingForm = ({ currentUser, paymentIntent }: Props) => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const search = useSearch();
  const { showToast } = useToast();
  
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  // Check if this payment intent has already been processed
  useEffect(() => {
    if (!stripe) return;
    
    // Try to retrieve the payment intent on load
    const checkPaymentStatus = async () => {
      if (paymentIntent.clientSecret) {
        const { paymentIntent: retrievedIntent } = await stripe.retrievePaymentIntent(
          paymentIntent.clientSecret
        );
        
        if (retrievedIntent) {
          switch (retrievedIntent.status) {
            case "succeeded":
              setMessage("Payment succeeded!");
              setIsPaymentComplete(true);
              break;
            case "processing":
              setMessage("Your payment is processing.");
              break;
            case "requires_payment_method":
              setMessage("Please enter your payment details.");
              break;
            default:
              setMessage("Something went wrong.");
              break;
          }
        }
      }
    };
    
    checkPaymentStatus();
  }, [stripe, paymentIntent.clientSecret]);

  const { mutate: createBookingRoom } = useMutation({
    mutationFn: apiClient.createBooking,
    onSuccess: (data) => {
      showToast({
        message: data?.message || "Booking created successfully",
        type: "SUCCESS"
      });
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
      setIsSubmitting(false);
    },
    onError: (error) => {
      showToast({
        message: error instanceof Error 
          ? error.message 
          : "Failed to create booking",
        type: "ERROR"
      });
      setIsSubmitting(false);
    }
  });

  const handlePaymentChange = (event: any) => {
    setIsPaymentComplete(event.complete);
    if (event.error) {
      setMessage(event.error.message);
    } else {
      setMessage(null);
    }
  };

  const handleBooking = async () => {
    if (!stripe || !elements || isSubmitting) {
      return;
    }
    
    // Set state to prevent multiple submissions
    setIsSubmitting(true);
    
    try {
      // Create the form data
      const formData: BookingFormData = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        adultCount: search.adultCount,
        childrenCount: search.childrenCount,
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        hotelId: hotelId || "",
        bookingTotalCost: paymentIntent.bookingTotalCost,
        paymentIntentId: paymentIntent.paymentIntentId,
      };
      
      // First confirm the payment with Stripe
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required' // Only redirect if required
      });
      
      if (confirmError) {
        setMessage(confirmError.message || "Payment failed");
        showToast({ 
          message: confirmError.message || "Payment confirmation failed", 
          type: "ERROR" 
        });
        setIsSubmitting(false);
        return;
      }
      
      // Once payment is confirmed, create the booking
      createBookingRoom(formData);
      
    } catch (error) {
      console.error("Error processing payment:", error);
      showToast({ 
        message: error instanceof Error 
          ? `Error: ${error.message}` 
          : "Error processing request",
        type: "ERROR" 
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 rounded-lg overflow-hidden border border-gray-200 shadow-md bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-300 to-orange-500 px-6 py-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Confirm Your Details</h2>
      </div>
      
      <div className="px-6 pb-6 space-y-6">
        {/* Personal Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-gray-600 text-sm font-medium block">
                First Name
              </label>
              <input
                className="w-full py-2 px-3 text-gray-700 bg-gray-100 font-normal rounded border border-gray-200"
                type="text"
                readOnly
                disabled
                value={currentUser.firstName}
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-600 text-sm font-medium block">
                Last Name
              </label>
              <input
                className="w-full py-2 px-3 text-gray-700 bg-gray-100 font-normal rounded border border-gray-200"
                type="text"
                readOnly
                disabled
                value={currentUser.lastName}
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-gray-600 text-sm font-medium block">
                Email
              </label>
              <input
                className="w-full py-2 px-3 text-gray-700 bg-gray-100 font-normal rounded border border-gray-200"
                type="email"
                readOnly
                disabled
                value={currentUser.email}
              />
            </div>
          </div>
        </div>

        {/* Booking Total */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Booking Summary</h3>
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-md border border-orange-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Cost:</span>
              <span className="font-bold text-xl text-gray-800">£{paymentIntent.bookingTotalCost.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">Includes VAT and all applicable charges</div>
          </div>
        </div>

        {/* Payment Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Details</h3>
          <div className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
            <PaymentElement onChange={handlePaymentChange} />
            {message && <div className="text-xs text-gray-500 mt-3">{message}</div>}
            <div className="text-xs text-gray-500 mt-3">
              Your card information is encrypted and secure. We never store your full card details.
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button 
            disabled={isSubmitting || !isPaymentComplete || !stripe || !elements}
            onClick={handleBooking}
            type="button"
            className={`w-full sm:w-auto sm:ml-auto sm:block px-8 py-3 rounded-full text-lg transition-colors duration-300 shadow-md ${
              isSubmitting || !isPaymentComplete || !stripe || !elements
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-300 to-orange-500 hover:from-orange-400 hover:to-orange-600 text-white font-bold"
            }`}
          >
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomBookingForm;