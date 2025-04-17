// pages/admin/HotelDetail.tsx

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as apiClient from '../../api-client';
import { HotelType, BookingType } from "../../../../backEnd/src/share/type"
import { 
  HiStar, HiOutlineArrowLeft, HiLocationMarker, 
  HiCurrencyPound, HiUserGroup, HiCalendar,
  HiChevronLeft, HiChevronRight, HiPhotograph
} from 'react-icons/hi';

const HotelDetail = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch hotel details
  const { data: hotel, isLoading, error } = useQuery<HotelType>({
    queryKey: ['adminHotel', hotelId],
    queryFn: () => apiClient.getAdminHotelById(hotelId || ''),
    enabled: !!hotelId,
  });

  // Image navigation functions
  const goToPreviousImage = () => {
    if (!hotel?.imageURL || hotel.imageURL.length <= 1) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? hotel.imageURL.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    if (!hotel?.imageURL || hotel.imageURL.length <= 1) return;
    setCurrentImageIndex(prev => 
      prev === hotel.imageURL.length - 1 ? 0 : prev + 1
    );
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <HiStar 
            key={i} 
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-lg text-gray-700">Loading hotel details...</span>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
        <h3 className="text-lg font-bold mb-2">Error Loading Hotel</h3>
        <p>There was a problem loading the hotel details. Please try again later.</p>
        <Link to="/admin/hotels" className="mt-4 inline-block text-red-700 hover:underline">
          &larr; Back to Hotels
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/hotels" className="inline-flex items-center text-orange-600 hover:text-orange-700">
          <HiOutlineArrowLeft className="w-5 h-5 mr-1" />
          <span>Back to Hotels List</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Main header with name and rating */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{hotel.name}</h1>
              <div className="flex items-center mt-2">
                <HiLocationMarker className="w-5 h-5 text-gray-500 mr-1" />
                <span className="text-gray-600">{hotel.city}, {hotel.country}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {renderStars(hotel.rating)}
              <div className="mt-2 py-1 px-3 bg-orange-100 text-orange-700 rounded-full text-sm">
                {hotel.type}
              </div>
            </div>
          </div>
        </div>

        {/* Image gallery */}
        {hotel.imageURL && hotel.imageURL.length > 0 && (
          <div className="relative">
            <div className="aspect-[16/9] overflow-hidden bg-gray-100">
              <img
                src={hotel.imageURL[currentImageIndex]}
                alt={`${hotel.name} - view ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Navigation arrows */}
            {hotel.imageURL.length > 1 && (
              <>
                <button 
                  onClick={goToPreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                  aria-label="Previous image"
                >
                  <HiChevronLeft />
                </button>
                <button 
                  onClick={goToNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                  aria-label="Next image"
                >
                  <HiChevronRight />
                </button>
                
                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {hotel.imageURL.length}
                </div>
              </>
            )}
          </div>
        )}

        {/* Information grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Hotel Information</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{hotel.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-2">Price</h3>
                  <div className="flex items-center">
                    <HiCurrencyPound className="w-5 h-5 text-gray-500 mr-1" />
                    <span className="text-gray-900 font-bold text-lg">{hotel.pricePerNight}</span>
                    <span className="text-gray-600 text-sm ml-1">per night</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-2">Capacity</h3>
                  <div className="flex items-center">
                    <HiUserGroup className="w-5 h-5 text-gray-500 mr-1" />
                    <span className="text-gray-900">{hotel.adultCount} Adults, {hotel.childrenCount} Children</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Facilities</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {hotel.facilities.map((facility: string, index: number) => (
                    <span key={index} className="bg-orange-50 border border-orange-100 px-2 py-1 rounded-lg text-xs text-orange-700">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Information</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700">Total Bookings</h3>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {hotel.bookings?.length || 0}
                </span>
              </div>
              
              {hotel.bookings && hotel.bookings.length > 0 ? (
                <Link 
                  to={`/admin/bookings?hotelId=${hotel._id}`}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center mt-2"
                >
                  <HiCalendar className="w-4 h-4 mr-1" />
                  <span>View all bookings for this hotel</span>
                </Link>
              ) : (
                <p className="text-sm text-gray-500 italic">No bookings yet for this hotel</p>
              )}
            </div>
            
            {/* Recent bookings if any */}
            {hotel.bookings && hotel.bookings.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Recent Bookings</h3>
                <div className="space-y-3">
                  {hotel.bookings.slice(0, 3).map((booking: BookingType) => (
                    <div key={booking._id} className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex justify-between">
                        <span className="font-medium">{booking.firstName} {booking.lastName}</span>
                        <span className="text-sm text-gray-500">{new Date(booking.checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm text-gray-600">{booking.email}</div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>{booking.adultCount} Adults, {booking.childrenCount} Children</span>
                        <span className="font-medium">£{booking.bookingTotalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Additional metadata footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 justify-between text-sm text-gray-500">
            <div>
              <span className="font-medium">Hotel ID:</span> {hotel._id}
            </div>
            <div>
              <span className="font-medium">Owner ID:</span> {hotel.userId}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> {new Date(hotel.lastUpdated).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;