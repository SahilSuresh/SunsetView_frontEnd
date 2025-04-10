import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import * as apiClient from "../api-client";
import { HotelType } from "../../../backEnd/src/share/type";
import { AiFillStar } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";

const TrendingDestinations = () => {
  // Fetch all hotels
  const { data: hotels, isLoading, error } = useQuery<HotelType[]>({
    queryKey: ["allHotels"],
    queryFn: apiClient.getAllHotels,
  });

  // For a real app, you would want to fetch trending hotels based on booking count
  // For now, we'll simulate this by sorting the hotels by rating
  const trendingHotels = hotels?.sort((a, b) => b.rating - a.rating || 0).slice(0, 8);
  
  // Group trending hotels by location (city)
  const hotelsByLocation: Record<string, HotelType[]> = {};
  trendingHotels?.forEach(hotel => {
    if (!hotelsByLocation[hotel.city]) {
      hotelsByLocation[hotel.city] = [];
    }
    hotelsByLocation[hotel.city].push(hotel);
  });
  
  // Get locations sorted by number of hotels
  const trendingLocations = Object.keys(hotelsByLocation)
    .sort((a, b) => hotelsByLocation[b].length - hotelsByLocation[a].length);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-lg text-gray-700">Loading trending destinations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error loading destinations</h2>
        <p className="mt-4 text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Trending Destinations</h1>
        <p className="text-gray-600 max-w-3xl">
          Discover our most popular destinations based on recent bookings. 
          These locations offer exceptional views and experiences loved by our community.
        </p>
      </div>

      {/* Destinations by location */}
      <div className="space-y-16">
        {trendingLocations.slice(0, 4).map(location => (
          <div key={location}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{location}</h2>
              <Link 
                to={`/search?destination=${encodeURIComponent(location)}`} 
                className="text-orange-500 hover:text-orange-600 font-medium flex items-center"
              >
                View all hotels in {location}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hotelsByLocation[location].slice(0, 4).map(hotel => (
                <Link key={hotel._id} to={`/detail/${hotel._id}`} className="group">
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
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-orange-300 to-orange-500 rounded-xl p-8 text-white shadow-lg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Find Your Perfect Destination</h2>
          <p className="mb-6">
            Discover the most popular stays in trending destinations around the world.
            Join thousands of travelers who have booked their perfect getaway.
          </p>
          <Link
            to="/search"
            className="inline-block bg-white text-orange-500 px-6 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-md"
          >
            Explore All Hotels
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrendingDestinations;