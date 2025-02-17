import React, { useState, useEffect } from "react";
import GoMapAutocomplete from "./autocomplete";
import Input from "../ui/input"; // Correct import path

function CreateTrip() {
  const [selectedDestination, setSelectedDestination] = useState("");

  // Log the selected destination whenever it updates
  useEffect(() => {
    if (selectedDestination) {
      console.log("Selected Destination:", selectedDestination);
    }
  }, [selectedDestination]);

  return (
    <div className="sm:px-10 md:px-32 lg:px-64 xl:px-80 px-6 mt-10">
      <h2 className="font-bold text-3xl">Plan your perfect getaway with ease and precision.</h2>
      <p className="mt-3 text-gray-500 text-xl">Tell us your preferences.</p>

      <div className="mt-20">
        <h2 className="text-xl my-3 font-medium">What is your destination of choice?</h2>
        <GoMapAutocomplete onSelect={setSelectedDestination} />
        {selectedDestination && (
          <p className="mt-3 text-green-600">Selected Destination: {selectedDestination}</p>
        )}
      </div>
      <div>
        <h2 className="text-xl my-3 font-medium">Number of days?</h2>
        <Input type="number" placeholder="Enter number of days" />
      </div>
    </div>
  );
}

export default CreateTrip;