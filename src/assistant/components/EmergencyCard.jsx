import React, { useState } from "react";
import { EMERGENCY_CONTACTS, EMERGENCY_COUNTRIES } from "@/constants/emergency";

const ROWS = [
  ["general", "🆘", "General Emergency"],
  ["police", "👮", "Police"],
  ["ambulance", "🚑", "Ambulance"],
  ["fire", "🚒", "Fire"],
  ["tourist", "🧳", "Tourist Helpline"],
];

function EmergencyCard() {
  const [country, setCountry] = useState("India");
  const data = EMERGENCY_CONTACTS[country];

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="mb-1 flex items-center gap-2 text-xl font-bold text-white">
        🆘 Emergency Contacts
      </h3>
      <p className="mb-4 text-sm text-white/60">
        Official emergency numbers by country.
      </p>

      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="input-dark w-full rounded-md px-3 py-2 text-sm text-white [&>option]:bg-slate-800"
      >
        {EMERGENCY_COUNTRIES.map((c) => (
          <option key={c} value={c}>
            {EMERGENCY_CONTACTS[c].flag} {c}
          </option>
        ))}
      </select>

      <div className="mt-4 space-y-2">
        {ROWS.map(([key, icon, label]) =>
          data?.[key] && data[key] !== "—" ? (
            <div
              key={key}
              className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
            >
              <span className="flex items-center gap-2 text-sm text-white/80">
                <span className="text-lg">{icon}</span> {label}
              </span>
              <a
                href={`tel:${String(data[key]).split(" ")[0]}`}
                className="text-lg font-bold text-orange-400 hover:text-orange-300"
              >
                {data[key]}
              </a>
            </div>
          ) : null
        )}
      </div>

      <p className="mt-4 text-xs text-white/40">
        ℹ️ 112 works as a universal emergency number across the EU and many GSM
        networks worldwide. Always confirm local numbers on arrival.
      </p>
    </div>
  );
}

export default EmergencyCard;
