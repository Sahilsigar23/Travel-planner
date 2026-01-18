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
          src={photoUrl || `https://images.unsplash.com/photo-${['1501594907352-04cda38ebc29', '1539037116277-f6e0a434a9af', '1522199755839-a2bacb67c546', '1513581566782-56663dddc04a', '1506905925346-21bda4d32df4'][Math.abs((place?.placeName || 'place').length) % 5]}?w=400&h=300&fit=crop`}
          className="w-full h-48 object-cover"
          alt={place?.placeName || 'Place'}
          onError={(e) => {
            // Fallback chain: try different place images from CDN
            if (e.target.src.includes('photo-1501594907352')) {
              e.target.src = 'https://images.unsplash.com/photo-1539037116277-f6e0a434a9af?w=400&h=300&fit=crop';
            } else if (e.target.src.includes('photo-1539037116277')) {
              e.target.src = 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=400&h=300&fit=crop';
            } else if (e.target.src.includes('photo-1522199755839')) {
              e.target.src = 'https://images.unsplash.com/photo-1513581566782-56663dddc04a?w=400&h=300&fit=crop';
            } else {
              e.target.src = 'https://via.placeholder.com/400x300/e0e0e0/777777?text=Travel+Destination';
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
