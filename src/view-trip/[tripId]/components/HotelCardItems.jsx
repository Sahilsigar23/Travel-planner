import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlacesDetails, PHOTO_REF_URL } from "@/service/GlobalApi";

function HotelCardItems({ hotel, index }) {
  const [photoUrl, setPhotoUrl] = useState(hotel.hotelImageUrl);

  useEffect(() => {
    if (hotel?.hotelName) {
      GetPlacePhoto();
    }
  }, [hotel]);

  const GetPlacePhoto = async () => {
    try {
      const result = await GetPlacesDetails({ textQuery: hotel.hotelName });
      console.log("API Response:", result); // Debugging log

      if (result?.results?.[0]?.photos?.[3]?.photo_reference) {
        const photoReference = result.results[0].photos[3].photo_reference;
        console.log("Photo Reference:", photoReference);

        setPhotoUrl(PHOTO_REF_URL(photoReference));
      } else {
        console.warn("No photos available for:", hotel.hotelName);
        setPhotoUrl(hotel.hotelImageUrl);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      setPhotoUrl(hotel.hotelImageUrl);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden transform hover:-translate-y-1">
      <Link
        key={`${hotel.hotelName}-${index}`}
        to={`https://maps.gomaps.pro/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelName)},${encodeURIComponent(hotel.hotelAddress)}`}
        target="_blank"
      >
        <img
          src={photoUrl || "/logo.svg"}
          alt={hotel.hotelName}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="font-semibold text-lg text-gray-800">{hotel.hotelName}</h2>
          <p className="text-sm text-gray-600 mt-1">📍 {hotel.hotelAddress}</p>
          <p className="text-sm text-green-600 mt-1">💰 {hotel.pricePerNight}</p>
          <p className="text-sm text-yellow-600 mt-1">⭐ {hotel.rating}</p>
        </div>
      </Link>
    </div>
  );
}

export default HotelCardItems;
