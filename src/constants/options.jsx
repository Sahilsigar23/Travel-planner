import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };

export const SelectTravelesList = [
  {
    id: 1,
    title: "Just Me",
    desc: "Traveling solo",
    icon: ":)",
    people: "1",
  },
  {
    id: 2,
    title: "Couple",
    desc: "Traveling with a partner",
    icon: "❤️",
    people: "2",
  },
  {
    id: 3,
    title: "Family",
    desc: "Traveling with family",
    icon: "👨‍👩‍👧‍👦",
    people: "3+",
  },
  {
    id: 4,
    title: "Friends",
    desc: "Traveling with friends",
    icon: "🎉",
    people: "2-5",
  },
  {
    id: 5,
    title: "Group Tour",
    desc: "Traveling with a larger group",
    icon: "🚌",
    people: "6+",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of costs",
    icon: "💰",
  },
  {
    id: 2,
    title: "Standard",
    desc: "Balance comfort and cost",
    icon: "👌",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Premium experience with top-tier amenities",
    icon: "✨",
  },
  {
    id: 4,
    title: "All-Inclusive",
    desc: "Everything covered for a stress-free trip",
    icon: "🏖️",
  },
  {
    id: 5,
    title: "Backpacker",
    desc: "Minimalist and adventurous travel",
    icon: "🎒",
  },
];

export const AI_PROMPT =
  "Generate Travel Plan for Location: {location} ,for {totalDays} Days for {traveler} with a {budget} Budget ,Give me a hotels options list with HotelName ,Hotel address ,Price ,Hotel image url , geocoordinates ,rating , descriptions and suggest itinerary with placename ,Place Details ,Place Image Url ,Geo Coordinates ,tickets Pricing ,rating ,Time Travel each of the location for {totaldays} days with each day plan best time to visit in JSON format";
