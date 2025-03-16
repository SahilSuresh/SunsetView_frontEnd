import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import HotelManagementForm from "../forms/hotelManagementForm/HotelManagementForm";
import { useToast } from "../contexts/AppContext";
import * as apiClient from "../api-client";

const AddHotel = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    const { mutate, isPending } = useMutation({
        mutationFn: (formData: FormData) => apiClient.addHotel(formData),
        onSuccess: () => {
            showToast({ message: "Hotel added successfully", type: "SUCCESS" });
            navigate("/my-hotels");
        },
        onError: () => {
            showToast({ message: "Failed to add hotel", type: "ERROR" });
        }
    });

    const handleSubmit = (formData: FormData) => { 
        mutate(formData);
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Add New Hotel</h1>
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow">
                <HotelManagementForm onSave={handleSubmit} isPending={isPending}/>
            </div>
        </div>
    );
}

export default AddHotel;