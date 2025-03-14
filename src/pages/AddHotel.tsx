import { useMutation } from "@tanstack/react-query";
import HotelManagementForm from "../forms/hotelManagementForm/HotelManagementForm";
import { useToast } from "../contexts/AppContext";
import * as apiClient from "../api-client";

const AddHotel = () => {
    const { showToast } = useToast();
    const { mutate, isPending } = useMutation({
        mutationFn: (formData: FormData) => apiClient.addHotel(formData),
        onSuccess: () => {
            showToast({ message: "Hotel added successfully", type: "SUCCESS" });
        },
        onError: () => {
            showToast({ message: "Failed to add hotel", type: "ERROR" });
        }
    });

    const handleSubmit = (formData: FormData) => { 
        mutate(formData);
    }

    return <HotelManagementForm onSave={handleSubmit} isPending={isPending}/>;
}

export default AddHotel;