import React from 'react';
import PlaceCardItems from './PlaceCardItems';

const PlacesToVisit = ({ trip }) => {
  console.log("PlacesToVisit component trip data:", trip); // Debugging log
  console.log("Places to visit:", trip?.tripData?.itinerary); // Debugging log
  console.log("Day plan:", trip?.tripData?.day_plan); // Check alternative structure

  // Try multiple data structure formats
  let placesData = {};
  
  if (trip?.tripData?.itinerary) {
    placesData = trip.tripData.itinerary;
  } else if (trip?.tripData?.day_plan?.itinerary) {
    // Handle single day structure from AI
    placesData = { "Day 1": { plan: trip.tripData.day_plan.itinerary } };
  } else {
    // Fallback places data for demonstration
    const destination = trip?.userSelction?.Destination || "Tokyo, Japan";
    placesData = {
      "Day 1": {
        plan: [
          {
            placeName: `${destination} Main Attraction`,
            placeDetails: "Must-visit iconic landmark with beautiful views and rich history.",
            timeToSpend: "2-3 hours",
            ticketPricing: "Free to $20",
            rating: 4.5,
            bestTimeToVisit: "Morning"
          },
          {
            placeName: `${destination} Cultural Site`,
            placeDetails: "Experience local culture and traditions at this popular destination.",
            timeToSpend: "1-2 hours", 
            ticketPricing: "Free to $15",
            rating: 4.3,
            bestTimeToVisit: "Afternoon"
          },
          {
            placeName: `${destination} Shopping District`,
            placeDetails: "Vibrant shopping area with local shops, restaurants, and entertainment.",
            timeToSpend: "2-4 hours",
            ticketPricing: "Free",
            rating: 4.2,
            bestTimeToVisit: "Evening"
          }
        ]
      }
    };
  }

  const sortedDays = Object.keys(placesData).sort();

  return (
    <div className="mt-8 mb-8">
      <h2 className="font-bold text-2xl mb-6">Places To Visit</h2>
      <div className="space-y-6">
        {sortedDays.map((dayKey, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
          >
            <h2 className="font-semibold text-xl text-gray-800 mb-4">{dayKey}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(placesData[dayKey]?.plan || placesData[dayKey]?.itinerary || []).map((planItem, planIndex) => (
                <div key={planIndex}>
                  <PlaceCardItems place={planItem} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesToVisit;
