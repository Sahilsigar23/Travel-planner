import React, { useEffect, useState } from "react";
import PlaceCardItems from "./PlaceCardItems";
import { coordsOf, dayColor } from "@/lib/tripData";
import { getRouteLegs, formatDuration } from "@/service/RealtimeApi";

// One day of the itinerary. Renders the day header + its place cards, and
// enriches them with real driving times between consecutive stops (a single
// OSRM call per day, free/no-key). Travel info degrades silently if routing
// is unavailable or a stop is missing coordinates.
function DayPlan({ dayItem, dayIndex }) {
  const color = dayColor(dayIndex);
  // Per-card "travel from previous stop", keyed by the card's index in plan[].
  const [legByCardIndex, setLegByCardIndex] = useState({});
  const [summary, setSummary] = useState(null); // { durationSec, distanceKm } for the day

  useEffect(() => {
    let active = true;

    // Only the stops that actually have coordinates can be routed.
    const located = (dayItem.plan || [])
      .map((p, i) => ({ index: i, coords: coordsOf(p) }))
      .filter((x) => x.coords);

    if (located.length < 2) {
      setLegByCardIndex({});
      setSummary(null);
      return;
    }

    getRouteLegs(located.map((x) => x.coords))
      .then((legs) => {
        if (!active) return;
        const map = {};
        let totalSec = 0;
        let totalKm = 0;
        // legs[k] is the trip from located[k] -> located[k+1]; attribute it to
        // the arriving card so each card shows "time from the previous stop".
        legs.forEach((leg, k) => {
          const arrivingCardIndex = located[k + 1]?.index;
          if (arrivingCardIndex != null) map[arrivingCardIndex] = leg;
          totalSec += leg.durationSec;
          totalKm += leg.distanceKm;
        });
        setLegByCardIndex(map);
        setSummary({ durationSec: totalSec, distanceKm: totalKm });
      })
      .catch(() => {
        if (!active) return;
        setLegByCardIndex({});
        setSummary(null);
      });

    return () => {
      active = false;
    };
  }, [dayItem]);

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-white"
          style={{ background: color }}
        >
          Day {dayItem.day}
        </span>
        {dayItem.theme && (
          <span className="text-sm font-medium text-white/80">{dayItem.theme}</span>
        )}
        {summary && (
          <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
            🚗 ~{formatDuration(summary.durationSec)} · {summary.distanceKm.toFixed(1)} km driving
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {dayItem.plan.map((planItem, planIndex) => (
          <PlaceCardItems
            key={planIndex}
            place={planItem}
            travelFromPrev={legByCardIndex[planIndex]}
            accentColor={color}
          />
        ))}
      </div>
    </div>
  );
}

export default DayPlan;
