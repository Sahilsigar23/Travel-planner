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
  "Generate a detailed travel plan as JSON for the destination: {location}, lasting {totalDays} days, for {traveler}, with a {budget} budget. " +
  'Return an object with exactly two keys: "hotels" and "itinerary". ' +
  '"hotels": an array of 4 to 5 real, well-known hotel options suited to the budget. Each hotel must include: hotelName, hotelAddress, price (a nightly price range with currency, e.g. "$80-120 / night"), rating (a number from 1 to 5), description (1-2 sentences), and geoCoordinates (an object with latitude and longitude numbers). ' +
  '"itinerary": an array containing exactly one entry per day for all {totalDays} days. Each entry must include: day (a number, e.g. 1), theme (a short title for the day, e.g. "Historic City Centre"), and plan (an array of 3 to 4 places to visit that day). ' +
  "Each place in plan must include: placeName (a real, well-known attraction so it can be matched to a photo), placeDetails (a 2-3 sentence description of what it is and why it is worth visiting), ticketPricing (entry cost with currency, or \"Free\"), rating (a number from 1 to 5), timeToSpend (e.g. \"2-3 hours\"), bestTimeToVisit (e.g. \"Morning\"), and geoCoordinates (an object with latitude and longitude numbers). " +
  "Use only real, accurate place names. Respond with valid JSON only, no extra commentary.";
