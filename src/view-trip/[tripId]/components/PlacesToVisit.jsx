import React from "react";
import PlaceCardItems from "./PlaceCardItems";

// Normalize the AI itinerary into a consistent [{ day, theme, plan[] }] list.
// Handles the new array form as well as legacy object/keyed forms so previously
// saved trips still render correctly.
function normalizeItinerary(trip) {
  const data = trip?.tripData?.itinerary || trip?.tripData?.day_plan?.itinerary;

  // New (preferred) form: an array of day objects.
  if (Array.isArray(data)) {
    return data
      .map((d, i) => ({
        day: d.day ?? i + 1,
        theme: d.theme || d.title || "",
        plan: d.plan || d.places || d.itinerary || [],
      }))
      .filter((d) => Array.isArray(d.plan) && d.plan.length > 0);
  }

  // Legacy form: an object keyed by "Day 1", "Day 2", ...
  if (data && typeof data === "object") {
    return Object.keys(data)
      .sort()
      .map((key, i) => {
        const value = data[key];
        const plan = Array.isArray(value)
          ? value
          : value?.plan || value?.itinerary || value?.places || [];
        const theme = value && typeof value === "object" ? value.theme || "" : "";
        return { day: i + 1, theme: theme || key, plan };
      })
      .filter((d) => Array.isArray(d.plan) && d.plan.length > 0);
  }

  return [];
}

const PlacesToVisit = ({ trip }) => {
  const days = normalizeItinerary(trip);

  if (!days.length) return null;

  return (
    <div className="mt-12 mb-8">
      <h2 className="font-bold text-2xl sm:text-3xl mb-6 text-white flex items-center gap-3">
        🗺️ Places To Visit
      </h2>
      <div className="space-y-6">
        {days.map((dayItem, index) => (
          <div key={index} className="glass-card rounded-2xl p-6">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-white">
                Day {dayItem.day}
              </span>
              {dayItem.theme && (
                <span className="text-sm font-medium text-white/80">{dayItem.theme}</span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dayItem.plan.map((planItem, planIndex) => (
                <PlaceCardItems key={planIndex} place={planItem} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesToVisit;
