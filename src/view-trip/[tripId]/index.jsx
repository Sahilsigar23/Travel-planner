import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from './components/InfoSection';
import Hotels from './components/Hotels';
import PlacesToVisit from './components/PlacesToVisit';
import Footer from './components/Footer';
import MovingBackground from '@/components/custom/MovingBackground';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No such document!");
      toast.error("No trip found!");
    }
  };

  return (
    <div className='relative min-h-screen'>
      <MovingBackground />
      <div className='relative z-10 mx-auto max-w-6xl px-5 py-10 md:px-10'>
        {/* Information section */}
        <InfoSection trip={trip} />

        {/* Recommended Hotels */}
        <Hotels trip={trip} />

        {/* Daily plans */}
        <PlacesToVisit trip={trip} />

        {/* Footer */}
        <Footer trip={trip} />
      </div>
    </div>
  );
}

export default Viewtrip;
