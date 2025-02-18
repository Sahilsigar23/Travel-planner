import React from 'react';

function InfoSection({ trip }) {
  return (
    <div>
      <img src='/logo.svg' className='h-[300px] w-full object-cover rounded' alt='Trip' />
      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{trip?.userSelction?.Destination}</h2>
          <div className='flex gap-5'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>📅 {trip?.userSelction?.days} Day</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>💰 {trip?.userSelction?.budget} Budget</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🥂 No. of Traveler: {trip?.userSelction?.travelers}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;