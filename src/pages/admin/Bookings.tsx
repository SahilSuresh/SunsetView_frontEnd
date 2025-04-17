// pages/admin/Bookings.tsx

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import * as apiClient from '../../api-client';
import { 
  HiSearch, HiFilter, HiCalendar, HiOfficeBuilding, 
  HiUser, HiCurrencyPound, HiExclamationCircle,
  HiChevronDown, HiChevronUp
} from 'react-icons/hi';

// Booking type with hotel info
type BookingWithHotel = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childrenCount: number;
  checkIn: string;
  checkOut: string;
  bookingTotalCost: number;
  hotelName: string;
  hotelCity: string;
  hotelCountry: string;
  hotelId: string;
};

const Bookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialHotelId = searchParams.get('hotelId') || '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHotelId, setFilterHotelId] = useState(initialHotelId);
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'active' | 'past'>('all');
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  
  // Update URL when filter changes
  useEffect(() => {
    if (filterHotelId) {
      setSearchParams({ hotelId: filterHotelId });
    } else {
      setSearchParams({});
    }
  }, [filterHotelId, setSearchParams]);

  // Fetch all bookings
  const { data: bookings, isLoading, error } = useQuery<BookingWithHotel[]>({
    queryKey: ['adminBookings'],
    queryFn: apiClient.getAdminBookings,
  });

  // Filter bookings based on search, hotel, and status
  const filteredBookings = bookings?.filter(booking => {
    const today = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    // Determine booking status
    const isUpcoming = checkIn > today;
    const isActive = checkIn <= today && checkOut >= today;
    const isPast = checkOut < today;
    
    // Apply status filter
    if (statusFilter === 'upcoming' && !isUpcoming) return false;
    if (statusFilter === 'active' && !isActive) return false;
    if (statusFilter === 'past' && !isPast) return false;
    
    // Apply hotel filter
    if (filterHotelId && booking.hotelId !== filterHotelId) return false;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.firstName.toLowerCase().includes(searchLower) ||
        booking.lastName.toLowerCase().includes(searchLower) ||
        booking.email.toLowerCase().includes(searchLower) ||
        booking.hotelName.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Get unique hotel options for filter
  const hotelOptions = bookings ? 
    [...new Map(bookings.map(booking => 
      [booking.hotelId, { id: booking.hotelId, name: booking.hotelName }]
    )).values()] : [];

  // Toggle booking details
  const toggleBookingDetails = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate booking status
  const getBookingStatus = (checkIn: string, checkOut: string) => {
    const today = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkInDate > today) {
      return { label: 'Upcoming', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
    } else if (checkInDate <= today && checkOutDate >= today) {
      return { label: 'Active', bgColor: 'bg-green-100', textColor: 'text-green-800' };
    } else {
      return { label: 'Completed', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  };

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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
        <h3 className="text-lg font-bold mb-2">Error Loading Bookings</h3>
        <p>There was a problem loading the booking data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Manage Bookings</h1>
      
      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by guest or hotel..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="sr-only">Filter by Hotel</label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                value={filterHotelId}
                onChange={(e) => setFilterHotelId(e.target.value)}
              >
                <option value="">All Hotels</option>
                {hotelOptions.map(hotel => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <HiOfficeBuilding className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="sr-only">Filter by Status</label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="past">Completed</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <HiFilter className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="lg:text-right text-sm text-gray-500 self-end">
            {filteredBookings?.length || 0} booking{(filteredBookings?.length || 0) !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>
      
      {/* Bookings list */}
      <div className="space-y-4">
        {filteredBookings && filteredBookings.length > 0 ? (
          filteredBookings.map(booking => {
            const status = getBookingStatus(booking.checkIn, booking.checkOut);
            const isExpanded = expandedBooking === booking._id;
            
            return (
              <div 
                key={booking._id} 
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                {/* Booking summary row - clickable */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleBookingDetails(booking._id)}
                >
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      {/* Status badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor} w-max`}>
                        {status.label}
                      </span>
                      
                      {/* Guest info */}
                      <div>
                        <h3 className="font-medium text-gray-900">{booking.firstName} {booking.lastName}</h3>
                        <p className="text-sm text-gray-500">{booking.email}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:mt-0 flex flex-col">
                      {/* Hotel name */}
                      <Link 
                        to={`/admin/hotels/${booking.hotelId}`}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {booking.hotelName}
                      </Link>
                      <span className="text-sm text-gray-500">
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <span className="font-bold text-gray-900">£{booking.bookingTotalCost.toFixed(2)}</span>
                      {isExpanded ? 
                        <HiChevronUp className="h-5 w-5 text-gray-400" /> : 
                        <HiChevronDown className="h-5 w-5 text-gray-400" />
                      }
                    </div>
                  </div>
                </div>
                
                {/* Expanded booking details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Guest details */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <HiUser className="w-5 h-5 mr-2 text-gray-500" />
                          Guest Details
                        </h4>
                        <div className="space-y-2">
                          <p><span className="text-gray-500">Name:</span> {booking.firstName} {booking.lastName}</p>
                          <p><span className="text-gray-500">Email:</span> {booking.email}</p>
                          <p><span className="text-gray-500">Guests:</span> {booking.adultCount} Adults, {booking.childrenCount} Children</p>
                          <p><span className="text-gray-500">User ID:</span> {booking.userId}</p>
                        </div>
                      </div>
                      
                      {/* Stay details */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <HiCalendar className="w-5 h-5 mr-2 text-gray-500" />
                          Stay Details
                        </h4>
                        <div className="space-y-2">
                          <p><span className="text-gray-500">Check-in:</span> {formatDate(booking.checkIn)}</p>
                          <p><span className="text-gray-500">Check-out:</span> {formatDate(booking.checkOut)}</p>
                          <p>
                            <span className="text-gray-500">Duration:</span> {
                              Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))
                            } nights
                          </p>
                          <p><span className="text-gray-500">Status:</span> <span className={status.textColor}>{status.label}</span></p>
                        </div>
                      </div>
                      
                      {/* Hotel and payment details */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <HiCurrencyPound className="w-5 h-5 mr-2 text-gray-500" />
                          Payment & Hotel
                        </h4>
                        <div className="space-y-2">
                          <p><span className="text-gray-500">Total Amount:</span> <span className="font-bold">£{booking.bookingTotalCost.toFixed(2)}</span></p>
                          <p><span className="text-gray-500">Hotel:</span> {booking.hotelName}</p>
                          <p><span className="text-gray-500">Location:</span> {booking.hotelCity}, {booking.hotelCountry}</p>
                          <Link 
                            to={`/admin/hotels/${booking.hotelId}`}
                            className="text-orange-600 hover:text-orange-700 text-sm inline-flex items-center mt-2"
                          >
                            <HiOfficeBuilding className="w-4 h-4 mr-1" />
                            View Hotel Details
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Booking reference */}
                    <div className="mt-4 text-xs text-gray-500">
                      <span className="font-medium">Booking Reference:</span> {booking._id}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <HiExclamationCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterHotelId || statusFilter !== 'all'
                ? 'Try adjusting your filters to see more results'
                : 'There are no bookings in the system yet'}
            </p>
            {(searchTerm || filterHotelId || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterHotelId('');
                  setStatusFilter('all');
                }}
                className="bg-orange-100 text-orange-700 py-2 px-4 rounded-lg hover:bg-orange-200 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;