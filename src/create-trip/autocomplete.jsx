import React, { useState } from "react";
import axios from "axios";

const GoMapAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual key

  const fetchSuggestions = async (input) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${input}&key=${API_KEY}`
      );


      if (response.data.status === "OK") {
        setSuggestions(response.data.predictions || []);
      } else {
        console.error("API Error:", response.data.status);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching autocomplete results:", error);
      setSuggestions([]);

    }
  };

  const handleSelectSuggestion = (place) => {

    setQuery(place.description); // Set input value to selected place
    setSuggestions([]); // Hide suggestions
    onSelect(place.description); // Pass only the description to parent
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>

      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          fetchSuggestions(e.target.value);
        }}
        placeholder="Search for a place..."

        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}

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

            borderRadius: "4px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
            maxHeight: "200px",
            overflowY: "auto",

          }}
        >
          {suggestions.map((place, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(place)}
              style={{

                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                fontSize: "14px",
                color: "#333",

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