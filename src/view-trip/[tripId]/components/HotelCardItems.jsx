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
          src={photoUrl || `https://images.unsplash.com/photo-${['1566073771259-6a8506099945', '1551882547-ff40c63fe5fa', '1582719478250-c89cae4dc85b', '1564501049412-61c2a3083791', '1571896349842-33c89424de2d'][index % 5]}?w=400&h=300&fit=crop`}
          alt={hotel.hotelName}
          className="w-full h-48 object-cover"
          onError={(e) => {
            // Fallback chain: try different hotel images from CDN
            if (e.target.src.includes('photo-1566073771259')) {
              e.target.src = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop';
            } else if (e.target.src.includes('photo-1551882547')) {
              e.target.src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop';
            } else if (e.target.src.includes('photo-1582719478')) {
              e.target.src = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop';
            } else {
              e.target.src = 'https://via.placeholder.com/400x300/f0f0f0/666666?text=Hotel+Image';
            }
          }}
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
