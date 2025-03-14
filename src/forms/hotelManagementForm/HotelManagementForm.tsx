import { FormProvider, useForm } from "react-hook-form";
import Details from "./Details";
import Type from "./Type";
import Facilities from "./Facilities";
import Visitors from "./Visitors";
import Images from "./Images";
//data what will be inside my form.
export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  rating: number;
  facilities: string[];
  imageFiles: FileList;
  adultsCount: number;
  childrenCount: number;
};

//On save props
type Props = {
  onSave: (formData: FormData) => void;
  isPending: boolean;
};

const HotelManagementForm = ({ onSave, isPending }: Props) => {
  const formMethods = useForm<HotelFormData>(); // the reason I am doing it because I have broken our form up intp smaller components so in order to use form provider so the child component get access to all the react-hook-form methods
  //all we going is react-hook-form is use HotelFormData type. Basic spreading all the properties of use form into hoteformdata

  const { handleSubmit } = formMethods;

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    const formData = new FormData();
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("rating", formDataJson.rating.toString());
    formData.append("adultCount", formDataJson.adultsCount.toString());
    formData.append("childrenCount", formDataJson.childrenCount.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

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
            {isPending ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default HotelManagementForm;