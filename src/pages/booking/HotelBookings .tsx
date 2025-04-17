import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import * as apiClient from "../../api-client";
import { useState } from "react";

const HotelBookings = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  // Fetch the hotel data including bookings
  const { data: hotel, isLoading, isError } = useQuery({
    queryKey: ["hotelBookings", hotelId],
    queryFn: () => apiClient.getHotelBookings(hotelId || ""),
    enabled: !!hotelId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-lg text-gray-700">Loading bookings...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-bold text-red-600 mb-2">Error</h3>
        <p className="text-red-600">Failed to load hotel bookings. Please try again later.</p>
        <Link 
          to="/my-hotel"
          className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Back to My Hotels
        </Link>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Hotel Not Found</h2>
        <p className="text-gray-600 mb-6">The hotel you are looking for does not exist or you don't have permission to view it.</p>
        <Link 
          to="/my-hotel"
          className="bg-gradient-to-r from-orange-300 to-orange-500 text-white px-6 py-2 rounded-full font-bold hover:from-orange-400 hover:to-orange-600 transition-colors shadow-md"
        >
          Back to My Hotels
        </Link>
      </div>
    );
  }

  if (!hotel.bookings || hotel.bookings.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">{hotel.name} - Bookings</h1>
          <Link 
            to="/my-hotel"
            className="bg-gradient-to-r from-orange-300 to-orange-500 text-white px-4 py-2 rounded-full font-bold hover:from-orange-400 hover:to-orange-600 transition-colors shadow-sm"
          >
            Back to My Hotels
          </Link>
        </div>
        
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">No Bookings Found</h2>
          <p className="text-gray-600">This hotel doesn't have any bookings yet.</p>
        </div>
      </div>
    );
  }

  // Toggle booking details view
  const toggleBookingDetails = (bookingId: string) => {
    if (selectedBooking === bookingId) {
      setSelectedBooking(null);
    } else {
      setSelectedBooking(bookingId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{hotel.name} - Bookings</h1>
        <Link 
          to="/my-hotel"
          className="bg-gradient-to-r from-orange-300 to-orange-500 text-white px-4 py-2 rounded-full font-bold hover:from-orange-400 hover:to-orange-600 transition-colors shadow-sm self-start sm:self-auto"
        >
          Back to My Hotels
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{hotel.bookings.length} {hotel.bookings.length === 1 ? 'Booking' : 'Bookings'}</h2>
            <p className="text-gray-600">{hotel.city}, {hotel.country}</p>
          </div>
          <div className="ml-auto bg-orange-100 px-4 py-2 rounded-lg text-orange-800">
            <div className="text-sm">Adult Rate: £{hotel.pricePerNight} per night</div>
            <div className="text-sm">Child Rate: £{(hotel.pricePerNight / 2).toFixed(2)} per night</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {hotel.bookings.map(booking => {
          // Calculate dates
          const checkInDate = new Date(booking.checkIn);
          const checkOutDate = new Date(booking.checkOut);
          
          // Calculate number of nights
          const nightsStayed = Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          // Calculate if the booking is upcoming, active, or past
          const today = new Date();
          const isUpcoming = checkInDate > today;
          const isActive = checkInDate <= today && checkOutDate >= today;
          const isPast = checkOutDate < today;
          
          // Set booking status styles
          let statusBg = "bg-blue-100";
          let statusText = "text-blue-800";
          let statusLabel = "Upcoming";
          
          if (isActive) {
            statusBg = "bg-green-100";
            statusText = "text-green-800";
            statusLabel = "Active";
          } else if (isPast) {
            statusBg = "bg-gray-100";
            statusText = "text-gray-800";
            statusLabel = "Completed";
          }
          
          // Calculate price breakdown
          const adultCost = hotel.pricePerNight * booking.adultCount * nightsStayed;
          const childrenCost = (hotel.pricePerNight / 2) * booking.childrenCount * nightsStayed;
          const calculatedTotalCost = adultCost + childrenCost; // Adding the costs together correctly
          
          // Use the calculated total if needed, or use the stored booking total
          // In most cases these should match, but the stored value might reflect any special adjustments
          // For this example, we'll use the calculated total to ensure consistency
          const totalCost = booking.bookingTotalCost;
          
          return (
            <div 
              key={booking._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Booking summary row */}
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer" onClick={() => toggleBookingDetails(booking._id)}>
                <div className="flex-grow">
                  <div className="flex flex-wrap gap-2 items-center mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBg} ${statusText}`}>
                      {statusLabel}
                    </span>
                    <span className="text-sm text-gray-500">
                      Booking Ref: {booking._id.substring(0, 8)}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-800">
                    {booking.firstName} {booking.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm">{booking.email}</p>
                  
                  {/* Guest count badges */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-orange-50 border border-orange-100 px-2 py-1 rounded-lg text-xs text-orange-700">
                      {booking.adultCount} {booking.adultCount === 1 ? 'Adult' : 'Adults'}
                    </span>
                    <span className="bg-orange-50 border border-orange-100 px-2 py-1 rounded-lg text-xs text-orange-700">
                      {booking.childrenCount} {booking.childrenCount === 1 ? 'Child' : 'Children'}
                    </span>
                    <span className="bg-orange-50 border border-orange-100 px-2 py-1 rounded-lg text-xs text-orange-700">
                      {nightsStayed} {nightsStayed === 1 ? 'Night' : 'Nights'}
                    </span>
                  </div>
                </div>
                
                <div className="text-center sm:text-right">
                  <p className="text-sm text-gray-500">
                    {checkInDate.toLocaleDateString()} - {checkOutDate.toLocaleDateString()}
                  </p>
                  <p className="font-bold text-xl text-gray-800">
                    £{totalCost.toFixed(2)}
                  </p>
                </div>
                
                <div className="text-gray-400">
                  {selectedBooking === booking._id ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              
              {/* Expanded booking details */}
              {selectedBooking === booking._id && (
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Guest Information</h4>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p><span className="font-medium">Name:</span> {booking.firstName} {booking.lastName}</p>
                        <p><span className="font-medium">Email:</span> {booking.email}</p>
                        <p>
                          <span className="font-medium">Guests:</span> {booking.adultCount} Adults, {booking.childrenCount} Children
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Booking Details</h4>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p>
                          <span className="font-medium">Check-in:</span> {checkInDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p>
                          <span className="font-medium">Check-out:</span> {checkOutDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p><span className="font-medium">Duration:</span> {nightsStayed} nights</p>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <h4 className="font-medium text-gray-800 mb-2">Payment Information</h4>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Adults ({booking.adultCount}) × £{hotel.pricePerNight} × {nightsStayed} nights</span>
                            <span>£{adultCost.toFixed(2)}</span>
                          </div>
                          {booking.childrenCount > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Children ({booking.childrenCount}) × £{(hotel.pricePerNight/2).toFixed(2)} × {nightsStayed} nights</span>
                              <span>£{childrenCost.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                            <span>Total Amount (Adults + Children)</span>
                            <span>£{calculatedTotalCost.toFixed(2)}</span>
                          </div>
                          
                          {/* Only show this if the booking.bookingTotalCost is different from calculated */}
                          {Math.abs(calculatedTotalCost - totalCost) > 0.01 && (
                            <div className="text-xs text-gray-500 flex justify-between">
                              <span>* Final charged amount includes adjustments/fees</span>
                              <span>£{totalCost.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 border-t border-gray-200 pt-2">
                          <span>Booking Reference:</span>
                          <span>{booking._id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end gap-3">
                    <a 
                      href={`mailto:${booking.email}?subject=Regarding your booking at ${hotel.name}&body=Dear ${booking.firstName},\n\nThank you for booking with us at ${hotel.name}.\n\nBooking Reference: ${booking._id}\nCheck-in: ${checkInDate.toLocaleDateString()}\nCheck-out: ${checkOutDate.toLocaleDateString()}\n\nBest regards,\nSunsetView.com`} 
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                    >
                      Contact Guest
                    </a>
                    <button
                      onClick={() => window.print()}
                      className="bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      Print Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotelBookings;