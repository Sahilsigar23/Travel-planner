import React from 'react';
import PlaceCardItems from './PlaceCardItems';

const PlacesToVisit = ({ trip }) => {
  console.log("PlacesToVisit component trip data:", trip); // Debugging log
  console.log("Places to visit:", trip?.tripData?.itinerary); // Debugging log

  const sortedDays = Object.keys(trip?.tripData?.itinerary || {}).sort();

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
              {trip.tripData.itinerary[dayKey].plan.map((planItem, planIndex) => (
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