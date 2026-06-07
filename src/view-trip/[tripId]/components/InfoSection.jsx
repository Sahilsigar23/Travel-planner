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
    <div className="relative h-[340px] w-full overflow-hidden rounded-3xl shadow-2xl sm:h-[420px]">
      {/* Trip Image */}
      <img
        src={photoUrl || `https://images.unsplash.com/photo-${['1469474968028-56623f02e42e', '1506905925346-21bda4d32df4', '1501594907352-04cda38ebc29', '1488646953014-e52207ff29db', '1524492412873-47ba467cea47'][Math.abs((trip?.userSelction?.Destination || 'destination').length) % 5]}?w=1200&h=600&fit=crop`}
        className="h-full w-full object-cover"
        alt={trip?.userSelction?.Destination || 'Trip'}
        onError={(e) => {
          // Fallback chain: try different destination images from CDN
          if (e.target.src.includes('photo-1469474968028')) {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop';
          } else if (e.target.src.includes('photo-1506905925346')) {
            e.target.src = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=600&fit=crop';
          } else if (e.target.src.includes('photo-1501594907352')) {
            e.target.src = 'https://images.unsplash.com/photo-1488646953014-e52207ff29db?w=1200&h=600&fit=crop';
          } else {
            e.target.src = 'https://via.placeholder.com/1200x600/d0d0d0/888888?text=Travel+Destination';
          }
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

      {/* Trip Details */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <span className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400" />
          Your itinerary is ready
        </span>
        <h2 className="font-extrabold text-3xl sm:text-5xl text-white drop-shadow-lg">
          {trip?.userSelction?.Destination}
        </h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <div className="glass rounded-full px-4 py-2 text-sm font-medium text-white">
            📅 {trip?.userSelction?.days} Days
          </div>
          <div className="glass rounded-full px-4 py-2 text-sm font-medium text-white">
            💰 {trip?.userSelction?.budget} Budget
          </div>
          <div className="glass rounded-full px-4 py-2 text-sm font-medium text-white">
            🥂 {trip?.userSelction?.travelers} Travelers
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
