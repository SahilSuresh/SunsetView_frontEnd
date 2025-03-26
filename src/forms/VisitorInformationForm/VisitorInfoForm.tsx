import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSearch } from "../../contexts/SearchContext";
import { useToast } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  hotelId: string;
  hotel_Id?: string; // Made optional with '?'
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

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VisitorInfoFormData>({
    //seting the default value of the form from the search context so when you hit search it save the detail on searchcontext and then it appear on the viewdetail form
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultCount: search.adultCount,
      childrenCount: search.childrenCount,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

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
    navigator(`/hotel/${hotelId}/booking`);
  };

  return (
    <div className="flex flex-col p-5 bg-gradient-to-r from-orange-300 to-orange-400 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-white mb-4">£{pricePerNight}</h3>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onClickSubmit) : handleSubmit(onClickLogin)  //if they are sign in they it will take them to booking page else take them to sign in page
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
                  required: "This adultCount is neccessary",
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