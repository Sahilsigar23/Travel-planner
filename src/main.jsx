import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Header from './components/custom/Header';
import { Toaster } from './components/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { lazy, Suspense } from 'react';

// Lazy load route components to reduce initial bundle and memory
const CreateTrip = lazy(() => import('./create-trip/index.jsx'));
const Viewtrip = lazy(() => import('./view-trip/[tripId]'));
const MyTrips = lazy(() => import('./my-trips'));


const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/create-trip',
    element: (
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <CreateTrip />
      </Suspense>
    )
  },
  {
    path: '/view-trip/:tripId',
    element: (
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <Viewtrip />
      </Suspense>
    )
  }, 
  {
    path: '/my-trips',
    element: (
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <MyTrips/>
      </Suspense>
    )
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header/>
      <Toaster/>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);