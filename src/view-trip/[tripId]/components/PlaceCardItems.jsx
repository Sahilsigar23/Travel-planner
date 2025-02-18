import { Button } from '@/components/ui/button'
import React from 'react'
import { FaLocationArrow } from "react-icons/fa";
import { Link } from 'react-router-dom';

function PlaceCardItems({place}) {
  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+ place.placeName } target='_blank'>
    <div className='border rounded-2xl p-3 mt-2 flex gap-5'>
      <img src= "/logo.svg"className='h-[140px] w-full object-cover rounded' alt='Place' />
      <div>
         <h2 className='font-bold text-lg'>{place.placeName}</h2>
         <p className='text-sm text-gray-400'>{place.placeDetails}</p>
            <p className='text-sm text-gray-400'>🕙 {place.timeToTravel}</p>
      <Button>
      <FaLocationArrow />
      </Button>
      </div>
    </div>
    </Link>  )
}

export default PlaceCardItems
