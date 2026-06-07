import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import MovingBackground from '@/components/custom/MovingBackground';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    // Retrieve user profile from localStorage
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    console.log("Retrieved userProfile from localStorage:", userProfile); // Debugging log

    if (!userProfile || !userProfile.email) {
      console.error("User profile not found or email is missing");
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      // Query Firestore for trips associated with the user's email
      const q = query(collection(db, 'AITrips'), where('userEmail', '==', userProfile.email));
      const querySnapshot = await getDocs(q);
      const trips = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        trips.push(doc.data());
      });
      setUserTrips(trips);
    } catch (error) {
      console.error("Error fetching user trips:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative min-h-screen'>
    <MovingBackground />
    <div className='relative z-10 mx-auto max-w-7xl px-5 sm:px-10 md:px-16 lg:px-24 py-16'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white">
            🧳 Your travel history
          </span>
          <h2 className='mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-white'>My <span className="text-gradient">Trips</span></h2>
          <p className='mt-3 text-white/80'>
            {loading ? 'Loading your adventures…' : `You have ${userTrips.length} saved ${userTrips.length === 1 ? 'trip' : 'trips'}.`}
          </p>
        </div>
        <Link to='/create-trip'>
          <Button className='rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 shadow-sm hover:from-orange-600 hover:to-orange-700'>
            <FaPlus className='mr-2 text-xs' /> Plan a new trip
          </Button>
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className='mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className='h-[300px] w-full animate-pulse rounded-2xl bg-white/10 backdrop-blur-sm' />
          ))}
        </div>
      ) : userTrips.length > 0 ? (
        <div className='mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {userTrips.map((trip, index) => (
            <UserTripCardItem trip={trip} key={index} />
          ))}
        </div>
      ) : (
        <div className='glass mt-16 flex flex-col items-center justify-center rounded-3xl border-white/20 px-6 py-20 text-center'>
          <div className='text-6xl'>🗺️</div>
          <h3 className='mt-5 text-xl font-semibold text-white'>No trips yet</h3>
          <p className='mt-2 max-w-sm text-white/70'>Start planning your first AI-powered adventure — it only takes a minute.</p>
          <Link to='/create-trip'>
            <Button className='mt-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-8 shadow-sm hover:from-orange-600 hover:to-orange-700'>
              <FaPlus className='mr-2 text-xs' /> Create your first trip
            </Button>
          </Link>
        </div>
      )}
    </div>
    </div>
  );
}

export default MyTrips;