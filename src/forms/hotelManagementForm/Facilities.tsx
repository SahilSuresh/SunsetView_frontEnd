import { hotelFacilities } from "../../config/hotelType-config";
import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./HotelManagementForm";

const Facilities = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-3">Facilities</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {hotelFacilities.map((facility) => (
          <label 
            key={facility} 
            className="bg-white border border-gray-300 rounded px-3 py-2 flex items-center gap-2 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              value={facility}
              className="h-4 w-4 accent-orange-300 focus:ring-orange-300"
              {...register("facilities", {
                validate: (facilities) => {
                  if (facilities && facilities.length > 0) {
                    return true;
                  } else {
                    return "Please select at least one facility";
                  }
                },
              })}
            />
            <span className="text-sm text-gray-700">{facility}</span>
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className="text-red-500 text-sm font-bold mt-2 block">
          {errors.facilities.message}
        </span>
      )}
    </div>
  );
};

export default Facilities;