
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { FaPlaneDeparture, FaPlus } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";


function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (storedProfile) {
      setUserProfile(storedProfile);
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      try {
        console.log("Google Login Success:", tokenInfo);
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        });

        const userData = response.data;
        console.log("User Profile:", userData);

        // Store user profile in localStorage
        localStorage.setItem("userProfile", JSON.stringify(userData));
        setUserProfile(userData);
        toast.success("Login successful!");
        setOpenDialog(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to fetch profile, please try again.");
      }
    },
    onError: (error) => {
      console.log("Login Error:", error);
      toast.error("Login failed, please try again.");
    },
  });

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("userProfile"); // Only remove user profile, not everything
    setUserProfile(null);
    toast.success("Logged out successfully!");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/50 shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        {/* Logo */}
        <a href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30 transition-transform group-hover:scale-105">
            <FaPlaneDeparture className="text-base" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Travel<span className="text-orange-400">Planner</span>
          </span>
        </a>

        {/* Actions */}
        <div>
          {userProfile ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <a href="/create-trip">
                <Button className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-4 shadow-sm hover:from-orange-600 hover:to-orange-700">
                  <FaPlus className="mr-1.5 text-xs" /> Create Trip
                </Button>
              </a>
              <a href="/my-trips" className="hidden sm:block">
                <Button variant="ghost" className="rounded-full font-medium text-white/90 hover:bg-white/10 hover:text-white">
                  My Trips
                </Button>
              </a>
              <Popover>
                <PopoverTrigger className="outline-none">
                  <img src={userProfile?.picture} className="h-9 w-9 cursor-pointer rounded-full ring-2 ring-orange-200 transition-all hover:ring-orange-400" alt="User" />
                </PopoverTrigger>
                <PopoverContent className="w-52 p-2">
                  <div className="flex items-center gap-3 border-b border-white/10 px-1 pb-3">
                    <img src={userProfile?.picture} className="h-9 w-9 rounded-full" alt="User" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">{userProfile?.name}</div>
                      <div className="truncate text-xs text-white/50">{userProfile?.email}</div>
                    </div>
                  </div>
                  <a href="/my-trips" className="mt-1 block rounded-lg px-2 py-1.5 text-sm text-white/90 transition-colors hover:bg-white/10 sm:hidden">
                    My Trips
                  </a>
                  <button onClick={handleLogout} className="mt-0.5 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/15">
                    <FiLogOut /> Logout
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button onClick={() => setOpenDialog(true)} className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 shadow-sm hover:from-orange-600 hover:to-orange-700">
              Sign in
            </Button>
          )}
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={(isOpen) => setOpenDialog(isOpen)}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <div className="flex flex-col items-center text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30">
                  <FaPlaneDeparture className="text-xl" />
                </span>
                <h2 className="text-xl font-bold text-white">Welcome to TravelPlanner</h2>
                <p className="mt-1.5 text-sm text-white/70">Sign in with Google to save and view your AI-generated trips.</p>
                <Button onClick={login} className="mt-6 w-full rounded-full bg-white py-6 text-base font-medium text-gray-800 hover:bg-gray-100">
                  <FcGoogle className="mr-2 text-xl" />
                  Continue with Google
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default Header;
