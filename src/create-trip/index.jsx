import React, { useState, useEffect } from "react";
import GoMapAutocomplete from "./autocomplete"; 
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"; 
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';

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

  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      console.log("codeResp", codeResp); 
      localStorage.setItem("user", JSON.stringify(codeResp)); 
      toast.success("Login successful!");
      setOpenDailog(false); // Close the login dialog
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Login failed, please try again.");
    }
  });

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo.access_token}`,
        Accept: "application/json",
      }
    })
    .then((response) => {
      console.log("response", response);
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
    });
  };

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");

    // If user is not logged in, show the login dialog
    if (!user) {
      console.log("User not logged in, opening dialog...");
      setOpenDailog(true); // Open the dialog for login
      return;
    }

    // Validate form data
    if (!formData?.Destination || !formData?.days || !formData?.budget || !formData?.travelers) {
      console.log("Please fill all fields");
      toast("Please fill all the fields");
      return;
    }

    // Prepare the AI prompt
    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", formData.Destination)
      .replace("{totalDays}", formData.days)
      .replace("{traveler}", formData.travelers)
      .replace("{budget}", formData.budget)
      .replace("{totaldays}", formData.days);

    console.log("FINAL_PROMPT", FINAL_PROMPT);

    // Send the message for trip generation
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log("result", result?.response?.text());
    toast("Trip generated successfully!");
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
            setDays(e.target.value);
            handleInputChange("days", e.target.value);
          }}
        />
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
        <Button onClick={onGenerateTrip}>Generate Trip</Button>
      </div>

      {/* Auth Dialog */}
      <Dialog open={openDailog} onOpenChange={(isOpen) => setOpenDailog(isOpen)}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" />
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p>Sign in to the app with Google authentication</p>
              <Button onClick={login} className="w-full mt-5">
                <FcGoogle />
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
