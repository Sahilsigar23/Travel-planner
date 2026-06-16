import { getPlaceImage, getFallbackImage } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UserTripCardItem({ trip }) {
  const destination = trip?.userSelction?.Destination;
  const [photoUrl, setPhotoUrl] = useState(getFallbackImage(destination || "trip"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!destination) {
      setIsLoading(false);
      return;
    }
    let active = true;
    // Free destination thumbnail from Wikipedia, with a curated fallback.
    getPlaceImage(destination).then((url) => {
      if (!active) return;
      if (url) setPhotoUrl(url);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [destination]);

  return (
    <Link to={"/view-trip/" + trip?.id}>
      <div className="group glass-card overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-[200px] w-full overflow-hidden">
          {isLoading ? (
            <div className="h-full w-full animate-pulse bg-white/10" />
          ) : (
            <>
              <img
                src={photoUrl}
                alt={destination || "Trip Image"}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getFallbackImage(destination || "trip");
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              {trip?.userSelction?.budget && (
                <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {trip.userSelction.budget}
                </span>
              )}
              <h2 className="absolute bottom-3 left-4 right-4 truncate text-lg font-bold text-white drop-shadow">
                {destination || "Unknown Location"}
              </h2>
            </>
          )}
        </div>
        {/* Meta */}
        <div className="flex items-center justify-between p-4">
          <p className="flex items-center gap-1.5 text-sm text-white/80">
            <span>📅</span>
            {trip?.userSelction?.days} {trip?.userSelction?.days == 1 ? "Day" : "Days"} trip
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
