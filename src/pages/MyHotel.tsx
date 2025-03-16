import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

const MyHotel = () => {
  const { data: hotelData, isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: apiClient.getHotels,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-lg">Loading hotels...</span>
      </div>
    );
  }

  if (!hotelData || hotelData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <span className="text-xl">No Hotels Found</span>
        <Link
          to="/add-hotel"
          className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold hover:bg-orange-400 transition-colors"
        >
          Add Your First Hotel
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex items-center justify-center bg-orange-500 rounded-full text-white font-bold px-4 py-2 hover:bg-orange-400 transition-colors self-start sm:self-auto"
        >
          Add Hotel
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {hotelData.map((hotel) => (
          <div 
            key={hotel.id} 
            className="flex flex-col border border-slate-300 rounded-lg p-4 sm:p-6 gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl sm:text-2xl font-bold">{hotel.name}</h2>
            
            <div className="text-sm sm:text-base text-gray-700 line-clamp-3">
              {hotel.description}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="border border-slate-200 rounded-md p-2 flex items-center bg-slate-50">
                <BsMap className="mr-2 text-orange-500 flex-shrink-0" />
                <span className="truncate text-sm">
                  {hotel.city}, {hotel.country}
                </span>
              </div>
              
              <div className="border border-slate-200 rounded-md p-2 flex items-center bg-slate-50">
                <BsBuilding className="mr-2 text-orange-500 flex-shrink-0" />
                <span className="truncate text-sm">{hotel.type}</span>
              </div>
              
              <div className="border border-slate-200 rounded-md p-2 flex items-center bg-slate-50">
                <BiMoney className="mr-2 text-orange-500 flex-shrink-0" />
                <span className="truncate text-sm">£{hotel.pricePerNight} per night</span>
              </div>
              
              <div className="border border-slate-200 rounded-md p-2 flex items-center bg-slate-50">
                <BiHotel className="mr-2 text-orange-500 flex-shrink-0" />
                <span className="truncate text-sm">
                  {hotel.adultCount} Adults, {hotel.childrenCount} Children
                </span>
              </div>
              
              <div className="border border-slate-200 rounded-md p-2 flex items-center bg-slate-50">
                <BiStar className="mr-2 text-orange-500 flex-shrink-0" />
                <span className="truncate text-sm">{hotel.rating} Rating</span>
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <Link
                to={`/edit-hotel/${hotel.id || hotel._id}`}
                className="bg-orange-500 rounded-full text-white font-medium px-4 py-2 text-sm hover:bg-orange-400 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotel;