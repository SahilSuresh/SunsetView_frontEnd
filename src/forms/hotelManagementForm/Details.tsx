import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./HotelManagementForm";

const Details = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold mb-6">Add Hotel</h1>
      
      <div className="space-y-6">
        {/* Name Input */}
        <div className="form-group">
          <label className="text-gray-700 text-sm font-bold block mb-2">
            Name
          </label>
          <input
            type="text"
            className="border rounded w-full py-2 px-3 font-normal"
            {...register("name", {
              required: "Please enter hotel name"
            })}
          />
          {errors.name && (
            <span className="text-red-500 text-sm mt-1 block">{errors.name.message}</span>
          )}
        </div>

        {/* City and Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="text-gray-700 text-sm font-bold block mb-2">
              City
            </label>
            <input
              type="text"
              className="border rounded w-full py-2 px-3 font-normal"
              {...register("city", {
                required: "Please enter city"
              })}
            />
            {errors.city && (
              <span className="text-red-500 text-sm mt-1 block">{errors.city.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="text-gray-700 text-sm font-bold block mb-2">
              Country
            </label>
            <input
              type="text"
              className="border rounded w-full py-2 px-3 font-normal"
              {...register("country", {
                required: "Please enter country"
              })}
            />
            {errors.country && (
              <span className="text-red-500 text-sm mt-1 block">{errors.country.message}</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="text-gray-700 text-sm font-bold block mb-2">
            Description
          </label>
          <textarea
            rows={8}
            className="border rounded w-full py-2 px-3 font-normal"
            {...register("description", {
              required: "Please enter description"
            })}
          ></textarea>
          {errors.description && (
            <span className="text-red-500 text-sm mt-1 block">{errors.description.message}</span>
          )}
        </div>

        {/* Price and Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="text-gray-700 text-sm font-bold block mb-2">
              Price Per Night
            </label>
            <input
              type="number"
              min={1}
              className="border rounded w-full py-2 px-3 font-normal"
              {...register("pricePerNight", {
                required: "Price is required"
              })}
            />
            {errors.pricePerNight && (
              <span className="text-red-500 text-sm mt-1 block">{errors.pricePerNight.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="text-gray-700 text-sm font-bold block mb-2">
              Rating
            </label>
            <select
              {...register("rating", {
                required: "Rating is required"
              })}
              className="border rounded w-full py-2 px-3 font-normal"
            >
              <option value="" className="text-sm">
                Select Rating
              </option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {errors.rating && (
              <span className="text-red-500 text-sm mt-1 block">{errors.rating.message}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;