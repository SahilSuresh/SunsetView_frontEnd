import { useState, type ChangeEvent, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./HotelManagementForm";
import * as apiClient from "../../api-client";
import { useParams } from "react-router-dom";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB in bytes

const Images = () => {
  const {
    formState: { errors },
    setError,
    clearErrors,
    watch,
    setValue,
    getValues
  } = useFormContext<HotelFormData>();
  
  // Get URL params to extract hotel ID
  const { hotelId: urlHotelId } = useParams<{ hotelId: string }>();
  
  const [fileNames, setFileNames] = useState<string>("No file chosen");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  
  // Watch the current value to show existing images
  const existingImages = watch("imageURL");
  const formHotelId = watch("id");
  
  // Effect to handle existing images on first load
  useEffect(() => {
    if (existingImages && Array.isArray(existingImages) && existingImages.length > 0 
        && typeof existingImages[0] === 'string' && selectedFiles.length === 0) {
      setFileNames(`${existingImages.length} existing image(s)`);
    }
  }, [existingImages, selectedFiles.length]);
  
  // Delete image function
  const handleDeleteImage = async (index: number, imageUrl: string) => {
    try {
      setIsDeleting(true);
      setDeletingIndex(index);
      
      console.log("Deleting image:", imageUrl);
      
      // Get hotel ID from different sources
      const effectiveHotelId = formHotelId || urlHotelId;
      console.log("Using hotel ID for deletion:", effectiveHotelId);
      
      // Make API call to delete the image from backend
      if (effectiveHotelId) {
        const result = await apiClient.deleteHotelImage(effectiveHotelId, imageUrl);
        console.log("Delete result:", result);
        
        // Update local state after successful deletion
        if (existingImages && existingImages.length > 0) {
          // Use the updated image array returned from the server
          if (result.updatedImageURLs) {
            setValue("imageURL", result.updatedImageURLs);
            console.log("Updated form with server image array:", result.updatedImageURLs);
          } else {
            // Fallback to local update if server doesn't return updated array
            const newImages = [...existingImages];
            newImages.splice(index, 1);
            setValue("imageURL", newImages);
            console.log("Updated form with locally modified array:", newImages);
          }
        }
      } else {
        console.log("No hotel ID available - performing local update only");
        // Just update locally since we couldn't get the hotel ID
        if (existingImages && existingImages.length > 0) {
          const newImages = [...existingImages];
          newImages.splice(index, 1);
          setValue("imageURL", newImages);
          console.log("Updated form locally only:", newImages);
        }
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      // Show error to user
      setError("imageURL", { 
        type: "manual", 
        message: error instanceof Error ? error.message : "Failed to delete image. Please try again." 
      });
    } finally {
      setIsDeleting(false);
      setDeletingIndex(null);
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
                    onClick={() => handleDeleteImage(index, image)}
                    disabled={isDeleting && deletingIndex === index}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:bg-gray-400"
                  >
                    {isDeleting && deletingIndex === index ? "..." : "✕"}
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