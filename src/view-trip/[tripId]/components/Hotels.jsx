import React from 'react';
import { Link } from 'react-router-dom';

function Hotels({ trip }) {
  console.log("Hotels component trip data:", trip); // Debugging log
  console.log("Hotel options:", trip?.tripData?.hotelOptions); // Debugging log

  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {trip?.tripData?.hotelOptions?.map((hotel, index) => (
          <Link key={hotel.hotelName + index} to={'https://www.google.com/maps/search/?api=1&query=' + hotel.hotelName + "," + hotel?.hotelAddress} target='_blank'>
            <div className='hover:scale-105 transition-all cursor-pointer'>
              <img src={hotel?.hotelImageUrl || "/logo.svg"} className='h-[200px] w-full object-cover rounded' alt='Hotel' />
              <div className='my-2 flex flex-col'>
                <h2 className='font-medium'>{hotel?.hotelName}</h2>
                <h2 className='text-xs text-gray-500'>📍{hotel?.hotelAddress}</h2>
                <h2 className='text-sm '>💰{hotel?.pricePerNight}</h2>
                <h2 className='text-sm'>⭐{hotel?.rating}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;