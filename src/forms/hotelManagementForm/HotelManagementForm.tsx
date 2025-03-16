import { FormProvider, useForm } from "react-hook-form";
import Details from "./Details";
import Type from "./Type";
import Facilities from "./Facilities";
import Visitors from "./Visitors";
import Images from "./Images";
import { HotelType } from "../../../../backEnd/src/share/type";
import { useEffect } from "react";

// Define the data structure for the hotel form
export type HotelFormData = {
  id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childrenCount: number;
  facilities: string[];
  pricePerNight: number;
  rating: number;
  imageURL: string[]; // For existing image URLs
  imageFiles?: FileList; // For new image files being uploaded (optional)
};

// Define props for the form component
type Props = {
  hotel?: HotelType; // Optional hotel data for editing
  onSave: (formData: FormData) => void;
  isPending: boolean; // Loading state
};

const HotelManagementForm = ({ onSave, isPending, hotel }: Props) => {
  // Initialize react-hook-form with our HotelFormData type
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset } = formMethods;

  // Reset form with hotel data when available
  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    const formData = new FormData();

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
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-full text-lg transition-colors duration-300 disabled:bg-gray-300"
          >
            {isPending ? "Saving..." : "Save Hotel"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default HotelManagementForm;
