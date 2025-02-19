import { GetPlacesDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HotelCardItems({ hotel, index }) {
  const [photoUrl, setPhotoUrl] = useState(hotel.hotelImageUrl);

  useEffect(() => {
    if (hotel) {
      GetPlacePhoto();
    }
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = { textQuery: hotel?.hotelName };

    try {
      const result = await GetPlacesDetails(data);
      console.log("API Response:", result); // Debugging log

      if (result?.results && result.results.length > 0 && result.results[0].photos?.length > 0) {
        const photoReference = result.results[0].photos[3].photo_reference; // Ensure it exists
        console.log("Photo Reference:", photoReference);

        const photoUrl = PHOTO_REF_URL(photoReference); // Pass reference dynamically
        setPhotoUrl(photoUrl);
      } else {
        console.warn("No photos available for this location.");
        setPhotoUrl(hotel.hotelImageUrl); // Set a fallback image if needed
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      setPhotoUrl(hotel.hotelImageUrl);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden transform hover:-translate-y-1">
      <Link
        key={hotel.hotelName + index}
        to={`https://www.google.com/maps/search/?api=1&query=${hotel.hotelName},${hotel.hotelAddress}`}
        target="_blank"
      >
        <img
          src={photoUrl || "/logo.svg"}
          alt="Hotel"
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="font-semibold text-lg text-gray-800">{hotel?.hotelName}</h2>
          <p className="text-sm text-gray-600 mt-1">📍{hotel?.hotelAddress}</p>
          <p className="text-sm text-green-600 mt-1">💰{hotel?.pricePerNight}</p>
          <p className="text-sm text-yellow-600 mt-1">⭐{hotel?.rating}</p>
        </div>
      </Link>
    </div>
  );
}

export default HotelCardItems;