import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./HotelManagementForm";

const Visitors = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-3">Visitor</h2>
      <div className="grid grid-cols-2 gap-3 bg-orange-50 p-6 rounded border border-orange-100">
        <label className="text-gray-700 text-sm font-semibold">
          Children
          <input
            className="border border-orange-200 rounded w-full py-2 px-3 font-normal bg-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none"
            type="number"
            min={0}
            {...register("childrenCount", { required: "Please enter the number of children." })}
          />
          {errors.childrenCount?.message && (
            <span className="text-red-500 text-sm font-bold">
              {errors.childrenCount?.message}
            </span>
          )}
        </label>

        <label className="text-gray-700 text-sm font-semibold">
          Adults
          <input
            className="border border-orange-200 rounded w-full py-2 px-3 font-normal bg-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none"
            type="number"
            min={1}
            {...register("adultCount", { required: "Please enter the number of adults." })}
          />
          {errors.adultCount?.message && (
            <span className="text-red-500 text-sm font-bold">
              {errors.adultCount?.message}
            </span>
          )}
        </label>
      </div>
    </div>
  );
};

export default Visitors;