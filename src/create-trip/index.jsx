import React, { useState, useEffect } from "react";

import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from "@/constants/options";
import { chatSession, testConnection } from "@/service/AIModal";
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
import MovingBackground from "@/components/custom/MovingBackground";




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
      localStorage.setItem("user", JSON.stringify(codeResp));
      toast.success("Login successful!");
      setOpenDailog(false); // Close the login dialog
      GetUserProfile(codeResp); // Fetch user profile

    },
    onError: (error) => {
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
        localStorage.setItem("userProfile", JSON.stringify(response.data)); // Store user profile
      })
      .catch((error) => {
        // Handle error silently
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
    console.log("User Profile from LocalStorage:", user);
  
    if (!user) {
      setOpenDailog(true);
      toast.error("You need to sign in first!");
      return;
    }
  
    console.log("Form Data:", formData);
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
        .replaceAll("{location}", formData.Destination)
        .replaceAll("{totalDays}", String(formData.days))
        .replaceAll("{totaldays}", String(formData.days))
        .replaceAll("{traveler}", formData.travelers)
        .replaceAll("{budget}", formData.budget);
  
      console.log("FINAL_PROMPT:", FINAL_PROMPT);
  
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log("AI Response Result:", result);
  
      let aiResponse = await result?.response?.text();
      console.log("AI Response:", aiResponse);

      if (!aiResponse) {
        throw new Error("AI response is empty");
      }

      // Clean the response by removing markdown code blocks
      aiResponse = aiResponse.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      console.log("Cleaned AI Response:", aiResponse);

      toast.success("Trip generated successfully!");
      await SaveAiTrip(aiResponse);
    } catch (error) {
      console.error("Error generating trip:", error);
      
      // Handle specific error types
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("503") || msg.includes("overloaded") || msg.includes("high demand") || msg.includes("unavailable")) {
        toast.error("🚦 The AI servers are busy right now. We retried a few times — please try again in a moment.");
      } else if (error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("Too Many Requests")) {
        toast.error("⚠️ API quota exceeded! Please try again in a few minutes, or check your Gemini AI quota limits.");
      } else if (error.message?.includes("401") || error.message?.includes("unauthorized")) {
        toast.error("❌ Invalid API key. Please check your Gemini AI configuration.");
      } else if (error.message?.includes("403") || error.message?.includes("forbidden")) {
        toast.error("🚫 API access denied. Please verify your Gemini AI permissions.");
      } else if (!navigator.onLine) {
        toast.error("🌐 No internet connection. Please check your network and try again.");
      } else {
        toast.error("❌ Failed to generate trip. Please try again or contact support.");
      }
      
      // Provide helpful suggestions
      setTimeout(() => {
        toast.info("💡 Tip: Check your Google AI Studio quota at https://aistudio.google.com");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen">
    <MovingBackground />
    <div className="relative z-10 sm:px-10 md:px-32 lg:px-64 xl:px-80 px-6 py-16">
      <div className="text-center sm:text-left">
        <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white">
          ✈️ Plan a new trip
        </span>
        <h2 className="font-extrabold text-4xl sm:text-5xl mt-5 tracking-tight text-white">
          Tell us your <span className="text-gradient">preferences</span>
        </h2>
        <p className="mt-4 text-white/80 text-lg max-w-2xl">Plan your perfect getaway with ease and precision — just provide a few basic details and let AI do the rest.</p>
      </div>
      

      {/* Destination Selection */}
      <div className="mt-10 glass-card flex flex-col rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">1</span>
          What is your destination of choice?
        </h2>
        <GoMapAutocomplete onSelect={setSelectedDestination} />
        {selectedDestination && (
          <p className="mt-3 text-green-400">Selected Destination: {selectedDestination}</p>
        )}
      </div>

      {/* Trip Duration Input */}
      <div className="mt-6 glass-card rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">2</span>
          How many days are you planning your trip?
        </h2>
        <Input
  placeholder="Enter number of days"
  type="number"
  min="1" // Prevents entering values less than 1
  value={days}
  onChange={(e) => {
    setDays(e.target.value);
    handleInputChange("days", e.target.value);
  }}
  className="input-dark"
/>
        
      </div>

      {/* Budget Selection */}
      <div className="mt-6 glass-card rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">3</span>
          What is your budget?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {SelectBudgetOptions.map((item) => (
            <div
              key={item.id}
              className={`p-5 border rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-orange-300 ${
                selectedBudget === item.id ? "border-orange-400 bg-orange-500/25 shadow-md" : "border-white/10 hover:bg-white/5"
              }`}
              onClick={() => {
                setSelectedBudget(item.id);
                handleInputChange("budget", item.title);
              }}
            >
              <h2 className="text-2xl">{item.icon}</h2>
              <h2 className="font-semibold text-white">{item.title}</h2>
              <p className="text-white/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Travelers Selection */}
      <div className="mt-6 glass-card rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">4</span>
          Who do you plan on traveling with?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {SelectTravelesList.map((item) => (
            <div
              key={item.id}
              className={`p-5 border rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-orange-300 ${
                selectedTraveler === item.id ? "border-orange-400 bg-orange-500/25 shadow-md" : "border-white/10 hover:bg-white/5"
              }`}
              onClick={() => {
                setSelectedTraveler(item.id);
                handleInputChange("travelers", item.title);
              }}
            >
              <h2 className="text-2xl">{item.icon}</h2>
              <h2 className="font-semibold text-white">{item.title}</h2>
              <p className="text-white/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>


      {/* Submit Button */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <Button disabled={loading} onClick={onGenerateTrip} className="w-full sm:w-auto rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-12 py-6 text-base font-semibold shadow-lg shadow-orange-500/30 transition-transform hover:scale-[1.02] hover:from-orange-600 hover:to-orange-700">
          {loading ?
            <span className="flex items-center gap-2">
              <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin" />
              Crafting your itinerary…
            </span> :
            '✨ Generate Trip'
          }
        </Button>
        <p className="text-sm text-white/60">Powered by AI · Takes about a minute</p>
      </div>

      {/* Auth Dialog */}
      <Dialog open={openDailog} onOpenChange={(isOpen) => setOpenDailog(isOpen)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="sr-only">Sign in to generate your trip</DialogTitle>
            <DialogDescription className="sr-only">
              Sign in with Google so we can save your generated itinerary.
            </DialogDescription>
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 text-xl">
                ✈️
              </span>
              <h2 className="text-xl font-bold text-white">Sign in to generate your trip</h2>
              <p className="mt-1.5 text-sm text-white/70">You need to be signed in so we can save your itinerary.</p>
              <Button onClick={login} className="mt-6 w-full rounded-full bg-white py-6 text-base font-medium text-gray-800 hover:bg-gray-100">
                <FcGoogle className="mr-2 text-xl" />
                Continue with Google
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}

export default CreateTrip;
