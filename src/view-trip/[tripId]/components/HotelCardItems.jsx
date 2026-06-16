import React from "react";
import { Link } from "react-router-dom";
import { getFallbackImage } from "@/service/GlobalApi";

function HotelCardItems({ hotel, index }) {
  // Curated, billing-free hotel image (cycles so each card looks distinct).
  const photoUrl = getFallbackImage(index, "hotel");

  // Plain Google Maps search link — no API key / billing required.
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${hotel.hotelName} ${hotel.hotelAddress}`.trim()
  )}`;

  return (
    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <Link to={mapsUrl} target="_blank" rel="noopener noreferrer">
        <img
          src={photoUrl}
          alt={hotel.hotelName}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/400x300/1f2937/9ca3af?text=Hotel";
          }}
        />
      </Link>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h2 className="font-semibold text-lg text-white">{hotel.hotelName}</h2>
        {hotel.hotelAddress && (
          <p className="text-sm text-white/70">📍 {hotel.hotelAddress}</p>
        )}
        {hotel.description && (
          <p className="text-sm text-white/60 mt-1 line-clamp-2">{hotel.description}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-green-400">💰 {hotel.price}</span>
          <span className="text-sm text-yellow-400">⭐ {hotel.rating}</span>
        </div>
        <Link
          to={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-sm font-medium text-orange-400 transition-transform hover:translate-x-1"
        >
          View on map →
        </Link>
      </div>
    </div>
  );
}

export default HotelCardItems;
