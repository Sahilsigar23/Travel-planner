import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { POPULAR_DESTINATIONS } from "@/constants/destinations";

// Destination autocomplete — free, no API key, no billing.
//   1. Instant prefix matching against a bundled list of popular destinations.
//   2. Live OpenStreetMap (Nominatim) results to cover the long tail.
// Nominatim is filtered to real places (cities/regions/countries) and debounced
// to respect its usage policy. The bundled list always works, even offline.
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

// Rank bundled matches: prefix matches first, then substring matches.
const matchLocal = (q) => {
  const query = q.toLowerCase();
  const starts = [];
  const contains = [];
  for (const dest of POPULAR_DESTINATIONS) {
    const low = dest.toLowerCase();
    if (low.startsWith(query)) starts.push(dest);
    else if (low.includes(query)) contains.push(dest);
  }
  return [...starts, ...contains];
};

// Build a concise "City, Region, Country" label from a Nominatim result.
const formatNominatim = (item) => {
  const a = item.address || {};
  const place =
    a.city ||
    a.town ||
    a.village ||
    a.municipality ||
    a.county ||
    a.state ||
    a.region ||
    item.name;
  const parts = [place, a.state && a.state !== place ? a.state : null, a.country].filter(
    Boolean
  );
  const label = [...new Set(parts)].join(", ");
  return label || item.display_name;
};

const GoMapAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const skipNextFetch = useRef(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    // 1. Show bundled matches immediately for a responsive feel.
    const local = matchLocal(q);
    setSuggestions(local.slice(0, 7));
    setOpen(true);

    // 2. Augment with live OpenStreetMap results (debounced).
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q,
          format: "json",
          addressdetails: "1",
          limit: "6",
          "accept-language": "en",
        });
        const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        const data = await res.json();
        const remote = (Array.isArray(data) ? data : [])
          // Keep only real places (drops shops, buildings, roads, etc.).
          .filter((item) => ["place", "boundary"].includes(item.class))
          .map(formatNominatim)
          .filter(Boolean);

        // Local matches first, then unique remote matches.
        const merged = [...new Set([...local, ...remote])].slice(0, 7);
        setSuggestions(merged);
        setOpen(true);
      } catch (err) {
        // Offline / blocked — the bundled matches already shown are enough.
        if (err.name !== "AbortError") setSuggestions(local.slice(0, 7));
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSelect(value); // keep parent in sync even with free-typed text
  };

  const handleSelect = (destination) => {
    skipNextFetch.current = true; // don't reopen suggestions right after picking
    setQuery(destination);
    setSuggestions([]);
    setOpen(false);
    onSelect(destination);
  };

  return (
    <div className="relative w-full" ref={boxRef}>
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder="Search for a destination (e.g., Tokyo, Japan)..."
        className="w-full input-dark"
        autoComplete="off"
      />

      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        </div>
      )}

      {open && suggestions.length > 0 && (
        <ul className="glass-overlay absolute z-20 mt-2 w-full overflow-hidden rounded-xl">
          {suggestions.map((destination, index) => (
            <li
              key={index}
              onClick={() => handleSelect(destination)}
              className="flex cursor-pointer items-center gap-3 border-b border-white/10 px-4 py-2.5 text-sm transition-colors last:border-b-0 hover:bg-white/10"
            >
              <span className="text-orange-400">📍</span>
              <span className="font-medium text-white">{destination}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoMapAutocomplete;
