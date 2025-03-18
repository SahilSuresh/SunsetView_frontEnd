import { AiFillStar } from "react-icons/ai";
import { HotelType } from "../../../backEnd/src/share/type";
import { Link } from "react-router-dom";

type Props = {
  hotel: HotelType;
};

const SearchCard = ({ hotel }: Props) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-gray-200 rounded-lg shadow-md p-4 sm:p-6 md:p-8 gap-4 md:gap-6 xl:gap-8 hover:shadow-lg transition-shadow">
      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden rounded-lg">
        <img
          src={hotel.imageURL[0]}
          alt={hotel.name}
          className="w-full h-full object-cover object-center transition-transform hover:scale-105"
        />
      </div>

      <div className="grid grid-rows-[auto_1fr_auto] gap-2 md:gap-4">
        <div>
          <div className="flex items-center mb-1">
            <span className="flex">
              {Array.from({ length: hotel.rating }).map((_, index) => (
                <AiFillStar key={index} className="fill-yellow-400" />
              ))}
            </span>
            <span className="ml-1 text-xs sm:text-sm text-gray-600">{hotel.type}</span>
          </div>
          <Link
            to={`/detail/${hotel._id}`}
            className="text-xl sm:text-2xl font-bold cursor-pointer text-gray-800 hover:text-orange-600 transition-colors"
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
              <span key={index} className="bg-gray-100 p-1 sm:p-2 rounded-lg text-xs whitespace-nowrap">
                {facility}
              </span>
            ))}
            {hotel.facilities.length > 3 && (
              <span className="text-xs sm:text-sm text-gray-600">
                +{hotel.facilities.length - 3} more
              </span>
            )}
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <span className="font-bold text-gray-800">£{hotel.pricePerNight} <span className="text-sm font-normal text-gray-600">per night</span></span>
            <Link
              to={`/detail/${hotel._id}`}
              className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-2 px-4 rounded-full font-bold text-sm sm:text-base hover:from-orange-500 hover:to-orange-600 transition-colors shadow-md text-center"
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