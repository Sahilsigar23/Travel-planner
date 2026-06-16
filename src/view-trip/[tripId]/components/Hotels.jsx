import React, { useEffect, useState } from "react";
import HotelCardItems from "./HotelCardItems";

function Hotels({ trip }) {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    if (!trip) return;

    // Hotels now come straight from the AI-generated trip data — no paid Maps API.
    const aiHotels =
      trip?.tripData?.hotels ||
      trip?.tripData?.hotelOptions ||
      trip?.tripData?.hotel_options;

    if (Array.isArray(aiHotels) && aiHotels.length > 0) {
      setHotels(normalize(aiHotels));
    } else if (trip?.userSelction?.Destination) {
      setHotels(getFallbackHotels(trip.userSelction.Destination));
    }
  }, [trip]);

  // Tolerate whatever key-casing the AI used and produce a consistent shape.
  const normalize = (list) =>
    list.map((h) => ({
      hotelName: h.hotelName || h.name || "Hotel",
      hotelAddress: h.hotelAddress || h.address || "",
      price: h.price || h.pricePerNight || h.priceRange || "N/A",
      rating: h.rating ?? "N/A",
      description: h.description || h.desc || "",
    }));

  // Used only if the AI returned no hotels (e.g. older saved trips).
  const getFallbackHotels = (destination) => [
    {
      hotelName: `${destination} Central Hotel`,
      hotelAddress: `Downtown ${destination}`,
      price: "$80-120 / night",
      rating: 4.2,
      description: "Comfortable, well-located stay close to the main sights.",
    },
    {
      hotelName: `Budget Inn ${destination}`,
      hotelAddress: `Near City Center, ${destination}`,
      price: "$50-80 / night",
      rating: 3.8,
      description: "Affordable rooms with the essentials for budget travelers.",
    },
    {
      hotelName: `Luxury Resort ${destination}`,
      hotelAddress: `Premium Area, ${destination}`,
      price: "$150-250 / night",
      rating: 4.5,
      description: "Upscale amenities and premium service for a relaxing trip.",
    },
    {
      hotelName: `Business Hotel ${destination}`,
      hotelAddress: `Business District, ${destination}`,
      price: "$90-140 / night",
      rating: 4.1,
      description: "Modern rooms ideal for work and convenient transport links.",
    },
  ];

  if (!hotels.length) return null;

  return (
    <div className="mt-12 mb-8">
      <h2 className="font-bold text-2xl sm:text-3xl mb-6 text-white flex items-center gap-3">
        🏨 Hotel Recommendations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {hotels.map((hotel, index) => (
          <HotelCardItems key={index} hotel={hotel} index={index} />
        ))}
      </div>
    </div>
  );
}

export default Hotels;
