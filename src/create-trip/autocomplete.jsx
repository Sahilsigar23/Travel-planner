import React, { useState } from "react";
import ReactGoogleAutocomplete from "react-google-autocomplete";

const GoMapAutocomplete = ({ onSelect }) => {
  const [value, setValue] = useState("");
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!API_KEY) {
    // Graceful fallback when API key is not configured
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          onSelect?.(v);
        }}
        placeholder="Enter destination (configure VITE_GOOGLE_MAPS_API_KEY for suggestions)"
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
    );
  }

  return (
    <ReactGoogleAutocomplete
      apiKey={API_KEY}
      autocompletionRequest={{
        types: ["(cities)"]
      }}
      onPlaceSelected={(place) => {
        const selected = place?.formatted_address || place?.name || value;
        setValue(selected || "");
        if (selected) onSelect(selected);
      }}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      placeholder="Search for a place..."
      style={{
        width: "100%",
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    />
  );
};

export default GoMapAutocomplete;