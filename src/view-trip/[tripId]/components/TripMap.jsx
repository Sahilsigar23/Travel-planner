import React, { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { coordsOf, normalizeItinerary, getHotels, dayColor } from "@/lib/tripData";

// ---------------------------------------------------------------------------
// Interactive trip map (plain Leaflet — no React-Leaflet, no API key).
//
// Plots every hotel and every itinerary stop that the AI returned coordinates
// for, colour-coded by day, with a route line connecting each day's stops in
// order. Tiles are CartoDB "dark matter" (free, no key) so the map blends with
// the app's dark glass UI. OpenStreetMap + CARTO attribution is included.
// ---------------------------------------------------------------------------

// Build a small SVG pin as a Leaflet DivIcon so we can colour it per day and
// drop a label (day number / 🏨) in the centre without shipping image assets.
const makePin = (color, label) =>
  L.divIcon({
    className: "trip-pin",
    html: `
      <div style="position:relative;width:30px;height:40px;">
        <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C6.7 0 0 6.7 0 15c0 10 15 25 15 25s15-15 15-25C30 6.7 23.3 0 15 0z"
                fill="${color}" stroke="rgba(255,255,255,0.85)" stroke-width="1.5"/>
        </svg>
        <span style="position:absolute;top:6px;left:0;width:30px;text-align:center;
                     font-size:13px;font-weight:700;color:#fff;line-height:1;">${label}</span>
      </div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36],
  });

const esc = (s = "") =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function TripMap({ trip }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [activeDay, setActiveDay] = useState(null); // null = show all days

  // Collect everything we can place on the map from the saved trip.
  const { hotels, days, allPoints } = useMemo(() => {
    const itinerary = normalizeItinerary(trip);
    const days = itinerary.map((d, di) => ({
      day: d.day,
      dayIndex: di,
      theme: d.theme,
      color: dayColor(di),
      stops: (d.plan || [])
        .map((p, i) => ({ ...p, coords: coordsOf(p), order: i + 1 }))
        .filter((p) => p.coords),
    }));

    const hotels = getHotels(trip)
      .map((h) => ({ ...h, coords: coordsOf(h) }))
      .filter((h) => h.coords);

    const allPoints = [
      ...hotels.map((h) => h.coords),
      ...days.flatMap((d) => d.stops.map((s) => s.coords)),
    ];

    return { hotels, days, allPoints };
  }, [trip]);

  const totalStops = days.reduce((n, d) => n + d.stops.length, 0);

  // Initialise the Leaflet map once.
  useEffect(() => {
    if (mapRef.current || !containerRef.current || allPoints.length === 0) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false, // avoid hijacking page scroll; users can still +/- and drag
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [allPoints.length]);

  // Draw / redraw markers + routes whenever the data or the active-day filter changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous overlays (everything except the base tile layer).
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) map.removeLayer(layer);
    });

    const shownDays = activeDay == null ? days : days.filter((d) => d.day === activeDay);
    const bounds = [];

    // Hotels (only on the "all" view so a single-day view stays focused).
    if (activeDay == null) {
      hotels.forEach((h) => {
        const { latitude, longitude } = h.coords;
        bounds.push([latitude, longitude]);
        L.marker([latitude, longitude], { icon: makePin("#0ea5e9", "🏨") })
          .addTo(map)
          .bindPopup(
            `<strong>${esc(h.hotelName || h.name || "Hotel")}</strong>` +
              (h.price ? `<br/><span style="color:#16a34a">${esc(h.price)}</span>` : "") +
              (h.rating != null ? `<br/>⭐ ${esc(h.rating)}` : "")
          );
      });
    }

    // Itinerary stops + a route line per day.
    shownDays.forEach((d) => {
      const latlngs = [];
      d.stops.forEach((s) => {
        const { latitude, longitude } = s.coords;
        bounds.push([latitude, longitude]);
        latlngs.push([latitude, longitude]);
        L.marker([latitude, longitude], { icon: makePin(d.color, s.order) })
          .addTo(map)
          .bindPopup(
            `<span style="color:${d.color};font-weight:700">Day ${esc(d.day)} · Stop ${s.order}</span>` +
              `<br/><strong>${esc(s.placeName || "Place")}</strong>` +
              (s.bestTimeToVisit ? `<br/>☀️ ${esc(s.bestTimeToVisit)}` : "") +
              (s.timeToSpend ? `<br/>🕙 ${esc(s.timeToSpend)}` : "")
          );
      });
      if (latlngs.length > 1) {
        L.polyline(latlngs, {
          color: d.color,
          weight: 3,
          opacity: 0.75,
          dashArray: "6 8",
        }).addTo(map);
      }
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 13);
    } else if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
    // Recalculate size in case the container was laid out after init.
    setTimeout(() => map.invalidateSize(), 0);
  }, [activeDay, days, hotels]);

  // Nothing to plot (older trips saved before coordinates were captured).
  if (allPoints.length === 0) return null;

  return (
    <div className="mt-12 mb-8 no-print">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-white sm:text-3xl">
          🗺️ Trip Map
        </h2>
        <p className="text-sm text-white/60">
          {totalStops} stop{totalStops === 1 ? "" : "s"}
          {hotels.length > 0 ? ` · ${hotels.length} hotel${hotels.length === 1 ? "" : "s"}` : ""}
        </p>
      </div>

      {/* Day filter chips */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveDay(null)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            activeDay == null ? "bg-white text-slate-900" : "bg-white/10 text-white/80 hover:bg-white/20"
          }`}
        >
          All days
        </button>
        {days.map((d) => (
          <button
            key={d.day}
            onClick={() => setActiveDay(d.day)}
            className="rounded-full px-3 py-1 text-xs font-semibold text-white transition-transform hover:scale-105"
            style={{
              background: activeDay === d.day ? d.color : "rgba(255,255,255,0.10)",
            }}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        className="h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        style={{ background: "#0b1120" }}
      />
    </div>
  );
}

export default TripMap;
