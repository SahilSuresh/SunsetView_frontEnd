import { RegisterFormData } from "./pages/Register";
import { LoginFormData } from "./pages/SignIn";
import { HotelType } from "../../backEnd/src/userModels/hotel";
import { HotelQueryResponse } from "../../backEnd/src/share/type";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: LoginFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Invalid token");
  }

  return response.json();
};

//fetch the sign out
export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

//fetch the add hotel
export const addHotel = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }
  
  return response.json();
};

//fetch the get hotels
export const getHotels = async (): Promise<HotelType[]> => {  // reason we do it is because the frontend backend are working on the same type file to share type between frot-end and backend
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
}

//fetch hotel by id
export const getHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include", // to make sure the cookie is passed
  });
  if (!response.ok) {
    throw new Error("Error getting hotel");
  }
  return response.json();
}


//update the hotel
export const updateHotel = async (hotelId: string, formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }

  return response.json();
};

// New function to delete a specific image from a hotel
export const deleteHotelImage = async (hotelId: string, imageUrl: string) => {
  console.log(`Deleting image: ${imageUrl} from hotel: ${hotelId}`);
  const encodedImageUrl = encodeURIComponent(imageUrl);
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelId}/images?imageUrl=${encodedImageUrl}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const body = await response.json();
    console.error("Delete image API error:", body);
    throw new Error(body.message || "Failed to delete image");
  }

  const result = await response.json();
  console.log("Delete image API response:", result);
  return result;
};

// fetch request to called the search-end

export type SearchParameter = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childrenCount?: string;
  page?: string;
}

export const searchHotels = async (params: SearchParameter): Promise<HotelQueryResponse> => {
  const queryParameter = new URLSearchParams();
  queryParameter.append("destination", params.destination || "") // if the destination is not provided, it will be empty
  queryParameter.append("checkIn", params.checkIn || "");
  queryParameter.append("checkOut", params.checkOut || "");  
  queryParameter.append("adultCount", params.adultCount || "");
  queryParameter.append("childrenCount", params.childrenCount || "");
  queryParameter.append("page", params.page || ""); 

  //make the fetch request
  const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParameter}`);
  
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();
}