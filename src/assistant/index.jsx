import React from "react";
import MovingBackground from "@/components/custom/MovingBackground";
import WeatherCard from "./components/WeatherCard";
import CurrencyCard from "./components/CurrencyCard";
import EmergencyCard from "./components/EmergencyCard";
import TrafficCard from "./components/TrafficCard";

function Assistant() {
  return (
    <div className="relative min-h-screen">
      <MovingBackground />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="text-center sm:text-left">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white">
            ⚡ Real-time travel tools
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Travel <span className="text-gradient">Assistant</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Live weather, currency rates, and emergency info — powered by free,
            real-time data. No fabricated numbers, ever.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          {/* Left column: short-by-default Weather paired with the taller Emergency */}
          <div className="flex flex-col gap-6">
            <WeatherCard />
            <EmergencyCard />
          </div>
          {/* Right column */}
          <div className="flex flex-col gap-6">
            <CurrencyCard />
            <TrafficCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assistant;
