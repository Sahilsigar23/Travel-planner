import React, { useEffect, useState } from "react";
import { GetPlacesDetails } from "@/service/GlobalApi";
import HotelCardItems from './HotelCardItems';

function Hotels({ trip }) {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    if (trip?.userSelction?.Destination) {
      fetchHotels(trip.userSelction.Destination);
    }
  }, [trip]);

  const fetchHotels = async (destination) => {
    try {
      const result = await GetPlacesDetails({ textQuery: `hotels in ${destination}` });
      console.log("Hotels API Response:", result); // Debugging log

      if (result?.results) {
        const hotelOptions = result.results.map((hotel) => ({
          hotelName: hotel.name,
          hotelAddress: hotel.formatted_address,
          hotelImageUrl: hotel.photos?.[0]?.photo_reference
            ? `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photo_reference=${hotel.photos[0].photo_reference}&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`
            : "/logo.svg",
          pricePerNight: hotel.price_level ? `$${hotel.price_level * 50}` : "N/A",
          rating: hotel.rating || "No rating",
        }));
        setHotels(hotelOptions);
      } else {
        console.warn("No hotels found for this location.");
        setHotels([]);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setHotels([]);
    }
  };

  return (
    <div className="mt-8 mb-8">
      <h2 className="font-bold text-2xl mb-6">Hotel Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {hotels.map((hotel, index) => (
          <HotelCardItems key={index} hotel={hotel} index={index} />
        ))}
      </div>
    </div>
  );
}

export default Hotels;