import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { HotelType } from "../../../backEnd/src/share/type";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Home = () => {
  // Fetch all hotels
  const { data: allHotels, isLoading } = useQuery<HotelType[]>({
    queryKey: ["allHotels"],
    queryFn: apiClient.getAllHotels,
  });

  // State for featured hotel carousel
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Filter for top-rated hotels (4+ stars)
  const topRatedHotels = allHotels?.filter(hotel => hotel.rating >= 4) || [];
  
  // Get a selection of hotels by different types
  const getHotelsByType = (type: string, limit: number = 4) => {
    return allHotels?.filter(hotel => hotel.type === type).slice(0, limit) || [];
  };

  // Get a set of featured hotels (could be newest or manually selected)
  const featuredHotels = allHotels?.slice(0, 5) || [];

  // Navigate through featured hotels
  const goToPreviousFeatured = () => {
    setFeaturedIndex(prev => 
      prev === 0 ? featuredHotels.length - 1 : prev - 1
    );
  };

  const goToNextFeatured = () => {
    setFeaturedIndex(prev => 
      prev === featuredHotels.length - 1 ? 0 : prev + 1
    );
  };

  // Hotel categories to display
  const hotelCategories = [
    { type: "Beach Resort", title: "Beach Getaways" },
    { type: "Luxury", title: "Luxury Stays" },
    { type: "Family", title: "Family-Friendly" },
    { type: "Boutique", title: "Boutique Hotels" }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-lg text-gray-700">Discovering amazing stays...</span>
        </div>
      </div>
    );
  }

  if (!allHotels || allHotels.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">No hotels available at the moment</h2>
        <p className="mt-4 text-gray-600">Please check back later for new listings</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Hotel Carousel */}
      {featuredHotels.length > 0 && (
        <div className="mb-12">
          <div className="relative rounded-xl overflow-hidden h-[300px] sm:h-[400px] md:h-[500px] shadow-lg">
            {/* Featured image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 transform scale-105 hover:scale-110"
              style={{ 
                backgroundImage: `url(${featuredHotels[featuredIndex].imageURL[0]})`,
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
              <div className="flex items-center mb-2">
                <span className="flex mr-2">
                  {Array.from({ length: featuredHotels[featuredIndex].rating }).map((_, i) => (
                    <AiFillStar key={i} className="text-yellow-400" />
                  ))}
                </span>
                <span className="bg-orange-500/80 text-white text-xs px-2 py-1 rounded-full">
                  {featuredHotels[featuredIndex].type}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{featuredHotels[featuredIndex].name}</h2>
              <div className="flex items-center mb-4">
                <MdLocationOn className="mr-1" />
                <span>{featuredHotels[featuredIndex].city}, {featuredHotels[featuredIndex].country}</span>
              </div>
              <p className="hidden sm:block text-white/80 line-clamp-2 mb-4 max-w-2xl">
                {featuredHotels[featuredIndex].description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg sm:text-xl">
                  From <span className="font-bold">£{featuredHotels[featuredIndex].pricePerNight}</span> per night
                </span>
                <Link 
                  to={`/detail/${featuredHotels[featuredIndex]._id}`}
                  className="bg-gradient-to-r from-orange-300 to-orange-500 hover:from-orange-400 hover:to-orange-600 text-white px-4 py-2 rounded-full font-bold shadow-lg transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
            
            {/* Navigation arrows */}
            {featuredHotels.length > 1 && (
              <>
                <button 
                  onClick={goToPreviousFeatured}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Previous featured hotel"
                >
                  <FaChevronLeft size={20} />
                </button>
                <button 
                  onClick={goToNextFeatured}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Next featured hotel"
                >
                  <FaChevronRight size={20} />
                </button>
                
                {/* Dots indicator */}
                <div className="absolute bottom-20 sm:bottom-28 left-1/2 -translate-x-1/2 flex space-x-2">
                  {featuredHotels.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setFeaturedIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === featuredIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      aria-label={`Go to featured hotel ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Top-rated Hotels Section */}
      {topRatedHotels.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Top-Rated Places to Stay</h2>
            <Link to="/search" className="text-orange-500 hover:text-orange-600 font-medium">
              View all
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topRatedHotels.slice(0, 4).map(hotel => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        </div>
      )}

      {/* Hotel Categories Section */}
      {hotelCategories.map(category => {
        const hotels = getHotelsByType(category.type);
        if (hotels.length === 0) return null;
        
        return (
          <div key={category.type} className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{category.title}</h2>
              <Link to={`/search?type=${encodeURIComponent(category.type)}`} className="text-orange-500 hover:text-orange-600 font-medium">
                View all
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hotels.map(hotel => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Hotel Card Component
const HotelCard = ({ hotel }: { hotel: HotelType }) => {
  return (
    <Link to={`/detail/${hotel._id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200">
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
        <div className="p-4">
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
          <div className="flex justify-between items-end">
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

export default Home;