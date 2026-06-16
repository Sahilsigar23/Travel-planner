import { getPlaceImage, getFallbackImage } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";

function InfoSection({ trip }) {
  const destination = trip?.userSelction?.Destination;
  const [photoUrl, setPhotoUrl] = useState(getFallbackImage(destination || "destination"));

  useEffect(() => {
    if (!destination) return;
    let active = true;
    // Free destination photo from Wikipedia, with a curated fallback.
    getPlaceImage(destination).then((url) => {
      if (active && url) setPhotoUrl(url);
    });
    return () => {
      active = false;
    };
  }, [destination]);

  return (
    <div className="relative h-[340px] w-full overflow-hidden rounded-3xl shadow-2xl sm:h-[420px]">
      {/* Trip Image */}
      <img
        src={photoUrl}
        className="h-full w-full object-cover"
        alt={destination || "Trip"}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = getFallbackImage(destination || "destination");
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
          {destination}
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
