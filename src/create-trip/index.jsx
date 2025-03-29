import React, { useState, useEffect } from "react";

import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from "@/constants/options";
import { chatSession } from "@/service/AIModal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Button } from "@/components/ui/button";
import GoMapAutocomplete from "./autocomplete";
import { Input } from "@/components/ui/input";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";




function CreateTrip() {
  const [selectedDestination, setSelectedDestination] = useState("");
  const [days, setDays] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [formData, setFormData] = useState({
    Destination: "",
    days: "",
    budget: "",
    travelers: "",
  });

  const [openDailog, setOpenDailog] = useState(false); // Dialog visibility state

  const [loading, setLoading] = useState(false); // Loading state
  const navigate=useNavigate();


  // Handle input changes and update formData
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update formData when selectedDestination changes
  useEffect(() => {
    if (selectedDestination) {
      handleInputChange("Destination", selectedDestination);
    }
  }, [selectedDestination]);


  // Google Login
  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      console.log("codeResp", codeResp);
      localStorage.setItem("user", JSON.stringify(codeResp));
      toast.success("Login successful!");
      setOpenDailog(false); // Close the login dialog
      GetUserProfile(codeResp); // Fetch user profile

    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Login failed, please try again.");

    },
  });

  // Fetch user profile using access token
  const GetUserProfile = (tokenInfo) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo.access_token}`,
          Accept: "application/json",
        },
      })
      .then((response) => {
        console.log("User Profile:", response.data);
        localStorage.setItem("userProfile", JSON.stringify(response.data)); // Store user profile
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  const SaveAiTrip = async (tripData) => {
    setLoading(true);
    const docId = Date.now().toString(); // Define docId outside the try block
    try {
      // Add a new document in collection "AITrips"
      const userProfile = JSON.parse(localStorage.getItem('userProfile'));
      console.log("User Profile:", userProfile); // Debugging log
      if (!userProfile || !userProfile.email) {
        toast.error("User information is missing. Please log in again.");
        setLoading(false);
        return;
      }
      await setDoc(doc(db, "AITrips", docId), {
        userSelction: formData,
        tripData: JSON.parse(tripData),
        userEmail: userProfile.email,
        id: docId
      });
      toast.success("Trip saved successfully!");
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip. Please try again.");
    } finally {
      setLoading(false);
      navigate(`/view-trip/${docId}`); // Navigate to view trip page
    }
  };

  // Generate Trip
  const onGenerateTrip = async () => {
    const user = localStorage.getItem("userProfile");
  
    if (!user) {
      setOpenDailog(true);
      toast.error("You need to sign in first!");
      return;
    }
  
    if (!formData.Destination || !formData.days || !formData.budget || !formData.travelers) {
      toast.error("Please fill all fields before generating the trip.");
      return;
    }
  
    if (isNaN(formData.days) || formData.days <= 0) {
      toast.error("Please enter a valid number of days.");
      return;
    }
  
    setLoading(true);
  
    try {
      const FINAL_PROMPT = AI_PROMPT
        .replace("{location}", formData.Destination)
        .replace("{totalDays}", formData.days)
        .replace("{traveler}", formData.travelers)
        .replace("{budget}", formData.budget)
        .replace("{totaldays}", formData.days);
  
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const aiResponse = await result?.response?.text();
  
      if (!aiResponse) {
        throw new Error("AI response is empty");
      }
  
      toast.success("Trip generated successfully!");
      await SaveAiTrip(aiResponse);
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className="sm:px-10 md:px-32 lg:px-64 xl:px-80 px-6 mt-10">
      <h2 className="font-bold text-3xl">Tell us your preferences.</h2>
      <p className="mt-3 text-gray-500 text-xl">Plan your perfect getaway with ease and precision.</p>
      <p className="mt-3 text-gray-500 text-xl">Just provide basic information.</p>

      {/* Destination Selection */}
      <div className="mt-20 flex flex-col">
        <h2 className="text-xl my-3 font-medium">What is your destination of choice?</h2>
        <GoMapAutocomplete onSelect={setSelectedDestination} />
        {selectedDestination && (
          <p className="mt-3 text-green-600">Selected Destination: {selectedDestination}</p>
        )}
      </div>

      {/* Trip Duration Input */}
      <div className="mt-10">
  <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
  <Input
    placeholder="Enter number of days"
    type="number"
    value={days}
    onChange={(e) => {
      const value = e.target.value;

      // Allow only positive integers and limit the range (e.g., 1–365 days)
      if (/^\d*$/.test(value) && (value === "" || (parseInt(value) > 0 && parseInt(value) <= 365))) {
        setDays(value);
        handleInputChange("days", value);
      } else {
        toast.error("Please enter a valid number of days (1–365).");
      }
    }}
    onBlur={() => {
      // Ensure the input is not empty or invalid on blur
      if (!days || parseInt(days) <= 0) {
        toast.error("Please enter a valid number of days.");
        setDays(""); // Reset the input
        handleInputChange("days", "");
      }
    }}
  />
  {days && parseInt(days) > 365 && (
    <p className="text-red-500 mt-2">The maximum allowed number of days is 365.</p>
  )}
</div>

      {/* Budget Selection */}
      <div className="mt-10 cursor-pointer">
        <h2 className="text-xl my-3 font-medium">What is your budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-lg hover:shadow-lg ${
                selectedBudget === item.id ? "border-blue-500 bg-blue-100" : ""
              }`}
              onClick={() => {
                setSelectedBudget(item.id);
                handleInputChange("budget", item.title);
              }}
            >
              <h2 className="text-2xl">{item.icon}</h2>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Travelers Selection */}
      <div className="mt-10 cursor-pointer">
        <h2 className="text-xl my-3 font-medium">Who do you plan on traveling with?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-lg hover:shadow-lg ${
                selectedTraveler === item.id ? "border-blue-500 bg-blue-100" : ""
              }`}
              onClick={() => {
                setSelectedTraveler(item.id);
                handleInputChange("travelers", item.title);
              }}
            >
              <h2 className="text-2xl">{item.icon}</h2>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="my-10 justify-end flex">

        <Button disabled={loading} onClick={onGenerateTrip}>
          {loading ? 
          <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin"  />:
          'Generate Trip'
  } 
        </Button>

      </div>

      {/* Auth Dialog */}
      <Dialog open={openDailog} onOpenChange={(isOpen) => setOpenDailog(isOpen)}>
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

export default CreateTrip;

