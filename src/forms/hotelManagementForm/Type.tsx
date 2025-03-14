import { hotelTypes } from "../../config/hotelType-config";
import { useFormContext } from "react-hook-form";

const Type = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const typeWatch = watch("type");

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-3">Type</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {hotelTypes.map((type) => (
          <label
            key={type}
            className={`
              cursor-pointer rounded-full px-4 py-2 text-center transition-colors duration-200
              ${typeWatch === type 
                ? "bg-orange-500 text-white font-semibold shadow-md" 
                : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium"}
            `}
          >
            <input
              type="radio"
              value={type}
              {...register("type", {
                required: "Please select a hotel type"
              })}
              className="hidden"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      
      {errors?.type && (
        <span className="text-red-500 text-sm font-bold mt-2 block">
          {errors.type.message}
        </span>
      )}
    </div>
  );
};

export default Type;