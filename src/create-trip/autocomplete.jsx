import React, { useState } from "react";
import axios from "axios";

const GoMapAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const API_KEY = "AlzaSySdDQnER9Pr9Ay8Mg_ZbHaonEbOxiFwUOs"; // Replace with your actual key

  const fetchSuggestions = async (input) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${input}&key=${API_KEY}`
      );
      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error("Error fetching autocomplete results:", error);
    }
  };

  const handleSelectSuggestion = (place) => {
    setQuery(place.description); // Update input field with selected place
    setSuggestions([]); // Clear suggestions list after selection
    onSelect(place.description); // Call onSelect prop with selected place
  };

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          fetchSuggestions(e.target.value);
        }}
        placeholder="Search for a place..."
        style={{ width: "100%", padding: "8px" }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            position: "absolute",
            width: "100%",
            background: "#fff",
            border: "1px solid #ccc",
            zIndex: 10,
          }}
        >
          {suggestions.map((place, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(place)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {place.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoMapAutocomplete;