import React from 'react';
import PlaceCardItems from './PlaceCardItems';
import './PlacesToVisit.css';

function PlacesToVisit({ trip }) {
  console.log("PlacesToVisit component trip data:", trip); // Debugging log
  console.log("Places to visit:", trip?.tripData?.itinerary?.day1?.plan); // Debugging log

  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Places To Visit</h2>
      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5'>
        {trip?.tripData?.itinerary?.day1?.plan?.map((planItem, index) => (
          <div key={index} className='hover:scale-105 transition-all cursor-pointer'>
            <h2 className='font-medium text-lg'>{planItem.time}</h2>
            <PlaceCardItems place={planItem} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;