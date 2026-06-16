import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { geocodeCity, getWeather, weatherCodeInfo, weatherAdvice } from "@/service/RealtimeApi";

const dayName = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });

function WeatherCard() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async (e) => {
    e?.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true);
    setError("");
    setMatches([]);
    setWeather(null);
    setPlace(null);
    try {
      const results = await geocodeCity(query);
      if (!results.length) {
        setError(`No city found for "${query}". Try a nearby city name.`);
      } else if (results.length === 1) {
        await loadWeather(results[0]);
      } else {
        setMatches(results);
      }
    } catch {
      setError("Live weather is temporarily unavailable. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  const loadWeather = async (selected) => {
    setMatches([]);
    setPlace(selected);
    setLoading(true);
    setError("");
    try {
      const data = await getWeather(selected.latitude, selected.longitude);
      setWeather(data);
    } catch {
      setError("Live weather is temporarily unavailable. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  const current = weather?.current;
  const info = current ? weatherCodeInfo(current.code) : null;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="mb-1 flex items-center gap-2 text-xl font-bold text-white">
        🌤️ Weather Forecast
      </h3>
      <p className="mb-4 text-sm text-white/60">
        Live conditions and a 7-day outlook for any city.
      </p>

      <form onSubmit={search} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a city (e.g., Manali, Tokyo)…"
          className="input-dark"
        />
        <Button
          type="submit"
          disabled={loading}
          className="rounded-md bg-gradient-to-r from-orange-500 to-orange-600 px-5 hover:from-orange-600 hover:to-orange-700"
        >
          {loading ? "…" : "Check"}
        </Button>
      </form>

      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

      {/* Disambiguation list when a name matches multiple cities */}
      {matches.length > 0 && (
        <ul className="mt-4 overflow-hidden rounded-xl border border-white/10">
          {matches.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => loadWeather(m)}
                className="flex w-full items-center gap-2 border-b border-white/10 px-4 py-2.5 text-left text-sm text-white transition-colors last:border-b-0 hover:bg-white/10"
              >
                <span className="text-orange-400">📍</span>
                {m.name}
                {m.admin1 ? `, ${m.admin1}` : ""}, {m.country}
              </button>
            </li>
          ))}
        </ul>
      )}

      {place && weather && current && (
        <div className="mt-5">
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
            <div className="text-right text-5xl">{info.icon}</div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-white/80">
            <div className="rounded-lg bg-white/5 px-3 py-2">💧 Humidity: {current.humidity}%</div>
            <div className="rounded-lg bg-white/5 px-3 py-2">💨 Wind: {current.wind} km/h</div>
          </div>

          {/* 7-day forecast */}
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {weather.daily.map((d) => {
              const di = weatherCodeInfo(d.code);
              return (
                <div key={d.date} className="rounded-xl bg-white/5 px-2 py-3 text-center">
                  <p className="text-xs font-semibold text-white/70">{dayName(d.date)}</p>
                  <p className="my-1 text-2xl">{di.icon}</p>
                  <p className="text-xs font-medium text-white">{d.max}°</p>
                  <p className="text-xs text-white/50">{d.min}°</p>
                  {d.precip > 0 && <p className="mt-1 text-[10px] text-sky-300">💧{d.precip}%</p>}
                </div>
              );
            })}
          </div>

          {/* Packing / activity advice */}
          <div className="mt-4 space-y-1.5">
            {weatherAdvice(weather).map((tip, i) => (
              <p key={i} className="text-sm text-white/80">{tip}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherCard;
