import { AiFillStar } from "react-icons/ai";
import { HotelType } from "../../../backEnd/src/share/type";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

type Props = {
  hotel: HotelType;
};

const SearchCard = ({ hotel }: Props) => {
  // State to track current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Check if hotel has multiple images
  const hasMultipleImages = hotel.imageURL && hotel.imageURL.length > 1;
  
  // Navigation functions
  const goToPreviousImage = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page when clicking arrows
    e.stopPropagation();
    if (!hotel.imageURL || hotel.imageURL.length <= 1) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? hotel.imageURL.length - 1 : prev - 1
    );
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page when clicking arrows
    e.stopPropagation();
    if (!hotel.imageURL || hotel.imageURL.length <= 1) return;
    setCurrentImageIndex(prev => 
      prev === hotel.imageURL.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-gray-200 rounded-lg shadow-md p-4 sm:p-6 md:p-8 gap-4 md:gap-6 xl:gap-8 hover:shadow-lg transition-shadow">
      {/* Image container with slider */}
      <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden rounded-lg">
        {hotel.imageURL && hotel.imageURL.length > 0 && (
          <img
            src={hotel.imageURL[currentImageIndex]}
            alt={`${hotel.name} - view ${currentImageIndex + 1}`}
            className="w-full h-full object-cover object-center transition-transform hover:scale-105"
          />
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

      <div className="grid grid-rows-[auto_1fr_auto] gap-2 md:gap-4">
        <div>
          <div className="flex items-center mb-1">
            <span className="flex">
              {Array.from({ length: hotel.rating }).map((_, index) => (
                <AiFillStar key={index} className="fill-orange-400" />
              ))}
            </span>
            <span className="ml-1 text-xs sm:text-sm text-gray-600">{hotel.type}</span>
          </div>
          <Link
            to={`/detail/${hotel._id}`}
            className="text-xl sm:text-2xl font-bold cursor-pointer text-gray-800 hover:text-orange-500 transition-colors"
          >
            {hotel.name}
          </Link>
        </div>

        <div className="overflow-hidden text-sm sm:text-base text-gray-600 my-2 line-clamp-3 max-h-[4.5rem]">
          {hotel.description}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="flex flex-wrap gap-1 items-center">
            {hotel.facilities.slice(0, 3).map((facility, index) => (
              <span key={index} className="bg-orange-50 border border-orange-100 p-1 sm:p-2 rounded-lg text-xs text-orange-700 whitespace-nowrap">
                {facility}
              </span>
            ))}
            {hotel.facilities.length > 3 && (
              <span className="text-xs sm:text-sm text-orange-500">
                +{hotel.facilities.length - 3} more
              </span>
            )}
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <div>
              <span className="font-bold text-gray-800">£{hotel.pricePerNight} <span className="text-sm font-normal text-gray-600">per adult per night</span></span>
              <br />
              <span className="text-sm text-gray-600">£{(hotel.pricePerNight/2).toFixed(2)} per child per night</span>
            </div>
            <Link
              to={`/detail/${hotel._id}`}
              className="bg-gradient-to-r from-orange-300 to-orange-500 text-white py-2 px-4 rounded-full font-bold text-sm sm:text-base hover:from-orange-400 hover:to-orange-600 transition-colors shadow-md text-center"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;