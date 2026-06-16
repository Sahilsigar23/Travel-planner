// Official emergency contact numbers by country (free, static reference data).
// Keys match the country names used elsewhere in the app. Each entry: general
// emergency, police, ambulance, fire, and a tourist helpline where one exists.
export const EMERGENCY_CONTACTS = {
  India: { flag: "🇮🇳", general: "112", police: "100", ambulance: "102 / 108", fire: "101", tourist: "1363" },
  Japan: { flag: "🇯🇵", general: "—", police: "110", ambulance: "119", fire: "119", tourist: "050-3816-2787 (JNTO)" },
  Thailand: { flag: "🇹🇭", general: "191", police: "191", ambulance: "1669", fire: "199", tourist: "1155" },
  Singapore: { flag: "🇸🇬", general: "999", police: "999", ambulance: "995", fire: "995" },
  Malaysia: { flag: "🇲🇾", general: "999", police: "999", ambulance: "999", fire: "994" },
  Indonesia: { flag: "🇮🇩", general: "112", police: "110", ambulance: "118 / 119", fire: "113" },
  "Hong Kong": { flag: "🇭🇰", general: "999", police: "999", ambulance: "999", fire: "999" },
  "South Korea": { flag: "🇰🇷", general: "112", police: "112", ambulance: "119", fire: "119", tourist: "1330" },
  China: { flag: "🇨🇳", general: "—", police: "110", ambulance: "120", fire: "119" },
  Taiwan: { flag: "🇹🇼", general: "—", police: "110", ambulance: "119", fire: "119", tourist: "0800-011-765" },
  Vietnam: { flag: "🇻🇳", general: "—", police: "113", ambulance: "115", fire: "114" },
  Cambodia: { flag: "🇰🇭", general: "—", police: "117", ambulance: "119", fire: "118" },
  Nepal: { flag: "🇳🇵", general: "112", police: "100", ambulance: "102", fire: "101", tourist: "1144" },
  "Sri Lanka": { flag: "🇱🇰", general: "112", police: "119", ambulance: "1990", fire: "110" },
  Maldives: { flag: "🇲🇻", general: "—", police: "119", ambulance: "102", fire: "118" },
  Bhutan: { flag: "🇧🇹", general: "—", police: "113", ambulance: "112", fire: "110" },

  "United Arab Emirates": { flag: "🇦🇪", general: "999", police: "999", ambulance: "998", fire: "997" },
  Qatar: { flag: "🇶🇦", general: "999", police: "999", ambulance: "999", fire: "999" },
  "Saudi Arabia": { flag: "🇸🇦", general: "911", police: "999", ambulance: "997", fire: "998" },
  Oman: { flag: "🇴🇲", general: "9999", police: "9999", ambulance: "9999", fire: "9999" },
  Turkey: { flag: "🇹🇷", general: "112", police: "155", ambulance: "112", fire: "110" },
  Israel: { flag: "🇮🇱", general: "—", police: "100", ambulance: "101", fire: "102" },
  Jordan: { flag: "🇯🇴", general: "911", police: "911", ambulance: "911", fire: "911" },

  France: { flag: "🇫🇷", general: "112", police: "17", ambulance: "15", fire: "18" },
  "United Kingdom": { flag: "🇬🇧", general: "999", police: "999", ambulance: "999", fire: "999" },
  Italy: { flag: "🇮🇹", general: "112", police: "113", ambulance: "118", fire: "115" },
  Spain: { flag: "🇪🇸", general: "112", police: "091", ambulance: "112", fire: "080" },
  Germany: { flag: "🇩🇪", general: "112", police: "110", ambulance: "112", fire: "112" },
  Netherlands: { flag: "🇳🇱", general: "112", police: "112", ambulance: "112", fire: "112" },
  Switzerland: { flag: "🇨🇭", general: "112", police: "117", ambulance: "144", fire: "118" },
  Austria: { flag: "🇦🇹", general: "112", police: "133", ambulance: "144", fire: "122" },
  Greece: { flag: "🇬🇷", general: "112", police: "100", ambulance: "166", fire: "199", tourist: "171" },
  Portugal: { flag: "🇵🇹", general: "112", police: "112", ambulance: "112", fire: "112" },
  Ireland: { flag: "🇮🇪", general: "112", police: "999", ambulance: "999", fire: "999" },
  "Czech Republic": { flag: "🇨🇿", general: "112", police: "158", ambulance: "155", fire: "150" },
  Hungary: { flag: "🇭🇺", general: "112", police: "107", ambulance: "104", fire: "105" },
  Croatia: { flag: "🇭🇷", general: "112", police: "192", ambulance: "194", fire: "193" },
  Iceland: { flag: "🇮🇸", general: "112", police: "112", ambulance: "112", fire: "112" },
  Russia: { flag: "🇷🇺", general: "112", police: "102", ambulance: "103", fire: "101" },

  Egypt: { flag: "🇪🇬", general: "—", police: "122", ambulance: "123", fire: "180", tourist: "126" },
  Morocco: { flag: "🇲🇦", general: "112", police: "19", ambulance: "15", fire: "15" },
  "South Africa": { flag: "🇿🇦", general: "112", police: "10111", ambulance: "10177", fire: "10177" },
  Kenya: { flag: "🇰🇪", general: "999 / 112", police: "999", ambulance: "999", fire: "999" },
  Tanzania: { flag: "🇹🇿", general: "112", police: "112", ambulance: "114", fire: "115" },

  "United States": { flag: "🇺🇸", general: "911", police: "911", ambulance: "911", fire: "911" },
  Canada: { flag: "🇨🇦", general: "911", police: "911", ambulance: "911", fire: "911" },
  Mexico: { flag: "🇲🇽", general: "911", police: "911", ambulance: "911", fire: "911" },
  Brazil: { flag: "🇧🇷", general: "—", police: "190", ambulance: "192", fire: "193" },
  Argentina: { flag: "🇦🇷", general: "911", police: "101", ambulance: "107", fire: "100" },
  Peru: { flag: "🇵🇪", general: "—", police: "105", ambulance: "106", fire: "116", tourist: "574-8000" },
  Chile: { flag: "🇨🇱", general: "—", police: "133", ambulance: "131", fire: "132" },
  Colombia: { flag: "🇨🇴", general: "123", police: "123", ambulance: "123", fire: "123" },
  Cuba: { flag: "🇨🇺", general: "—", police: "106", ambulance: "104", fire: "105" },

  Australia: { flag: "🇦🇺", general: "000", police: "000", ambulance: "000", fire: "000" },
  "New Zealand": { flag: "🇳🇿", general: "111", police: "111", ambulance: "111", fire: "111" },
  Fiji: { flag: "🇫🇯", general: "911", police: "917", ambulance: "911", fire: "910" },
};

// EU + many GSM networks accept 112 as a universal emergency number.
export const DEFAULT_EMERGENCY = {
  flag: "🌐",
  general: "112",
  police: "112",
  ambulance: "112",
  fire: "112",
  note: "112 is the international GSM emergency number and works in the EU and many other countries. Confirm local numbers on arrival.",
};

// Extract the country from a "City, Region, Country" style string and look it up.
export const findEmergencyContacts = (location = "") => {
  const cleaned = location.trim();
  if (!cleaned) return null;
  // Try the last comma-separated segment first (usually the country), then whole.
  const segments = cleaned.split(",").map((s) => s.trim());
  const candidates = [segments[segments.length - 1], cleaned, ...segments];
  for (const c of candidates) {
    if (EMERGENCY_CONTACTS[c]) return { country: c, ...EMERGENCY_CONTACTS[c] };
    // case-insensitive match
    const key = Object.keys(EMERGENCY_CONTACTS).find(
      (k) => k.toLowerCase() === c.toLowerCase()
    );
    if (key) return { country: key, ...EMERGENCY_CONTACTS[key] };
  }
  return null;
};

export const EMERGENCY_COUNTRIES = Object.keys(EMERGENCY_CONTACTS).sort();
