import React from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
      <h1 className='font-extra-bold text-[60px] text-center'>
        <span className='text-[#f6450ff1]'>Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips
      </h1>
      <h2 className='text-xl text-gray-500 text-center'>
        Plan, Explore, and Experience the World Like Never Before
      </h2>
      <Link to='/create-trip'>  

        <button className='mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700'>
          Get Started
        </button>

      </Link>
    </div>
  );
}

export default Hero;