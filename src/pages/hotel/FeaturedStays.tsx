import React from 'react';
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../../api-client";
import { HotelType } from "../../../../backEnd/src/share/type";
import { Link } from 'react-router-dom';
import { AiFillStar } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";

const FeaturedStays = () => {
  // Fetch all hotels
  const { data: allHotels, isLoading, error } = useQuery<HotelType[]>({
    queryKey: ["allHotels"],
    queryFn: apiClient.getAllHotels,
  });

  // Filter for featured stays - for this example, we'll consider hotels with rating ≥ 4 as featured
  const featuredHotels = allHotels?.filter(hotel => hotel.rating >= 4) || [];

  // Group featured hotels by type
  const hotelsByType: Record<string, HotelType[]> = {};
  featuredHotels.forEach(hotel => {
    if (!hotelsByType[hotel.type]) {
      hotelsByType[hotel.type] = [];
    }
    hotelsByType[hotel.type].push(hotel);
  });

  // Get unique hotel types with hotels
  const hotelTypes = Object.keys(hotelsByType).filter(type => hotelsByType[type].length > 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-lg text-gray-700">Loading featured stays...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error loading featured stays</h2>
        <p className="mt-4 text-gray-600">Please try again later</p>
      </div>
    );
  }

  if (featuredHotels.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">No featured stays available</h2>
        <p className="mt-4 text-gray-600">Please check back later for featured listings</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Featured Stays</h1>
        <p className="text-gray-600 max-w-3xl">
          Discover our handpicked selection of exceptional accommodations. These properties stand out for their 
          stunning sunset views, exceptional service, and guest satisfaction.
        </p>
      </div>

      {/* Featured spotlight - random selection from top-rated (5-star) hotels */}
      {allHotels && allHotels.filter(hotel => hotel.rating === 5).length > 0 && (
        <div className="mb-12">
          <FeaturedSpotlight 
            hotel={allHotels.filter(hotel => hotel.rating === 5)[
              Math.floor(Math.random() * allHotels.filter(hotel => hotel.rating === 5).length)
            ]} 
          />
        </div>
      )}

      {/* Hotels by type */}
      <div className="space-y-12">
        {hotelTypes.map(type => (
          <div key={type}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{type} Stays</h2>
              <Link 
                to={`/search?type=${encodeURIComponent(type)}`} 
                className="flex items-center text-orange-500 hover:text-orange-600 font-medium"
              >
                View all <FaChevronRight className="ml-1 text-sm" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hotelsByType[type].slice(0, 4).map(hotel => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-orange-300 to-orange-500 rounded-xl p-8 text-white shadow-lg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Find Your Perfect Sunset View</h2>
          <p className="mb-6">
            From beachfront resorts to mountain retreats, our featured stays offer the best sunset views around the world.
            Book your next unforgettable experience today.
          </p>
          <Link
            to="/search"
            className="inline-block bg-white text-orange-500 px-6 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-md"
          >
            Explore All Stays
          </Link>
        </div>
      </div>
    </div>
  );
};

// Featured Spotlight Component
const FeaturedSpotlight = ({ hotel }: { hotel: HotelType }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-64 md:h-auto relative overflow-hidden">
          {hotel.imageURL && hotel.imageURL.length > 0 ? (
            <img
              src={hotel.imageURL[0]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
          <div className="absolute top-0 left-0 bg-orange-500 text-white px-4 py-2 rounded-br-lg font-bold">
            Spotlight Feature
          </div>
        </div>
        <div className="p-6 flex flex-col">
          <div className="mb-2 flex items-center">
            <div className="flex mr-2">
              {Array.from({ length: hotel.rating }).map((_, index) => (
                <AiFillStar key={index} className="text-yellow-400" />
              ))}
            </div>
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
              {hotel.type}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{hotel.name}</h3>
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <MdLocationOn className="mr-1" />
            {hotel.city}, {hotel.country}
          </div>
          <p className="text-gray-600 mb-6 flex-grow">
            {hotel.description.substring(0, 200)}...
          </p>
          <div className="flex justify-between items-center mt-auto">
            <div>
              <span className="font-bold text-xl text-gray-800">£{hotel.pricePerNight}</span>
              <span className="text-gray-600"> / night</span>
            </div>
            <Link
              to={`/detail/${hotel._id}`}
              className="bg-gradient-to-r from-orange-300 to-orange-500 text-white px-4 py-2 rounded-full font-bold hover:from-orange-400 hover:to-orange-600 transition-colors shadow-md"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hotel Card Component
const HotelCard = ({ hotel }: { hotel: HotelType }) => {
  return (
    <Link to={`/detail/${hotel._id}`} className="group">
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
  );
};

export default FeaturedStays;