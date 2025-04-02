import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";
import { MdLocationOn, MdHotel } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import VisitorInfoForm from "../forms/VisitorInformationForm/VisitorInfoForm";
import { useState } from "react";

const DetailSec = () => {
  const { hotelId } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: hotel, isLoading } = useQuery({
    queryKey: ["getHotelByIdBook", hotelId],
    queryFn: () => apiClient.getHotelByIdBook(hotelId as string),
    enabled: !!hotelId,
  });

  // Image navigation functions
  const goToPreviousImage = () => {
    if (!hotel || !hotel.imageURL.length) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? hotel.imageURL.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    if (!hotel || !hotel.imageURL.length) return;
    setCurrentImageIndex((prev) => 
      prev === hotel.imageURL.length - 1 ? 0 : prev + 1
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-lg text-gray-700">Loading hotel details...</span>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-700">Hotel not found</div>
      </div>
    );
  }

  const displayId = hotel.id || hotel._id;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        {/* Hotel Info Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center mb-2">
            <div className="flex mr-3">
              {Array.from({ length: hotel.rating }).map((_, index) => (
                <AiFillStar key={index} className="text-yellow-400 text-xl" />
              ))}
            </div>
            <span className="text-sm bg-orange-500 text-white px-2 py-0.5 rounded-full">
              {hotel.type}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{hotel.name}</h1>
          <div className="flex items-center mb-4 text-gray-600">
            <MdLocationOn className="mr-1" />
            <span>{hotel.city}, {hotel.country}</span>
          </div>
        </div>

        {/* Main Image Carousel */}
        {hotel.imageURL && hotel.imageURL.length > 0 && (
          <div className="relative mb-4">
            <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
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
                  <FaChevronLeft />
                </button>
                <button 
                  onClick={goToNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
                
                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {hotel.imageURL.length}
                </div>
              </>
            )}
          </div>
        )}

        {/* Thumbnail Gallery */}
        {hotel.imageURL.length > 1 && (
          <div className="px-6 mb-6">
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {hotel.imageURL.map((image, index) => (
                <div 
                  key={index} 
                  className={`flex-shrink-0 cursor-pointer overflow-hidden rounded-lg w-20 h-20 border-2 ${
                    currentImageIndex === index ? 'border-orange-500' : 'border-transparent'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${hotel.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            {/* Left Column - Hotel Details */}
            <div className="space-y-6">
              {/* Facilities */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {hotel.facilities.map((facility, index) => (
                    <div 
                      key={index} 
                      className="flex items-center border border-orange-200 bg-orange-50 rounded-full px-3 py-2 text-sm text-orange-700"
                    >
                      <MdHotel className="mr-1 flex-shrink-0" />
                      <span className="truncate">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">About This Hotel</h2>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 text-gray-700 leading-relaxed">
                  {hotel.description}
                </div>
              </div>

              {/* Additional information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <h3 className="font-semibold text-orange-700 mb-1">Room Capacity</h3>
                  <p className="text-gray-700">
                    {hotel.adultCount} Adults & {hotel.childrenCount} Children
                  </p>
                </div>
                
                {/* Updated Price Information */}
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <h3 className="font-semibold text-orange-700 mb-1">Price Information</h3>
                  <p className="text-gray-700 mb-2">£{hotel.pricePerNight} per adult per night</p>
                  <p className="text-gray-700 mb-2">£{(hotel.pricePerNight / 2).toFixed(2)} per child per night</p>
                  <p className="text-xs text-gray-500">Children are charged at half the adult rate</p>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="h-fit sticky top-24">
              <VisitorInfoForm
                pricePerNight={hotel.pricePerNight}
                hotelId={hotel.id || ""}
                hotel_Id={hotel._id || ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailSec;