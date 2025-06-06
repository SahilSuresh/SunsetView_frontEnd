import { RegisterFormData } from "./pages//auth/Register";
import { LoginFormData } from "./pages/auth/SignIn";
import {
  HotelType,
  PaymentIntentResponse,
  UserType,
} from "../../backEnd/src/share/type";
import { HotelQueryResponse } from "../../backEnd/src/share/type";
import { BookingFormData } from "./forms/bookingForm/RoomBookingForm";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/user`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error getting the users");
  }
  return response.json();
};

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
  
  return responseBody;
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
  try {
    // Check if we're on a verification-related page and skip token validation if so
    const currentPath = window.location.pathname;
    if (currentPath.includes('/verify-email') || 
        currentPath.includes('/reset-password') || 
        currentPath.includes('/forgot-password')) {
      console.log("Skipping token validation on public page");
      // Return a mock successful response
      return { isAuthenticated: false };
    }
    
    console.log("Validating authentication token");
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
      credentials: "include",
    });
    
    if (!response.ok) {
      console.log("Token validation failed:", response.status);
      throw new Error("Invalid token");
    }

    const data = await response.json();
    console.log("Token validated successfully");
    return data;
  } catch (error) {
    console.error("Token validation error:", error);
    throw error;
  }
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

// Password reset related API calls
export const requestPasswordReset = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/api/password/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to request password reset");
  }
  
  return data;
};

export const validateResetToken = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/password/validate-token/${token}`);
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Invalid or expired token");
  }
  
  return data;
};

export const resetPassword = async (token: string, password: string, confirmPassword: string) => {
  const response = await fetch(`${API_BASE_URL}/api/password/reset-password/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, confirmPassword }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to reset password");
  }
  
  return data;
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
export const getHotels = async (): Promise<HotelType[]> => {
  // reason we do it is because the frontend backend are working on the same type file to share type between frot-end and backend
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

//fetch hotel by id
export const getHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include", // to make sure the cookie is passed
  });
  if (!response.ok) {
    throw new Error("Error getting hotel");
  }
  return response.json();
};

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
  rating?: string | string[]; // Updated to allow array of ratings
  type?: string | string[]; // Allow multiple hotel types
  facilities?: string[];
  sortOption?:
    | "ratingHighToLow"
    | "pricePerNightLowToHigh"
    | "pricePerNightHighToLow";
};

// Updated searchHotels function with improved error handling
export const searchHotels = async (
  params: SearchParameter
): Promise<HotelQueryResponse> => {
  const queryParameter = new URLSearchParams();

  // Add existing parameters
  queryParameter.append("destination", params.destination || "");
  queryParameter.append("checkIn", params.checkIn || "");
  queryParameter.append("checkOut", params.checkOut || "");
  queryParameter.append("adultCount", params.adultCount || "");
  queryParameter.append("childrenCount", params.childrenCount || "");
  queryParameter.append("page", params.page || "");

  // Add rating filter parameters - UPDATED to handle array
  if (params.rating) {
    if (Array.isArray(params.rating)) {
      // Handle multiple ratings
      params.rating.forEach((rating) => {
        queryParameter.append("rating", rating);
      });
    } else {
      // Handle single rating
      queryParameter.append("rating", params.rating);
    }
  }

  // Handle hotel type (can be string or array)
  if (params.type) {
    if (Array.isArray(params.type)) {
      // Handle multiple hotel types
      params.type.forEach((type) => {
        queryParameter.append("type", type);
      });
    } else {
      // Handle single hotel type
      queryParameter.append("type", params.type);
    }
  }

  // Handle facilities array
  if (params.facilities && params.facilities.length > 0) {
    params.facilities.forEach((facility) => {
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

    const response = await fetch(
      `${API_BASE_URL}/api/hotels/search?${queryParameter}`,
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Add additional logging for debugging
    if (data && data.data && data.data.length > 0) {
      console.log(
        "Sample price data:",
        data.data.map((h: any) => ({
          name: h.name,
          price: h.pricePerNight,
          type: typeof h.pricePerNight,
        }))
      );
    }

    return data;
  } catch (error) {
    console.error("Search hotels error:", error);
    throw error;
  }
};

export const getAllHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels`);
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();

};
export const getHotelByIdBook = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);

  if (!response.ok) {
    throw new Error("Error fetching hotel by id");
  }

  return response.json();
};

// Create payment intent (updated for the latest Stripe version)
export const createPaymentIntent = async (
  hotelId: string,
  numberOfNight: string,
  adultCount: string,
  childrenCount: string
): Promise<PaymentIntentResponse> => {
  console.log(`Creating payment intent for hotel ${hotelId} for ${numberOfNight} nights with ${adultCount} adults and ${childrenCount} children`);
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`,
      {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ 
          numberOfNight,
          adultCount,
          childrenCount 
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      console.error("Payment intent error response:", errorData);
      throw new Error(errorData.message || `Error fetching payment intent: ${response.status}`);
    }

    const data = await response.json();
    console.log("Payment intent created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

// This ensures each payment intent is only processed once per app session
const processedPayments = new Set<string>();

export const createBooking = async (formData: BookingFormData) => {
  // If we've already processed this payment intent, return success immediately
  if (processedPayments.has(formData.paymentIntentId)) {
    console.log(`Payment intent ${formData.paymentIntentId} already processed. Skipping duplicate.`);
    return { message: "Booking already created" };
  }
  
  // Mark this payment as being processed
  processedPayments.add(formData.paymentIntentId);
  
  console.log("Creating booking with data:", {
    ...formData,
    paymentIntentId: formData.paymentIntentId?.substring(0, 10) + '...' // Log partial ID for security
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      }
    );

    // Handle empty or error responses
    if (!response.ok) {
      const responseText = await response.text();
      const responseData = responseText ? JSON.parse(responseText) : { message: `Error: ${response.status}` };
      throw new Error(responseData.message || "Error booking room");
    }
    
    // For successful responses that may be empty
    const responseText = await response.text();
    const responseData = responseText ? JSON.parse(responseText) : { message: "Booking created successfully" };
    
    console.log("Booking created successfully:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error in createBooking:", error);
    // Remove from processed set on error to allow retries
    processedPayments.delete(formData.paymentIntentId);
    throw error;
  }
}

export const getBookings = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching bookings");
  }

  return response.json();
};



export const deleteHotel = async (hotelId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(errorData.message || "Failed to delete hotel");
  }

  return response.json();
};


export const getHotelBookings = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}/bookings`, {
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};



// Add to api-client.ts - Admin API endpoints

// Admin dashboard stats
export const getAdminDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Error fetching admin dashboard stats");
  }
  
  return response.json();
};

// Get all users
export const getAdminUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Error fetching users");
  }
  
  return response.json();
};

// Delete a user
export const deleteUser = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error deleting user");
  }
  
  return response.json();
};

// Get all hotels for admin
export const getAdminHotels = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/hotels`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  
  return response.json();
};

// Get admin hotel by ID
export const getAdminHotelById = async (hotelId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/hotels/${hotelId}`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Error fetching hotel details");
  }
  
  return response.json();
};

// Get all bookings for admin
export const getAdminBookings = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/bookings`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Error fetching bookings");
  }
  
  return response.json();
};




// Add this function to your api-client.ts file

// Delete a hotel (admin only)
export const deleteAdminHotel = async (hotelId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/hotels/${hotelId}`, {
    method: "DELETE",
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error deleting hotel");
  }
  
  return response.json();
};


// Add to api-client.ts

// Submit contact form (with optional booking cancellation)
export const submitContactForm = async (formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
  bookingId?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for authenticated requests
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to submit form");
  }

  return response.json();
};



// Add these functions to your api-client.ts file

// Get all admin messages
export const getAdminMessages = async () => {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Error fetching messages");
  }
  
  return response.json();
};

// Mark message as read
export const markMessageAsRead = async (messageId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/contact/${messageId}/read`, {
    method: "PATCH",
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Error marking message as read");
  }
  
  return response.json();
};

// Process cancellation request
export const processCancellationRequest = async (messageId: string, status: string) => {
  const response = await fetch(`${API_BASE_URL}/api/contact/${messageId}/process-cancellation`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error processing cancellation request");
  }
  
  return response.json();
};