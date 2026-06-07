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
      <div className="group glass-card overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-[200px] w-full overflow-hidden">
          {isLoading ? (
            <div className="h-full w-full animate-pulse bg-white/10" />
          ) : (
            <>
              <img
                src={photoUrl || `https://images.unsplash.com/photo-${['1488646953014-e52207ff29db', '1506905925346-21bda4d32df4', '1469474968028-56623f02e42e', '1501594907352-04cda38ebc29', '1524492412873-47ba467cea47'][Math.abs((trip?.userSelction?.Destination || 'trip').length) % 5]}?w=400&h=220&fit=crop`}
                alt={trip?.tripData?.location || "Trip Image"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              {trip?.userSelction?.budget && (
                <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {trip.userSelction.budget}
                </span>
              )}
              <h2 className="absolute bottom-3 left-4 right-4 truncate text-lg font-bold text-white drop-shadow">
                {trip?.tripData?.location || "Unknown Location"}
              </h2>
            </>
          )}
        </div>
        {/* Meta */}
        <div className="flex items-center justify-between p-4">
          <p className="flex items-center gap-1.5 text-sm text-white/80">
            <span>📅</span>
            {trip?.userSelction?.days} {trip?.userSelction?.days == 1 ? 'Day' : 'Days'} trip
          </p>
          <span className="text-sm font-medium text-orange-400 transition-transform group-hover:translate-x-1">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;
