import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";
import VisitorInfoForm from "../forms/VisitorInformationForm/VisitorInfoForm";

const DetailSec = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQuery({
    queryKey: ["getHotelByIdBook", hotelId],
    queryFn: () => apiClient.getHotelByIdBook(hotelId as string),
    enabled: !!hotelId, //the hook for this query is if we haven't got Hotel Id if the hotel id is undefined it will result false so it we aill not throw error.
  });

  if (!hotel) {
    return <></>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <span className="flex mb-2">
            {Array.from({ length: hotel.rating }).map((_, index) => (
              <AiFillStar key={index} className="text-yellow-500 text-xl" />
            ))}
          </span>
          <h1 className="text-3xl font-bold text-gray-800">{hotel.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {hotel.imageURL.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-sm">
              <img
                src={image}
                alt={hotel.name}
                className="w-full h-64 object-cover object-center hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {hotel.facilities.map((facility, index) => (
            <div 
              key={index} 
              className="border border-orange-200 bg-orange-50 rounded-lg p-3 text-sm text-gray-700"
            >
              {facility}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-line text-gray-700">
            {hotel.description}
          </div>

          <div className="h-fit">
            <VisitorInfoForm
              pricePerNight={hotel.pricePerNight}
              hotelId={hotel.id}
              hotel_Id={hotel._id || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailSec;