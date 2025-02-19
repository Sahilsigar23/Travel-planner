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
      <Link to={'https://www.google.com/maps/search/?api=1&query=' + place.placeName} target='_blank'>
        {photoUrl ? (
          <img
            src={photoUrl}
            className="w-full h-48 object-cover"
            alt={place.placeName}
          />
        ) : (
          <div className="h-48 w-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-500 text-sm">Image Not Available</span>
          </div>
        )}
        <div className="p-4">
          <h2 className="font-semibold text-lg text-gray-800">{place.placeName}</h2>
          <p className="text-sm text-gray-600 mt-1">{place.placeDetails}</p>
          <p className="text-sm text-blue-600 mt-1">🕙 {place.timeToSpend}</p>
        </div>
      </Link>
    </div>
  );
}

export default PlaceCardItems;