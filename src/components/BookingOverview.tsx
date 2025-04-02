import { HotelType } from "../../../backEnd/src/share/type";

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childrenCount: number;
  numberOfNight: number;
  hotel: HotelType;
};

const BookingOverview = ({
  checkIn,
  checkOut,
  adultCount,
  childrenCount,
  numberOfNight,
  hotel,
}: Props) => {
  // Calculate costs
  const adultCost = hotel.pricePerNight * adultCount * numberOfNight;
  const childrenCost = (hotel.pricePerNight / 2) * childrenCount * numberOfNight;
  const totalCost = adultCost + childrenCost;

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md bg-white max-w-md sm:max-w-none mx-auto w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-300 to-orange-500 px-5 py-4">
        <h2 className="text-white font-bold text-lg sm:text-xl">Your Booking Details</h2>
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Location */}
        <div className="pb-3 border-b border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">Location</p>
          <p className="font-semibold text-gray-800 text-sm sm:text-base">{hotel.name}</p>
          <p className="text-gray-600 text-sm">{hotel.city}, {hotel.country}</p>
        </div>
        
        {/* Dates */}
        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-200">
          <div className="space-y-1">
            <p className="text-gray-500 text-xs sm:text-sm">Check-In</p>
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              {checkIn.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500 text-xs sm:text-sm">Check-Out</p>
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              {checkOut.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        {/* Length of stay */}
        <div className="pb-3 border-b border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">Length of Stay</p>
          <p className="font-semibold text-gray-800 text-sm sm:text-base">
            {numberOfNight} {numberOfNight === 1 ? 'night' : 'nights'}
          </p>
        </div>
        
        {/* Guests */}
        <div className="pb-3 border-b border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">Guests</p>
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              <p className="font-semibold text-orange-700 text-sm">
                {adultCount} {adultCount === 1 ? 'Adult' : 'Adults'}
              </p>
            </div>
            <div className="bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              <p className="font-semibold text-orange-700 text-sm">
                {childrenCount} {childrenCount === 1 ? 'Child' : 'Children'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Cost Breakdown */}
        <div className="pb-3 border-b border-gray-200">
          <p className="text-gray-500 text-xs sm:text-sm mb-2">Price Breakdown</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600 text-sm">
                Adults ({adultCount}) × £{hotel.pricePerNight} × {numberOfNight} nights
              </p>
              <p className="font-medium text-gray-800 text-sm">£{adultCost.toFixed(2)}</p>
            </div>
            {childrenCount > 0 && (
              <div className="flex justify-between">
                <p className="text-gray-600 text-sm">
                  Children ({childrenCount}) × £{(hotel.pricePerNight/2).toFixed(2)} × {numberOfNight} nights
                </p>
                <p className="font-medium text-gray-800 text-sm">£{childrenCost.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Total Cost */}
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-800">Total Cost</p>
            <p className="font-bold text-xl text-gray-800">£{totalCost.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingOverview;