import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

const GoMapAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // For now, we'll just use a simple text input that updates the parent
  // Google Places API requires special handling for CORS or server-side implementation
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Always update parent with current value
    onSelect(value);
    console.log("Destination updated:", value); // Debug log
  };

  // Simple suggestions based on common destinations (fallback)
  const commonDestinations = [
    "Tokyo, Japan",
    "Paris, France", 
    "New York, USA",
    "London, UK",
    "Rome, Italy",
    "Bangkok, Thailand",
    "Dubai, UAE",
    "Singapore",
    "Barcelona, Spain",
    "Sydney, Australia"
  ];

  const handleFocus = () => {
    if (query.length > 0) {
      const filtered = commonDestinations.filter(dest => 
        dest.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    }
  };

  const handleSelectSuggestion = (destination) => {
    setQuery(destination);
    setSuggestions([]);
    onSelect(destination);
    console.log("Selected destination:", destination);
  };

  const filterSuggestions = (input) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }
    
    const filtered = commonDestinations.filter(dest =>
      dest.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
  };

  useEffect(() => {
    if (query.length >= 2) {
      filterSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a destination (e.g., Tokyo, Japan)..."
        className="w-full input-dark"
      />
      
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className="glass-overlay absolute z-20 mt-2 w-full overflow-hidden rounded-xl">
          {suggestions.map((destination, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(destination)}
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
