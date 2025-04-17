import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../../api-client";
import { useParams, useNavigate } from "react-router-dom";
import RoomBookingForm from "../../forms/bookingForm/RoomBookingForm";
import { useSearch } from "../../contexts/SearchContext";
import { useEffect, useState } from "react";
import BookingOverview from "../../components/booking/BookingOverview";
import { Elements } from "@stripe/react-stripe-js";
import { useToast } from "../../contexts/AppContext";
import { HotelType, PaymentIntentResponse, UserType } from "../../../../backEnd/src/share/type";

const Booking = () => {
  const { stripePromise } = useToast();
  const search = useSearch();
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [numberOfNight, setNumberOfNight] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    console.log("Booking component mounted with hotelId:", hotelId);
    
    if (search.checkIn && search.checkOut) {
      // Calculate days between dates correctly
      const checkInTime = search.checkIn.getTime();
      const checkOutTime = search.checkOut.getTime();
      const diffTime = Math.max(0, checkOutTime - checkInTime);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setNumberOfNight(diffDays);
      console.log("Number of nights:", diffDays);
    }
  }, [search.checkIn, search.checkOut, hotelId]);

  // Updated use query in Booking.tsx
const { 
  data: paymentIntentData, 
  isError: isPaymentError,
  isLoading: isPaymentLoading
} = useQuery<PaymentIntentResponse>({
  queryKey: ["createPaymentIntent", hotelId, numberOfNight, search.adultCount, search.childrenCount],
  queryFn: () =>
    apiClient.createPaymentIntent(
      hotelId as string,
      numberOfNight.toString(),
      search.adultCount.toString(),
      search.childrenCount.toString()
    ),
  enabled: !!hotelId && numberOfNight > 0,
});

  // Set client secret when payment intent data changes
  useEffect(() => {
    if (paymentIntentData && paymentIntentData.clientSecret) {
      console.log("Client secret received:", paymentIntentData.clientSecret.substring(0, 10) + "...");
      setClientSecret(paymentIntentData.clientSecret);
    }
  }, [paymentIntentData]);

  const { 
    data: hotel, 
    isError: isHotelError, 
    isLoading: isHotelLoading 
  } = useQuery<HotelType>({
    queryKey: ["getHotelById", hotelId],
    queryFn: () => apiClient.getHotelByIdBook(hotelId as string),
    enabled: !!hotelId
  });

  const { 
    data: currentUser, 
    isError: isUserError, 
    isLoading: isUserLoading 
  } = useQuery<UserType>({
    queryKey: ["getCurrentUser"],
    queryFn: apiClient.getCurrentUser
  });

  // Handle errors
  useEffect(() => {
    if (isPaymentError) {
      setError("Failed to create payment intent. Please try again.");
    } else if (isHotelError) {
      setError("Failed to load hotel details. Please try again.");
    } else if (isUserError) {
      setError("Failed to load user details. Please try again.");
    } else {
      setError(null);
    }
  }, [isPaymentError, isHotelError, isUserError]);

  // Show any errors that occurred
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-bold text-red-600 mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 bg-gradient-to-r from-orange-300 to-orange-500 text-white py-2 px-4 rounded-full hover:from-orange-400 hover:to-orange-600 font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Show loading state if hotel or user is still loading
  if (isHotelLoading || isUserLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-lg text-gray-700">Loading booking details...</span>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg border border-slate-200 p-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Hotel not found</h3>
          <p className="text-gray-600">The requested hotel could not be found</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 bg-gradient-to-r from-orange-300 to-orange-500 text-white py-2 px-4 rounded-full hover:from-orange-400 hover:to-orange-600 font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // For the Elements component, use key to force re-creation when clientSecret changes
  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-6">
      <BookingOverview
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childrenCount={search.childrenCount}
        numberOfNight={numberOfNight}
        hotel={hotel}
      />
      
      {currentUser && paymentIntentData && clientSecret ? (
        <Elements
          key={clientSecret} // Force re-creation when client secret changes
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#F97316', // Tailwind orange-500
                colorBackground: '#FFFFFF',
                colorText: '#1F2937', // Tailwind gray-800
                borderRadius: '8px',
              }
            }
          }}
        >
          <RoomBookingForm
            currentUser={currentUser}
            paymentIntent={paymentIntentData}
          />
        </Elements>
      ) : null}
      
      {!paymentIntentData && numberOfNight <= 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">Please select different check-in and check-out dates.</p>
        </div>
      )}
      
      {(isPaymentLoading || (!paymentIntentData && numberOfNight > 0 && !isPaymentError)) && (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-4 text-lg text-gray-700">Setting up payment...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;