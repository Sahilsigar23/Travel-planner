import { GetPlacesDetails } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PHOTO_REF_URL = (photoReference) => {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY; // Replace with your Google Places API key
  return `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
};

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState();
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Link to={'/view-trip/' + trip?.id}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="p-4">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 rounded-lg h-[220px] w-full" />
          ) : (
            <img
              src={photoUrl || `https://images.unsplash.com/photo-${['1488646953014-e52207ff29db', '1506905925346-21bda4d32df4', '1469474968028-56623f02e42e', '1501594907352-04cda38ebc29', '1524492412873-47ba467cea47'][Math.abs((trip?.userSelction?.Destination || 'trip').length) % 5]}?w=400&h=220&fit=crop`}
              alt={trip?.tripData?.location || "Trip Image"}
              className="object-cover rounded-lg h-[220px] w-full"
              onError={(e) => {
                // Fallback chain: try different trip images from CDN
                if (e.target.src.includes('photo-1488646953014')) {
                  e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=220&fit=crop';
                } else if (e.target.src.includes('photo-1506905925346')) {
                  e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=220&fit=crop';
                } else if (e.target.src.includes('photo-1469474968028')) {
                  e.target.src = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=220&fit=crop';
                } else {
                  e.target.src = 'https://via.placeholder.com/400x220/e5e5e5/999999?text=Trip+Image';
                }
              }}
            />
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold">
            {trip?.tripData?.location || "Unknown Location"}
          </h2>
          <p className="text-sm text-gray-500">
            {trip?.userSelction?.days} Days trip with {trip?.userSelction?.budget} Budget
          </p>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;
