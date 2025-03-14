import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./HotelManagementForm";
import { useState } from "react";

const Images = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<HotelFormData>();
  
  const [fileNames, setFileNames] = useState("No file chosen");
  
  // Get the file input registration with its validation
  const imageFileValidation = register("imageFiles", {
    validate: (imageFiles) => {
      if (!imageFiles || imageFiles.length === 0) {
        return "At least one image should be added";
      }
      if (imageFiles.length > 8) {
        return "Total number of images cannot be more than 8";
      } 
      return true;
    },
  });
  
  // Handle file input change to display selected file names
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileNames(`${files.length} file(s) selected`);
    } else {
      setFileNames("No file chosen");
    }
    
    // Call the original onChange from register
    imageFileValidation.onChange(e);
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="p-4 border rounded flex items-center gap-3">
        <label className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded cursor-pointer border border-gray-300 text-gray-700">
          Choose files
          <input
            type="file"
            multiple 
            accept="image/*"
            className="hidden"
            {...imageFileValidation}
            onChange={handleFileChange}
          />
        </label>
        <span className="text-gray-600">{fileNames}</span>
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold mt-2 block">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default Images;