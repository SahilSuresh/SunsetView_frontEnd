import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { HotelType } from "../../../backEnd/src/share/type";
import { AiFillStar } from "react-icons/ai";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MyBooking = () => {
  const { data: hotels, isLoading, isError } = useQuery<HotelType[]>({
    queryKey: ["getBookings"],
    queryFn: apiClient.getBookings,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-lg text-gray-700">Loading your bookings...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-bold text-red-600 mb-2">Error</h3>
        <p className="text-red-600">Failed to load your bookings. Please try again later.</p>
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Bookings Found</h2>
        <p className="text-gray-600">You haven't made any bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">My Bookings</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {hotels.map((hotel) => (
          <BookingCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

// Separate card component for better organization
const BookingCard = ({ hotel }: { hotel: HotelType }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Make sure we have bookings
  if (!hotel.bookings || hotel.bookings.length === 0) {
    return null;
  }
  
  const booking = hotel.bookings[0];
  
  // Check if hotel has multiple images
  const hasMultipleImages = hotel.imageURL && hotel.imageURL.length > 1;
  
  // Navigation functions
  const goToPreviousImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hotel.imageURL || hotel.imageURL.length <= 1) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? hotel.imageURL.length - 1 : prev - 1
    );
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hotel.imageURL || hotel.imageURL.length <= 1) return;
    setCurrentImageIndex(prev => 
      prev === hotel.imageURL.length - 1 ? 0 : prev + 1
    );
  };
  
  // Calculate dates
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  
  // Calculate number of nights
  const nightsStayed = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image container with slider */}
      <div className="relative w-full h-[250px] md:h-full overflow-hidden">
        {hotel.imageURL && hotel.imageURL.length > 0 ? (
          <img
            src={hotel.imageURL[currentImageIndex]}
            alt={`${hotel.name} - view ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        
        {/* Navigation arrows - only show when hotel has multiple images */}
        {hasMultipleImages && (
          <>
            <button 
              onClick={goToPreviousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10"
              aria-label="Previous image"
            >
              <FaChevronLeft size={16} />
            </button>
            <button 
              onClick={goToNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10"
              aria-label="Next image"
            >
              <FaChevronRight size={16} />
            </button>
            
            {/* Image counter */}
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
              {currentImageIndex + 1} / {hotel.imageURL.length}
            </div>
          </>
        )}
      </div>
      
      {/* Details section */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <span className="flex">
              {Array.from({ length: hotel.rating }).map((_, index) => (
                <AiFillStar key={index} className="fill-orange-400" />
              ))}
            </span>
            <span className="ml-1 text-xs sm:text-sm text-gray-600">{hotel.type}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{hotel.name}</h2>
          <p className="text-gray-600">{hotel.city}, {hotel.country}</p>
        </div>
        
        {/* Booking details in cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <h3 className="font-semibold text-orange-700 mb-2">Dates</h3>
            <p className="text-gray-700">Check-in: {checkInDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            <p className="text-gray-700">Check-out: {checkOutDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            <p className="text-gray-700 mt-2 font-medium">{nightsStayed} {nightsStayed === 1 ? 'night' : 'nights'}</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <h3 className="font-semibold text-orange-700 mb-2">Guests</h3>
            <p className="text-gray-700">{booking.adultCount} {booking.adultCount === 1 ? 'Adult' : 'Adults'}</p>
            <p className="text-gray-700">{booking.childrenCount} {booking.childrenCount === 1 ? 'Child' : 'Children'}</p>
          </div>
        </div>
        
        {/* Price summary */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-700">Payment Summary</h3>
              <p className="text-gray-600 text-sm">Booking Reference: {booking._id.substring(0, 8)}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-2xl text-gray-800">£{booking.bookingTotalCost.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Includes all taxes and fees</p>
            </div>
          </div>
        </div>
        
        {/* Facilities previews */}
        {hotel.facilities && hotel.facilities.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {hotel.facilities.slice(0, 3).map((facility, index) => (
              <span key={index} className="bg-orange-50 border border-orange-100 px-2 py-1 rounded-lg text-xs text-orange-700">
                {facility}
              </span>
            ))}
            {hotel.facilities.length > 3 && (
              <span className="text-xs text-orange-500">
                +{hotel.facilities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;