import { RegisterFormData } from "./pages/Register";
import { LoginFormData } from "./pages/SignIn";
import { HotelType } from "../../backEnd/src/share/type";
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

// Update the SearchParameter type
export type SearchParameter = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childrenCount?: string;
  page?: string;
  // New filters
  rating?: string;
  type?: string | string[]; // Allow multiple hotel types
  facilities?: string[];
  sortOption?: 'ratingHighToLow' | 'pricePerNightLowToHigh' | 'pricePerNightHighToLow';
}

// Updated searchHotels function with improved error handling
export const searchHotels = async (params: SearchParameter): Promise<HotelQueryResponse> => {
  const queryParameter = new URLSearchParams();
  
  // Add existing parameters
  queryParameter.append("destination", params.destination || "");
  queryParameter.append("checkIn", params.checkIn || "");
  queryParameter.append("checkOut", params.checkOut || "");  
  queryParameter.append("adultCount", params.adultCount || "");
  queryParameter.append("childrenCount", params.childrenCount || "");
  queryParameter.append("page", params.page || ""); 
  
  // Add new filter parameters
  if (params.rating) {
    queryParameter.append("rating", params.rating);
  }
  
  // Handle hotel type (can be string or array)
  if (params.type) {
    if (Array.isArray(params.type)) {
      // Handle multiple hotel types
      params.type.forEach(type => {
        queryParameter.append("type", type);
      });
    } else {
      // Handle single hotel type
      queryParameter.append("type", params.type);
    }
  }
  
  // Handle facilities array
  if (params.facilities && params.facilities.length > 0) {
    params.facilities.forEach(facility => {
      queryParameter.append("facilities", facility);
    });
  }
  
  // Add sort option
  if (params.sortOption) {
    queryParameter.append("sortOption", params.sortOption);
  }

  // Log for debugging
  console.log("Sending search request with params:", params);
  console.log("Query string:", queryParameter.toString());

  try {
    // Make the fetch request with timeout to avoid hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParameter}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Add additional logging for debugging
    if (data && data.data && data.data.length > 0) {
      console.log("Sample price data:", data.data.map((h: any) => ({ 
        name: h.name, 
        price: h.pricePerNight,
        type: typeof h.pricePerNight
      })));
    }
    
    return data;
  } catch (error) {
    console.error("Search hotels error:", error);
    throw error;
  }
}


export const getHotelByIdBook = async(hotelId: string): Promise<HotelType>=> {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);

  if(!response.ok) {
    throw new Error("Error fetching hotel by id");
  }

  return response.json();
}