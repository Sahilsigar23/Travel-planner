// ---------------------------------------------------------------------------
// Shared helpers for reading the AI-generated trip shape.
//
// The itinerary has been saved in a few different forms over time (a flat
// array of day objects, or a legacy object keyed by "Day 1", "Day 2", …).
// These helpers normalize whatever is stored so the map, the day-by-day list,
// and the travel-time logic all agree on one consistent structure.
// ---------------------------------------------------------------------------

// Pull a usable { latitude, longitude } pair out of an AI place/hotel object,
// tolerating the various key spellings the model has produced. Returns null
// when no valid numeric coordinate pair is present.
export function coordsOf(obj) {
  const geo =
    obj?.geoCoordinates ||
    obj?.geo_coordinates ||
    obj?.coordinates ||
    obj?.geo ||
    null;
  if (!geo) return null;

  const lat = Number(geo.latitude ?? geo.lat ?? geo[0]);
  const lng = Number(geo.longitude ?? geo.lng ?? geo.long ?? geo[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat === 0 && lng === 0) return null; // "null island" — almost always a missing value
  return { latitude: lat, longitude: lng };
}

// Normalize the AI itinerary into a consistent [{ day, theme, plan[] }] list.
// Handles the new array form as well as legacy object/keyed forms so previously
// saved trips still render correctly.
export function normalizeItinerary(trip) {
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

// Pull the hotel list out of a trip, tolerating the various keys the AI has
// used. Coordinates are preserved (the on-page Hotels list drops them).
export function getHotels(trip) {
  const list =
    trip?.tripData?.hotels ||
    trip?.tripData?.hotelOptions ||
    trip?.tripData?.hotel_options ||
    [];
  return Array.isArray(list) ? list : [];
}

// A stable, readable colour per day index — used to colour map pins/routes and
// (optionally) day badges so the map and the itinerary line up visually.
export const DAY_COLORS = [
  "#f97316", // orange
  "#3b82f6", // blue
  "#22c55e", // green
  "#a855f7", // purple
  "#ec4899", // pink
  "#eab308", // amber
  "#14b8a6", // teal
  "#ef4444", // red
  "#6366f1", // indigo
  "#f43f5e", // rose
];

export const dayColor = (dayIndex) => DAY_COLORS[dayIndex % DAY_COLORS.length];
