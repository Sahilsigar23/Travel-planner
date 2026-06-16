import axios from "axios";

// ---------------------------------------------------------------------------
// Real-time travel data — free, no API key, no billing.
//   • Open-Meteo            → city geocoding + weather forecast
//   • open.er-api.com       → live currency exchange rates (166 currencies)
// Both support CORS from the browser. Per the assistant spec, we only ever
// return live API data and surface errors instead of fabricating values.
// ---------------------------------------------------------------------------

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Search cities by name. Returns a list so the user can disambiguate
// (e.g. "Goa" matches several places worldwide) — weather is per-city.
export const geocodeCity = async (name) => {
  if (!name || name.trim().length < 2) return [];
  const { data } = await axios.get(GEOCODE_URL, {
    params: { name: name.trim(), count: 6, language: "en", format: "json" },
    timeout: 10000,
  });
  return (data?.results || []).map((r) => ({
    id: r.id,
    name: r.name,
    admin1: r.admin1 || "",
    country: r.country || "",
    countryCode: r.country_code || "",
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
};

// Fetch current conditions + a multi-day forecast for a coordinate.
export const getWeather = async (latitude, longitude) => {
  const { data } = await axios.get(FORECAST_URL, {
    params: {
      latitude,
      longitude,
      current:
        "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,precipitation",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      timezone: "auto",
      forecast_days: 7,
    },
    timeout: 10000,
  });

  const daily = (data?.daily?.time || []).map((date, i) => ({
    date,
    code: data.daily.weather_code[i],
    max: Math.round(data.daily.temperature_2m_max[i]),
    min: Math.round(data.daily.temperature_2m_min[i]),
    precip: data.daily.precipitation_probability_max[i] ?? 0,
  }));

  return {
    current: {
      temp: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      wind: Math.round(data.current.wind_speed_10m),
      code: data.current.weather_code,
    },
    daily,
  };
};

// WMO weather interpretation codes → label + emoji.
export const weatherCodeInfo = (code) => {
  const map = {
    0: ["Clear sky", "☀️"],
    1: ["Mainly clear", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Fog", "🌫️"],
    48: ["Rime fog", "🌫️"],
    51: ["Light drizzle", "🌦️"],
    53: ["Drizzle", "🌦️"],
    55: ["Heavy drizzle", "🌦️"],
    56: ["Freezing drizzle", "🌧️"],
    57: ["Freezing drizzle", "🌧️"],
    61: ["Light rain", "🌧️"],
    63: ["Rain", "🌧️"],
    65: ["Heavy rain", "🌧️"],
    66: ["Freezing rain", "🌧️"],
    67: ["Freezing rain", "🌧️"],
    71: ["Light snow", "🌨️"],
    73: ["Snow", "🌨️"],
    75: ["Heavy snow", "❄️"],
    77: ["Snow grains", "🌨️"],
    80: ["Rain showers", "🌦️"],
    81: ["Rain showers", "🌦️"],
    82: ["Violent rain showers", "⛈️"],
    85: ["Snow showers", "🌨️"],
    86: ["Heavy snow showers", "❄️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with hail", "⛈️"],
    99: ["Thunderstorm with hail", "⛈️"],
  };
  const [label, icon] = map[code] || ["Unknown", "🌡️"];
  return { label, icon };
};

// Practical packing / activity tips derived from the live forecast.
export const weatherAdvice = ({ current, daily }) => {
  const tips = [];
  const maxPrecip = Math.max(...daily.map((d) => d.precip), current.code >= 51 ? 60 : 0);
  const hi = Math.max(...daily.map((d) => d.max));
  const lo = Math.min(...daily.map((d) => d.min));

  if (maxPrecip >= 50) tips.push("☔ Pack an umbrella or rain jacket — showers likely.");
  if (hi >= 32) tips.push("🧴 Hot days ahead — sunscreen, hat, and stay hydrated.");
  if (lo <= 10) tips.push("🧥 Chilly mornings/evenings — bring warm layers.");
  if (current.wind >= 30) tips.push("💨 Windy conditions — secure loose items outdoors.");
  if (hi - lo >= 12) tips.push("👕 Big day-to-night temperature swing — dress in layers.");
  if (!tips.length) tips.push("😎 Pleasant conditions — great for outdoor sightseeing.");
  return tips;
};

// Live exchange rates with the given base currency. Tries two independent
// free, no-key providers so a single source outage doesn't break conversion.
// Both responses are normalized to { rates, updated } and always include the
// base currency itself at rate 1.
export const getRates = async (base = "USD") => {
  // Source 1: ExchangeRate-API open endpoint (160+ currencies).
  try {
    const { data } = await axios.get(`https://open.er-api.com/v6/latest/${base}`, {
      timeout: 9000,
    });
    if (data?.result === "success" && data?.rates) {
      return { rates: { ...data.rates, [base]: 1 }, updated: data.time_last_update_utc };
    }
  } catch {
    /* fall through to the backup source */
  }

  // Source 2: Frankfurter (ECB data, ~30 major currencies).
  const { data } = await axios.get("https://api.frankfurter.app/latest", {
    params: { base },
    timeout: 9000,
  });
  if (!data?.rates) throw new Error("Exchange rate service returned no data");
  return { rates: { ...data.rates, [base]: 1 }, updated: data.date };
};
