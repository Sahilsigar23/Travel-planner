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
        className="w-full"
      />
      
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto mt-1">
          {suggestions.map((destination, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(destination)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 text-sm"
            >
              <div className="font-medium text-gray-900">{destination}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoMapAutocomplete;
