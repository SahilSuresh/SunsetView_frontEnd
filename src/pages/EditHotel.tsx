import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import * as apiClient from "../api-client";
import HotelManagementForm from "../forms/hotelManagementForm/HotelManagementForm";
import { useToast } from "../contexts/AppContext";

const EditHotel = () => {
    const { hotelId } = useParams();
    const { showToast } = useToast();
    const navigate = useNavigate();
    
    const { data: hotel, isLoading: isLoadingHotel } = useQuery({
        queryKey: ["getHotelById", hotelId],
        queryFn: () => apiClient.getHotelById(hotelId || ""),
        enabled: !!hotelId,
    });
    
    const { mutate, isPending } = useMutation({
        mutationFn: (formData: FormData) => 
            apiClient.updateHotel(hotelId || "", formData),
        onSuccess: () => {
            // Show success message
            showToast({ message: "Hotel updated successfully", type: "SUCCESS" });
            // Navigate back to the hotels list or to the updated hotel detail page
            navigate("/my-hotel");
        },
        onError: () => {
            // Show error message
            showToast({ message: "Error updating hotel", type: "ERROR" });
        }
    });
    
    const handleSave = (formData: FormData) => {
        mutate(formData);
    };
    
    // Show loading state while fetching the hotel data
    if (isLoadingHotel) {
        return <div>Loading hotel data...</div>;
    }
    
    return (
        <HotelManagementForm 
            hotel={hotel} 
            onSave={handleSave} 
            isPending={isPending}
        />
    );
}

export default EditHotel;