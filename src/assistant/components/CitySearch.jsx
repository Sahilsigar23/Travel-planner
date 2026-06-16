import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { geocodeCity } from "@/service/RealtimeApi";

// Reusable "pick a real place" field used by the routing tool. Debounced
// Open-Meteo geocoding; calls onSelect(place) with coordinates, or onSelect(null)
// when the user edits the text (so stale coordinates are never reused).
function CitySearch({ placeholder, onSelect }) {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const skip = useRef(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    const q = query.trim();
    if (q.length < 2) {
      setMatches([]);
      setOpen(false);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await geocodeCity(q);
        setMatches(res);
        setOpen(res.length > 0);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const label = (m) => [m.name, m.admin1, m.country].filter(Boolean).join(", ");

  const choose = (m) => {
    skip.current = true;
    setQuery(label(m));
    setMatches([]);
    setOpen(false);
    onSelect(m);
  };

  return (
    <div className="relative" ref={boxRef}>
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSelect(null);
        }}
        onFocus={() => matches.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className="input-dark"
        autoComplete="off"
      />
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
        </div>
      )}
      {open && matches.length > 0 && (
        <ul className="glass-overlay absolute z-30 mt-2 w-full overflow-hidden rounded-xl">
          {matches.map((m) => (
            <li
              key={m.id}
              onClick={() => choose(m)}
              className="flex cursor-pointer items-center gap-2 border-b border-white/10 px-4 py-2.5 text-sm text-white transition-colors last:border-b-0 hover:bg-white/10"
            >
              <span className="text-orange-400">📍</span>
              {label(m)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitySearch;
