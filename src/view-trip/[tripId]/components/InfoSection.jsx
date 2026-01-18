import { GetPlacesDetails } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';

const PHOTO_REF_URL = (photoReference) =>
  `https://maps.gomaps.pro/maps/api/place/photo?photo_reference=${photoReference}&maxwidth=400&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    if (trip) {
      GetPlacePhoto();
    }
  }, [trip]);

  const GetPlacePhoto = async () => {
    if (!trip?.userSelction?.Destination) return;

    const data = { textQuery: trip.userSelction.Destination };

    try {
      const result = await GetPlacesDetails(data);
      console.log("API Response:", result); // Debugging log

      if (result?.results && result.results.length > 0 && result.results[0].photos?.length > 0) {
        const photoReference = result.results[0].photos[0].photo_reference; // Ensure it exists
        console.log("Photo Reference:", photoReference);

        const photoUrl = PHOTO_REF_URL(photoReference); // Pass reference dynamically
        setPhotoUrl(photoUrl);
      } else {
        console.warn("No photos available for this location.");
        setPhotoUrl(null); // Set a fallback image if needed
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
      setPhotoUrl(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Trip Image */}
      <img
        src={photoUrl || `/OIP(${(Math.abs((trip?.userSelction?.Destination || 'destination').length) % 5) + 11}).webp`}
        className="h-64 w-full object-cover"
        alt={trip?.userSelction?.Destination || 'Trip'}
        onError={(e) => {
          // Fallback chain: try different destination images, then placeholder
          if (e.target.src.includes('OIP')) {
            e.target.src = '/placeholder.jpg';
          } else if (e.target.src.includes('placeholder')) {
            e.target.src = '/image.png';
          } else if (!e.target.src.includes('logo.svg')) {
            e.target.src = '/logo.svg';
          }
        }}
      />

      {/* Trip Details */}
      <div className="p-6">
        <h2 className="font-bold text-3xl text-gray-800 mb-4">
          {trip?.userSelction?.Destination}
        </h2>
        <div className="flex flex-wrap gap-3">
          <div className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600">
            📅 {trip?.userSelction?.days} Day
          </div>
          <div className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600">
            💰 {trip?.userSelction?.budget} Budget
          </div>
          <div className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600">
            🥂 No. of Traveler: {trip?.userSelction?.travelers}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
