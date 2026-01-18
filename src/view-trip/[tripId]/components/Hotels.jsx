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

  // Fallback hotel data when API fails
  const getFallbackHotels = (destination) => [
    {
      hotelName: `${destination} Central Hotel`,
      hotelAddress: `Downtown ${destination}`,
      hotelImageUrl: `/OIP(11).webp`,
      pricePerNight: "$80-120",
      rating: 4.2,
    },
    {
      hotelName: `Budget Inn ${destination}`,
      hotelAddress: `Near City Center, ${destination}`,
      hotelImageUrl: `/OIP(12).webp`,
      pricePerNight: "$50-80",
      rating: 3.8,
    },
    {
      hotelName: `Luxury Resort ${destination}`,
      hotelAddress: `Premium Area, ${destination}`,
      hotelImageUrl: `/OIP(13).webp`,
      pricePerNight: "$150-250",
      rating: 4.5,
    },
    {
      hotelName: `Business Hotel ${destination}`,
      hotelAddress: `Business District, ${destination}`,
      hotelImageUrl: `/OIP(14).webp`,
      pricePerNight: "$90-140",
      rating: 4.1,
    }
  ];

  const fetchHotels = async (destination) => {
    try {
      const result = await GetPlacesDetails({ textQuery: `hotels in ${destination}` });

      if (result?.results && result.results.length > 0) {
        const hotelOptions = result.results.map((hotel) => ({
          hotelName: hotel.name,
          hotelAddress: hotel.formatted_address,
          hotelImageUrl: hotel.photos?.[0]?.photo_reference
            ? `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photo_reference=${hotel.photos[0].photo_reference}&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`
            : `/OIP(${Math.floor(Math.random() * 5) + 11}).webp`,
          pricePerNight: hotel.price_level ? `$${hotel.price_level * 50}` : "N/A",
          rating: hotel.rating || "No rating",
        }));
        setHotels(hotelOptions);
      } else {
        setHotels(getFallbackHotels(destination));
      }
    } catch (error) {
      setHotels(getFallbackHotels(destination));
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
