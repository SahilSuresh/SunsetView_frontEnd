// pages/admin/Hotels.tsx

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as apiClient from '../../api-client';
import { Link } from 'react-router-dom';
import { useToast } from '../../contexts/AppContext';
import { 
  HiSearch, 
  HiOfficeBuilding, 
  HiEye, 
  HiStar, 
  HiLocationMarker, 
  HiCurrencyPound, 
  HiTrash,
  HiExclamationCircle
} from 'react-icons/hi';

// Define hotel type for this component
type HotelSummary = {
  _id: string;
  name: string;
  city: string;
  country: string;
  rating: number;
  pricePerNight: number;
  bookingCount: number;
};

const Hotels = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [hotelToDelete, setHotelToDelete] = useState<HotelSummary | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch all hotels
  const { data: hotels, isLoading, error } = useQuery<HotelSummary[]>({
    queryKey: ['adminHotels'],
    queryFn: apiClient.getAdminHotels,
  });

  // Delete hotel mutation
  const deleteHotelMutation = useMutation({
    mutationFn: (hotelId: string) => apiClient.deleteAdminHotel(hotelId),
    onSuccess: () => {
      showToast({ 
        message: "Hotel deleted successfully", 
        type: "SUCCESS" 
      });
      setShowDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ['adminHotels'] });
    },
    onError: (error: Error) => {
      showToast({ 
        message: error.message || "Failed to delete hotel", 
        type: "ERROR" 
      });
    }
  });

  // Filter hotels based on search term and rating
  const filteredHotels = hotels?.filter(hotel => {
    const matchesSearch = 
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === null || hotel.rating === filterRating;
    
    return matchesSearch && matchesRating;
  });

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <HiStar 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  // Handle delete request
  const handleDeleteRequest = (hotel: HotelSummary) => {
    setHotelToDelete(hotel);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (hotelToDelete) {
      deleteHotelMutation.mutate(hotelToDelete._id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-lg text-gray-700">Loading hotels...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
        <h3 className="text-lg font-bold mb-2">Error Loading Hotels</h3>
        <p>There was a problem loading the hotel data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Manage Hotels</h1>
      
      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search hotels by name or location..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={filterRating !== null ? filterRating.toString() : ''}
              onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Hotels grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels && filteredHotels.length > 0 ? (
          filteredHotels.map(hotel => (
            <div key={hotel._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-800 truncate">{hotel.name}</h3>
                  {renderStars(hotel.rating)}
                </div>
                <div className="flex items-center text-gray-600 text-sm mt-2">
                  <HiLocationMarker className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{hotel.city}, {hotel.country}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <HiCurrencyPound className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-gray-700 font-medium">{hotel.pricePerNight}</span>
                    <span className="text-gray-500 text-sm ml-1">per night</span>
                  </div>
                  <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                    <span className="text-green-700 text-sm font-medium">{hotel.bookingCount} bookings</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 bg-gray-50 p-4 flex justify-between">
                <Link
                  to={`/admin/hotels/${hotel._id}`}
                  className="flex items-center text-orange-600 hover:text-orange-700"
                >
                  <HiEye className="w-5 h-5 mr-1" />
                  <span>View</span>
                </Link>
                
                <button
                  onClick={() => handleDeleteRequest(hotel)}
                  className="flex items-center text-red-600 hover:text-red-700"
                  disabled={hotel.bookingCount > 0}
                  title={hotel.bookingCount > 0 ? "Cannot delete hotel with active bookings" : "Delete hotel"}
                >
                  <HiTrash className="w-5 h-5 mr-1" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow p-6 text-center">
            <HiOfficeBuilding className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No hotels found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm || filterRating !== null 
                ? 'No hotels match your search criteria' 
                : 'There are no hotels in the system yet'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && hotelToDelete && (
        <div className="fixed z-30 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <HiExclamationCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Hotel
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the hotel <span className="font-semibold">{hotelToDelete.name}</span>? This action cannot be undone.
                      </p>
                      {hotelToDelete.bookingCount > 0 && (
                        <p className="mt-2 text-sm text-red-500">
                          Warning: This hotel has {hotelToDelete.bookingCount} active bookings. Deleting it will also remove all associated booking records.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirmDelete}
                  disabled={deleteHotelMutation.isPending}
                >
                  {deleteHotelMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteHotelMutation.isPending}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotels;