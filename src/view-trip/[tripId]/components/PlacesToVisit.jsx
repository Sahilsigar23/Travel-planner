import React from "react";
import DayPlan from "./DayPlan";
import { normalizeItinerary } from "@/lib/tripData";

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
          <DayPlan key={index} dayItem={dayItem} dayIndex={index} />
        ))}
      </div>
    </div>
  );
};

export default PlacesToVisit;
