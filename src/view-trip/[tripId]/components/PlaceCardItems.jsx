import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlaceInfo, getFallbackImage } from "@/service/GlobalApi";
import { formatDuration } from "@/service/RealtimeApi";

function PlaceCardItems({ place, travelFromPrev, accentColor }) {
  const [photoUrl, setPhotoUrl] = useState(getFallbackImage(place?.placeName));
  const [wikiDesc, setWikiDesc] = useState("");

  useEffect(() => {
    let active = true;
    if (place?.placeName) {
      // Real photo + description from Wikipedia (free, no billing).
      getPlaceInfo(place.placeName).then((info) => {
        if (!active || !info) return;
        if (info.image) setPhotoUrl(info.image);
        if (info.description) setWikiDesc(info.description);
      });
    }
    return () => {
      active = false;
    };
  }, [place?.placeName]);

  // Prefer the AI's tailored details; enrich with Wikipedia when AI text is thin.
  const description =
    place?.placeDetails && place.placeDetails.length > 20
      ? place.placeDetails
      : wikiDesc || place?.placeDetails || "A popular spot worth visiting.";

  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(place?.placeName || "place");

  return (
    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <Link to={mapsUrl} target="_blank" rel="noopener noreferrer" className="block">
        <img
          src={photoUrl}
          className="w-full h-48 object-cover"
          alt={place?.placeName || "Place"}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getFallbackImage(place?.placeName);
          }}
        />
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        {travelFromPrev && (
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80"
            style={accentColor ? { color: accentColor } : undefined}
          >
            🚗 {formatDuration(travelFromPrev.durationSec)} · {travelFromPrev.distanceKm.toFixed(1)} km from previous stop
          </span>
        )}
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-lg text-white">
            {place?.placeName || "Unknown Place"}
          </h2>
          {place?.rating != null && place.rating !== "" && (
            <span className="shrink-0 text-sm text-yellow-400">⭐ {place.rating}</span>
          )}
        </div>

        <p className="text-sm text-white/70 line-clamp-3">{description}</p>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {place?.timeToSpend && (
            <span className="rounded-full bg-sky-500/15 px-2.5 py-1 text-xs font-medium text-sky-300">
              🕙 {place.timeToSpend}
            </span>
          )}
          {place?.ticketPricing && (
            <span className="rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-medium text-green-300">
              🎟️ {place.ticketPricing}
            </span>
          )}
          {place?.bestTimeToVisit && (
            <span className="rounded-full bg-purple-500/15 px-2.5 py-1 text-xs font-medium text-purple-300">
              ☀️ {place.bestTimeToVisit}
            </span>
          )}
        </div>

        <Link
          to={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-sm font-medium text-orange-400 transition-transform hover:translate-x-1"
        >
          View on map →
        </Link>
      </div>
    </div>
  );
}

export default PlaceCardItems;
