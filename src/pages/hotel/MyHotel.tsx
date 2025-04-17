import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../../api-client";
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
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-lg text-gray-700">Loading hotels...</span>
        </div>
      </div>
    );
  }

  if (!hotelData || hotelData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <span className="text-xl">No Hotels Found</span>
        <Link
          to="/add-hotel"
          className="bg-gradient-to-r from-orange-300 to-orange-500 text-white px-4 py-2 rounded-full font-bold hover:from-orange-400 hover:to-orange-600 transition-colors shadow-sm"
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
          className="flex items-center justify-center bg-gradient-to-r from-orange-300 to-orange-500 rounded-full text-white font-bold px-4 py-2 hover:from-orange-400 hover:to-orange-600 transition-colors self-start sm:self-auto shadow-sm"
        >
          Add Hotel
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {hotelData.map((hotel) => (
          <div 
            key={hotel._id || hotel.id} // Using either _id or id as the unique key
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
            
            {/* Booking Info - Display the number of bookings */}
            {hotel.bookings && hotel.bookings.length > 0 && (
              <div className="mt-2 bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-green-700 font-medium">
                  {hotel.bookings.length} {hotel.bookings.length === 1 ? 'booking' : 'bookings'} for this hotel
                </p>
              </div>
            )}
            
            <div className="flex justify-end mt-2 gap-3">
              <Link
                to={`/hotel-bookings/${hotel._id || hotel.id}`}
                className="bg-blue-500 hover:bg-blue-600 rounded-full text-white font-medium px-4 py-2 text-sm transition-colors shadow-sm"
              >
                View Bookings
              </Link>
              <Link
                to={`/edit-hotel/${hotel._id || hotel.id}`}
                className="bg-gradient-to-r from-orange-300 to-orange-500 rounded-full text-white font-medium px-4 py-2 text-sm hover:from-orange-400 hover:to-orange-600 transition-colors shadow-sm"
              >
                Edit Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotel;