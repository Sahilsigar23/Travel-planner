import { GetPlacesDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PlaceCardItems({ place }) {
  const [photoUrl, setPhotoUrl] = useState(place.placeImageUrl);

  useEffect(() => {
    if (place) {
      GetPlacePhoto();
    }
  }, [place]);

  const GetPlacePhoto = async () => {
    if (!place?.placeName) return;
    const data = { textQuery: place.placeName };

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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden transform hover:-translate-y-1">
      <Link to={'https://www.google.com/maps/search/?api=1&query=' + (place?.placeName || 'place')} target='_blank'>
        <img
          src={photoUrl || `/OIP(${(Math.abs((place?.placeName || 'place').length) % 5) + 11}).webp`}
          className="w-full h-48 object-cover"
          alt={place?.placeName || 'Place'}
          onError={(e) => {
            // Fallback chain: try different place images, then placeholder
            if (e.target.src.includes('OIP')) {
              e.target.src = '/placeholder.jpg';
            } else if (e.target.src.includes('placeholder')) {
              e.target.src = '/image.png';
            } else if (!e.target.src.includes('logo.svg')) {
              e.target.src = '/logo.svg';
            }
          }}
        />
        <div className="p-4">
          <h2 className="font-semibold text-lg text-gray-800">{place?.placeName || 'Unknown Place'}</h2>
          <p className="text-sm text-gray-600 mt-1">{place?.placeDetails || 'No details available'}</p>
          <p className="text-sm text-blue-600 mt-1">🕙 {place?.timeToSpend || 'Time not specified'}</p>
        </div>
      </Link>
    </div>
  );
}

export default PlaceCardItems;
