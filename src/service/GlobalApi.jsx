import axios from "axios";

// ---------------------------------------------------------------------------
// Free, billing-free place / image service.
//
// Replaces the old Google Maps / GoMaps.pro Places + Photo APIs (which need a
// billing-enabled key) with:
//   • Wikipedia Action API  → real photos + descriptions, no key, CORS enabled
//   • Curated Unsplash CDN  → reliable themed fallbacks, no key, no billing
// ---------------------------------------------------------------------------

// Plain CDN image URLs (these do NOT require an Unsplash API key).
const TRAVEL_IMAGES = [
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1488646953014-e52207ff29db?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1524492412873-47ba467cea47?w=800&h=500&fit=crop",
];

const HOTEL_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop",
];

// Simple, stable string hash so the same name always maps to the same fallback.
const hashString = (str = "") => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
};

// Deterministic themed fallback image. `seed` may be a string (name) or a number (index).
export const getFallbackImage = (seed = "travel", type = "travel") => {
  const pool = type === "hotel" ? HOTEL_IMAGES : TRAVEL_IMAGES;
  const idx = typeof seed === "number" ? seed : hashString(String(seed));
  return pool[Math.abs(idx) % pool.length];
};

// In-memory cache so we don't re-query Wikipedia for the same place in a session.
const infoCache = new Map();

// Look up a place on Wikipedia and return { image, description }.
// Uses the Action API with a search generator so partial / fuzzy names resolve
// to the best-matching article. `origin=*` enables CORS from the browser.
export const getPlaceInfo = async (query) => {
  if (!query) return { image: null, description: null };

  const key = query.trim().toLowerCase();
  if (infoCache.has(key)) return infoCache.get(key);

  try {
    const { data } = await axios.get("https://en.wikipedia.org/w/api.php", {
      params: {
        action: "query",
        format: "json",
        origin: "*",
        generator: "search",
        gsrsearch: query,
        gsrlimit: 1,
        prop: "pageimages|extracts",
        piprop: "thumbnail",
        pithumbsize: 800,
        exintro: 1,
        explaintext: 1,
        redirects: 1,
      },
      timeout: 8000,
    });

    const pages = data?.query?.pages;
    const page = pages ? Object.values(pages)[0] : null;
    const info = {
      image: page?.thumbnail?.source || null,
      description: page?.extract ? page.extract.trim() : null,
    };
    infoCache.set(key, info);
    return info;
  } catch (error) {
    // Network/offline/Wikipedia hiccup — degrade gracefully to fallbacks.
    const info = { image: null, description: null };
    infoCache.set(key, info);
    return info;
  }
};

// Convenience: resolve just an image for a place, always returning something usable.
export const getPlaceImage = async (query, type = "travel") => {
  const info = await getPlaceInfo(query);
  return info?.image || getFallbackImage(query, type);
};
