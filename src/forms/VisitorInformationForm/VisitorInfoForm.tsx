import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSearch } from "../../contexts/SearchContext";
import { useToast } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

type Props = {
  hotelId: string;
  hotel_Id?: string; // MongoDB _id
  pricePerNight: number;
};

type VisitorInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childrenCount: number;
};

const VisitorInfoForm = ({ hotelId, hotel_Id, pricePerNight }: Props) => {
  const search = useSearch();
  const { isLoggedIn } = useToast();
  const navigator = useNavigate();
  const location = useLocation();

  // Use MongoDB _id as fallback if hotelId is not available
  const effectiveHotelId = hotelId || hotel_Id || "";
  
  // Log the IDs for debugging
  console.log("VisitorInfoForm - hotelId:", hotelId);
  console.log("VisitorInfoForm - hotel_Id:", hotel_Id);
  console.log("VisitorInfoForm - effectiveHotelId:", effectiveHotelId);

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VisitorInfoFormData>({
    // Setting the default value of the form from the search context
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultCount: search.adultCount,
      childrenCount: search.childrenCount,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const adultCount = watch("adultCount");
  const childrenCount = watch("childrenCount");

  // Add this effect to ensure checkout date is always after checkin date
  useEffect(() => {
    if (checkIn && checkOut && checkIn >= checkOut) {
      // Set checkout to be the day after checkin
      const nextDay = new Date(checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setValue("checkOut", nextDay);
    }
  }, [checkIn, checkOut, setValue]);

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 365); // 1 year from today

  const onClickLogin = (data: VisitorInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childrenCount
    );
    // Pass the current location so we can redirect back after login
    navigator("/sign-in", { state: { from: location } });
  };

  const onClickSubmit = (data: VisitorInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childrenCount
    );
    
    // Make sure we're using a valid hotel ID and log it for debugging
    if (effectiveHotelId) {
      console.log("Navigating to booking page with hotel ID:", effectiveHotelId);
      navigator(`/hotel/${effectiveHotelId}/booking`);
    } else {
      console.error("No valid hotel ID available for booking");
      // Show an alert or some UI message that the hotel ID is missing
      alert("Error: Could not find hotel information. Please try again.");
    }
  };

  // Calculate estimated costs
  const calculateCosts = () => {
    // Get the number of nights (default to 1 if dates are the same)
    const checkInTime = checkIn.getTime();
    const checkOutTime = checkOut.getTime();
    const diffTime = Math.max(0, checkOutTime - checkInTime);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    
    const adultCost = pricePerNight * adultCount * diffDays;
    const childCost = (pricePerNight / 2) * childrenCount * diffDays;
    const totalCost = adultCost + childCost;
    
    return {
      nights: diffDays,
      adultCost,
      childCost,
      totalCost
    };
  };
  
  const costs = calculateCosts();

  return (
    <div className="flex flex-col p-5 bg-gradient-to-r from-orange-300 to-orange-400 rounded-lg shadow-md">
      {/* Price Information Box */}
      <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-700">Adults:</span>
          <span className="text-gray-700">£{pricePerNight} per night</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Children:</span>
          <span className="text-gray-700">£{(pricePerNight/2).toFixed(2)} per night</span>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Children are charged at half the adult rate
        </div>
      </div>
      
      {/* Estimated Cost Box */}
      {(adultCount > 0 || childrenCount > 0) && (
        <div className="bg-white/20 rounded-lg p-3 mb-4 border border-white/30">
          <h3 className="font-semibold text-white mb-2">Estimated Cost</h3>
          <div className="space-y-1 text-sm">
            {adultCount > 0 && (
              <div className="flex justify-between">
                <span className="text-white/90">Adults ({adultCount}) × {costs.nights} nights:</span>
                <span className="text-white font-medium">£{costs.adultCost.toFixed(2)}</span>
              </div>
            )}
            {childrenCount > 0 && (
              <div className="flex justify-between">
                <span className="text-white/90">Children ({childrenCount}) × {costs.nights} nights:</span>
                <span className="text-white font-medium">£{costs.childCost.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-white/20 pt-1 mt-1">
              <div className="flex justify-between font-bold">
                <span className="text-white">Total:</span>
                <span className="text-white">£{costs.totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onClickSubmit) : handleSubmit(onClickLogin)
        }
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <DatePicker
              selected={checkIn}
              onChange={(date) => setValue("checkIn", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-in date"
              className="w-full p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              wrapperClassName="w-full"
            />
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <DatePicker
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn || minDate}
              maxDate={maxDate}
              placeholderText="Check-out date"
              className="w-full p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              wrapperClassName="w-full"
            />
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <label className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">Adults:</span>
              <input
                className="w-16 p-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                type="number"
                min={1}
                max={20}
                {...register("adultCount", {
                  required: "This adultCount is necessary",
                  min: {
                    value: 1,
                    message: "You must have at least 1 adult",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Children:</span>
              <input
                className="w-16 p-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                type="number"
                min={0}
                max={20}
                {...register("childrenCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.adultCount && (
              <span className="text-red-500 font-medium text-sm mt-1 block">
                {errors.adultCount.message}
              </span>
            )}
          </div>
        </div>
        <button 
          className="bg-gradient-to-r from-orange-300 to-orange-500 rounded-full text-white font-medium px-4 py-2 text-sm hover:from-orange-400 hover:to-orange-600 transition-colors shadow-sm w-full"
        >
          {isLoggedIn ? "Book Now" : "Log in to book"}
        </button>
      </form>
    </div>
  );
};

export default VisitorInfoForm;