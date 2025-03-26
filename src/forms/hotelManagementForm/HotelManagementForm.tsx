import { FormProvider, useForm } from "react-hook-form";
import Details from "./Details";
import Type from "./Type";
import Facilities from "./Facilities";
import Visitors from "./Visitors";
import Images from "./Images";
import { HotelType } from "../../../../backEnd/src/share/type";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

// Define the data structure for the hotel form - extending HotelType to include both ID formats
export type HotelFormData = HotelType & {
  _id?: string; // Add MongoDB's _id as optional
  imageFiles?: FileList; // For new image files being uploaded (optional)
};

// Define props for the form component
type Props = {
  hotel?: HotelType; // Optional hotel data for editing
  onSave: (formData: FormData) => void;
  isPending: boolean; // Loading state
};

const HotelManagementForm = ({ onSave, isPending, hotel }: Props) => {
  // Get hotelId from URL params if available
  const { hotelId } = useParams();
  
  // Initialize react-hook-form with our HotelFormData type
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset, watch, setValue } = formMethods;
  
  // For debugging
  const imageURLs = watch("imageURL");
  useEffect(() => {
    console.log("Current imageURL state:", imageURLs);
  }, [imageURLs]);

  // Reset form with hotel data when available
  useEffect(() => {
    console.log("Resetting form with hotel data:", hotel);
    if (hotel) {
      // Make a copy of the hotel object to avoid modifying it directly
      const formData = { ...hotel };
      
      // Explicitly set the ID to ensure it's available for the Images component
      if (hotelId) {
        formData.id = hotelId;
      }
      
      reset(formData);
    }
  }, [hotel, reset, hotelId]);
  
  // Make sure the URL hotelId is available in the form
  useEffect(() => {
    if (hotelId) {
      console.log("Setting hotel ID from URL:", hotelId);
      setValue("id", hotelId);
    }
  }, [hotelId, setValue]);

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    const formData = new FormData();

    console.log("Form submitted with data:", formDataJson);
    console.log("Current imageURL state before submitting:", formDataJson.imageURL);

    // If editing an existing hotel, include the ID
    if (hotel) {
      formData.append("hotelId", hotel.id);
    }

    // Add all form fields to FormData
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("rating", formDataJson.rating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childrenCount", formDataJson.childrenCount.toString());

    // Add facilities as an array
    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    // First add existing image URLs (if any)
    if (formDataJson.imageURL && formDataJson.imageURL.length > 0) {
      formDataJson.imageURL.forEach((url, index) => {
        formData.append(`imageURL[${index}]`, url);
      });
    }

    // Then add new image files (if any)
    if (formDataJson.imageFiles && formDataJson.imageFiles.length > 0) {
      Array.from(formDataJson.imageFiles).forEach((imageFile) => {
        formData.append("imageURL", imageFile);
      });
    }

    // For debugging
    console.log("Form data being submitted:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Call the save handler with the prepared FormData
    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        <Details />
        <Type />
        <Facilities />
        <Visitors />
        <Images />

        <span className="flex justify-end mt-6">
          <button
            disabled={isPending}
            type="submit"
            className="bg-gradient-to-r from-orange-300 to-orange-500 hover:from-orange-400 hover:to-orange-600 text-white font-bold px-6 py-2 rounded-full text-lg transition-colors duration-300 disabled:bg-gray-300 shadow-md"
          >
            {isPending ? "Saving..." : "Save Hotel"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default HotelManagementForm;