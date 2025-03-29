import axios from "axios";

const BASE_URL = 'https://maps.gomaps.pro/maps/api/place/textsearch/json';

export const GetPlacesDetails = async (data) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        query: data.textQuery,
        key: import.meta.env.VITE_GOOGLE_PLACE_API_KEY, // API Key in params
        language: "en",
      },
    });
    console.log("API Response:", response.data); // Debugging log
    return response.data; // Return the data property directly
  } catch (error) {
    console.error("Error fetching place details:", error);
    throw error;
  }
}

export const PHOTO_REF_URL = (photoReference) =>
  `https://maps.gomaps.pro/maps/api/place/photo?photo_reference=${photoReference}&maxwidth=400&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;