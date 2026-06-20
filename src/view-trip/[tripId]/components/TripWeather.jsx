import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  geocodeCity,
  getWeather,
  weatherCodeInfo,
  weatherAdvice,
} from "@/service/RealtimeApi";

const dayName = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });

// Live weather for the trip's destination, loaded automatically (no retyping).
// Reuses the same free Open-Meteo service the Assistant page uses, and links
// through to the full real-time toolset pre-filled with this city.
function TripWeather({ destination }) {
  // Open-Meteo geocoding matches on a plain city name, so drop any
  // ", Country" suffix the destination string may carry.
  const city = (destination || "").split(",")[0].trim();

  const [state, setState] = useState("loading"); // loading | ready | empty
  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!city) {
      setState("empty");
      return;
    }
    let active = true;
    setState("loading");

    (async () => {
      try {
        const matches = await geocodeCity(city);
        if (!matches.length) {
          if (active) setState("empty");
          return;
        }
        const data = await getWeather(matches[0].latitude, matches[0].longitude);
        if (!active) return;
        setPlace(matches[0]);
        setWeather(data);
        setState("ready");
      } catch {
        if (active) setState("empty");
      }
    })();

    return () => {
      active = false;
    };
  }, [city]);

  // Older trips with no resolvable destination — just hide the widget.
  if (state === "empty") return null;

  const current = weather?.current;
  const info = current ? weatherCodeInfo(current.code) : null;

  return (
    <div className="glass-card mt-12 rounded-2xl p-6 no-print">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-white sm:text-3xl">
          🌤️ Weather at your destination
        </h2>
        {city && (
          <Link
            to={`/assistant?city=${encodeURIComponent(city)}`}
            className="text-sm font-medium text-orange-400 transition-transform hover:translate-x-1"
          >
            Currency, routes & more tools →
          </Link>
        )}
      </div>

      {state === "loading" && (
        <div className="h-24 w-full animate-pulse rounded-xl bg-white/10" />
      )}

      {state === "ready" && current && (
        <>
          <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
            <div>
              <p className="text-sm text-white/70">
                {place.name}
                {place.admin1 ? `, ${place.admin1}` : ""}, {place.country}
              </p>
              <p className="mt-1 text-4xl font-extrabold text-white">{current.temp}°C</p>
              <p className="text-sm text-white/70">
                {info.label} · feels like {current.feelsLike}°C
              </p>
            </div>
            <div className="text-5xl">{info.icon}</div>
          </div>

          {/* 7-day outlook */}
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {weather.daily.map((d) => {
              const di = weatherCodeInfo(d.code);
              return (
                <div key={d.date} className="rounded-xl bg-white/5 px-2 py-3 text-center">
                  <p className="text-xs font-semibold text-white/70">{dayName(d.date)}</p>
                  <p className="my-1 text-2xl">{di.icon}</p>
                  <p className="text-xs font-medium text-white">{d.max}°</p>
                  <p className="text-xs text-white/50">{d.min}°</p>
                </div>
              );
            })}
          </div>

          {/* Packing / activity advice from the live forecast */}
          <div className="mt-4 space-y-1.5">
            {weatherAdvice(weather).map((tip, i) => (
              <p key={i} className="text-sm text-white/80">{tip}</p>
            ))}
          </div>

          <p className="mt-3 text-xs text-white/40">
            Live forecast — best used when your trip is within the next 7 days.
          </p>
        </>
      )}
    </div>
  );
}

export default TripWeather;
