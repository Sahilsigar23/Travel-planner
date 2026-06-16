import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CitySearch from "./CitySearch";
import {
  getRoute,
  TRAVEL_MODES,
  modeDurationSec,
  formatDuration,
  recommendMode,
} from "@/service/RealtimeApi";

function TrafficCard() {
  const [origin, setOrigin] = useState(null);
  const [dest, setDest] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const find = async () => {
    if (!origin || !dest) {
      setError("Please pick both an origin and a destination from the suggestions.");
      return;
    }
    setLoading(true);
    setError("");
    setRoute(null);
    try {
      const r = await getRoute(origin, dest);
      setRoute(r);
    } catch (e) {
      setError(
        e.message?.includes("route")
          ? e.message
          : "Live routing is temporarily unavailable. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  };

  const rec = route ? recommendMode(route.distanceKm) : null;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="mb-1 flex items-center gap-2 text-xl font-bold text-white">
        🚗 Travel Time &amp; Routes
      </h3>
      <p className="mb-4 text-sm text-white/60">
        Road distance and travel time between any two places.
      </p>

      <div className="space-y-2">
        <CitySearch placeholder="From (origin city)…" onSelect={setOrigin} />
        <CitySearch placeholder="To (destination city)…" onSelect={setDest} />
      </div>
      <Button
        onClick={find}
        disabled={loading}
        className="mt-3 w-full rounded-md bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
      >
        {loading ? "Finding route…" : "Find route"}
      </Button>

      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

      {route && (
        <div className="mt-5">
          <div className="rounded-2xl bg-white/5 p-4 text-center">
            <p className="text-sm text-white/70">
              {origin.name} → {dest.name}
            </p>
            <p className="mt-1 text-3xl font-extrabold text-white">
              {route.distanceKm < 10
                ? route.distanceKm.toFixed(1)
                : Math.round(route.distanceKm)}{" "}
              km
            </p>
            <p className="text-xs text-white/50">by road</p>
          </div>

          <div className="mt-3 space-y-2">
            {TRAVEL_MODES.map((m) => {
              const sec = modeDurationSec(m, route.distanceKm, route.drivingSec);
              const isRec = m.key === rec;
              return (
                <div
                  key={m.key}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                    isRec ? "bg-orange-500/20 ring-1 ring-orange-400/40" : "bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm text-white/85">
                    <span className="text-lg">{m.icon}</span> {m.label}
                    {m.speed ? <span className="text-xs text-white/40"> · est.</span> : null}
                  </span>
                  <span className="flex items-center gap-2">
                    {isRec && (
                      <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        Best
                      </span>
                    )}
                    <span className="font-semibold text-white">{formatDuration(sec)}</span>
                  </span>
                </div>
              );
            })}
          </div>

          {route.alternatives > 0 && (
            <p className="mt-3 text-sm text-white/70">
              🛣️ {route.alternatives} alternative route
              {route.alternatives > 1 ? "s" : ""} available.
            </p>
          )}

          <p className="mt-3 text-xs leading-relaxed text-white/45">
            ℹ️ Real-time traffic isn't available from our free data sources, so these
            times don't include live congestion. Driving is road-routed; cycling and
            walking are estimates. Actual times vary with weather, road conditions, and
            local events.
          </p>
        </div>
      )}
    </div>
  );
}

export default TrafficCard;
