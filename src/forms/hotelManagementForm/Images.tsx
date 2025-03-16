import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./HotelManagementForm";
import { useState, type ChangeEvent, useEffect } from "react";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB in bytes

const Images = () => {
  const {
    formState: { errors },
    setError,
    clearErrors,
    watch,
    setValue
  } = useFormContext<HotelFormData>();
  
  const [fileNames, setFileNames] = useState<string>("No file chosen");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Watch the current value to show existing images
  const existingImages = watch("imageURL");
  
  // Effect to handle existing images on first load
  useEffect(() => {
    if (existingImages && Array.isArray(existingImages) && existingImages.length > 0 
        && typeof existingImages[0] === 'string' && selectedFiles.length === 0) {
      setFileNames(`${existingImages.length} existing image(s)`);
    }
  }, [existingImages, selectedFiles.length]);
  
  // Delete image function
  const handleDeleteImage = (index: number) => {
    if (existingImages && existingImages.length > 0) {
      const newImages = [...existingImages];
      newImages.splice(index, 1);
      setValue("imageURL", newImages);
    }
  };
  
  // Delete selected file
  const handleDeleteSelectedFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    // Update the form value with the new file list
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => {
      dataTransfer.items.add(file);
    });
    
    // Set imageFiles instead of imageURL for new uploads
    setValue("imageFiles", dataTransfer.files);
    setFileNames(newFiles.length > 0 ? `${newFiles.length} file(s) selected` : "No file chosen");
  };
  
  // Validate file size
  const validateFileSize = (files: FileList): boolean => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_FILE_SIZE) {
        return false;
      }
    }
    return true;
  };
  
  // Handle file input change to display selected file names
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Get count of existing images (if any)
      const existingImagesCount = existingImages && Array.isArray(existingImages) ? 
        existingImages.filter(img => typeof img === 'string').length : 0;
      
      // Calculate total images after adding new ones
      const totalImagesCount = existingImagesCount + selectedFiles.length + files.length;
      
      // Check if total exceeds 8 images
      if (totalImagesCount > 8) {
        setError("imageFiles", { 
          type: "maxCount", 
          message: `You can only have a maximum of 8 images total (attempting to add ${files.length} to existing ${existingImagesCount + selectedFiles.length})` 
        });
        return;
      }
      
      // Check file sizes
      if (!validateFileSize(files)) {
        setError("imageFiles", { 
          type: "validate", 
          message: "Each image must be less than 8MB" 
        });
        return;
      }
      
      clearErrors("imageFiles");
      
      // Add new files to existing selected files
      const newFileArray = [...selectedFiles];
      for (let i = 0; i < files.length; i++) {
        newFileArray.push(files[i]);
      }
      setSelectedFiles(newFileArray);
      
      // Update display text to show both existing and new images
      if (existingImagesCount > 0) {
        setFileNames(`${existingImagesCount} existing + ${newFileArray.length} new image(s)`);
      } else {
        setFileNames(`${newFileArray.length} file(s) selected`);
      }
      
      // Create a DataTransfer to combine files
      const dataTransfer = new DataTransfer();
      newFileArray.forEach(file => {
        dataTransfer.items.add(file);
      });
      
      // Set imageFiles for form submission
      setValue("imageFiles", dataTransfer.files);
    }
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="p-4 border rounded flex items-center gap-3">
        <label className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded cursor-pointer border border-gray-300 text-gray-700">
          Add Images
          <input
            type="file"
            multiple 
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <span className="text-gray-600">{fileNames}</span>
      </div>
      {(errors.imageURL || errors.imageFiles) && (
        <span className="text-red-500 text-sm font-bold mt-2 block">
          {errors.imageURL?.message?.toString() || errors.imageFiles?.message?.toString()}
        </span>
      )}
      
      {/* Display newly selected files */}
      {selectedFiles.length > 0 && (
        <div className="mt-3">
          <div className="text-sm text-blue-600 mb-2">
            New images ({selectedFiles.length})
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedFiles.map((file, index) => (
              <div key={`new-${index}`} className="relative group">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Selected image ${index + 1}`} 
                  className="w-36 h-36 object-cover rounded border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSelectedFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Display existing images */}
      {existingImages && Array.isArray(existingImages) && existingImages.length > 0 && 
       existingImages.some(img => typeof img === 'string') && (
        <div className="mt-3">
          <div className="text-sm text-green-600 mb-2">
            Existing images ({existingImages.filter(img => typeof img === 'string').length})
          </div>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((image, index) => (
              typeof image === 'string' && (
                <div key={`existing-${index}`} className="relative group">
                  <img 
                    src={image} 
                    alt={`Hotel image ${index + 1}`} 
                    className="w-36 h-36 object-cover rounded border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-2 text-sm text-gray-500">
        Note: Each image must be less than 8MB. Maximum 8 images total.
      </div>
    </div>
  );
};

export default Images;