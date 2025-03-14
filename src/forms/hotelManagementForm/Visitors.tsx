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
      <div className="grid grid-cols-2 gap-3 bg-gray-100 p-6 rounded">
        <label className="text-gray-700 text-sm font-semibold">
          Children
          <input
            className="border rounded w-full py-2 px-3 font-normal bg-white"
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
            className="border rounded w-full py-2 px-3 font-normal bg-white"
            type="number"
            min={1}
            {...register("adultsCount", { required: "Please enter the number of adults." })}
          />
          {errors.adultsCount?.message && (
            <span className="text-red-500 text-sm font-bold">
              {errors.adultsCount?.message}
            </span>
          )}
        </label>
      </div>
    </div>
  );
};

export default Visitors;