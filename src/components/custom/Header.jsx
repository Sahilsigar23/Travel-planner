
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
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
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      <img src="/logo.svg" alt="logo" />
      <div>
        {userProfile ? (
          <div className="flex items-center gap-4">
            <a href="/create-trip">
            <Button variant="outline" className="rounded-full">
              Create Trip
            </Button>
            </a>
           <a href="/my-trips">
            <Button variant="outline" className="rounded-full">
              My Trips
            </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img src={userProfile?.picture} className="h-[35px] w-[35px] rounded-full" alt="User" />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className="cursor-pointer" onClick={handleLogout}>
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign in</Button>
        )}
      </div>
      <Dialog open={openDialog} onOpenChange={(isOpen) => setOpenDialog(isOpen)}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="Logo" />
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p>Sign in to the app with Google authentication</p>
              <Button onClick={login} className="w-full mt-5">
                <FcGoogle className="mr-2" />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
