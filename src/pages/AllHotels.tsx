import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { HotelType } from "../../../backEnd/src/share/type";
import { Link } from 'react-router-dom';
import { AiFillStar } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";
import Pagination from '../components/Pagination';

const AllHotels = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 12;

  // Fetch all hotels
  const { data: hotels, isLoading, error } = useQuery<HotelType[]>({
    queryKey: ["allHotels"],
    queryFn: apiClient.getAllHotels,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-lg text-gray-700">Loading hotels...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error loading hotels</h2>
        <p className="mt-4 text-gray-600">Please try again later</p>
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">No hotels available at the moment</h2>
        <p className="mt-4 text-gray-600">Please check back later for new listings</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">All Hotels</h1>
        <p className="text-gray-600 mt-2 sm:mt-0">
          Showing {indexOfFirstHotel + 1}-{Math.min(indexOfLastHotel, hotels.length)} of {hotels.length} hotels
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentHotels.map(hotel => (
          <Link to={`/detail/${hotel._id}`} key={hotel._id} className="group">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 h-full flex flex-col">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {hotel.imageURL && hotel.imageURL.length > 0 ? (
                  <img
                    src={hotel.imageURL[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                
                {/* Rating badge */}
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-sm font-bold text-orange-500 flex items-center">
                  <AiFillStar className="mr-1" />
                  {hotel.rating}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-800 mb-1 group-hover:text-orange-500 transition-colors">
                  {hotel.name}
                </h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MdLocationOn className="mr-1 text-gray-400" />
                  {hotel.city}, {hotel.country}
                </div>
                
                {/* Type tag */}
                <div className="mb-3">
                  <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                    {hotel.type}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                  {hotel.description.substring(0, 100)}...
                </p>
                
                {/* Price */}
                <div className="flex justify-between items-end mt-auto">
                  <div>
                    <span className="font-bold text-gray-800">£{hotel.pricePerNight}</span>
                    <span className="text-gray-600 text-sm"> / night</span>
                  </div>
                  <span className="text-orange-500 group-hover:text-orange-600 font-medium text-sm">View details</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onClickPage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AllHotels;