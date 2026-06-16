import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
if (!apiKey) throw new Error("API key missing");

const genAI = new GoogleGenerativeAI(apiKey);

// Force the model to return well-structured JSON so the UI can rely on a stable
// shape (hotels[] + itinerary[]). This fixes the previously inconsistent output.
const geoSchema = {
  type: SchemaType.OBJECT,
  properties: {
    latitude: { type: SchemaType.NUMBER },
    longitude: { type: SchemaType.NUMBER },
  },
};

const TRIP_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    hotels: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          hotelName: { type: SchemaType.STRING },
          hotelAddress: { type: SchemaType.STRING },
          price: { type: SchemaType.STRING },
          rating: { type: SchemaType.NUMBER },
          description: { type: SchemaType.STRING },
          geoCoordinates: geoSchema,
        },
        required: ["hotelName", "hotelAddress", "price", "rating", "description"],
      },
    },
    itinerary: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          day: { type: SchemaType.NUMBER },
          theme: { type: SchemaType.STRING },
          plan: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                placeName: { type: SchemaType.STRING },
                placeDetails: { type: SchemaType.STRING },
                ticketPricing: { type: SchemaType.STRING },
                rating: { type: SchemaType.NUMBER },
                timeToSpend: { type: SchemaType.STRING },
                bestTimeToVisit: { type: SchemaType.STRING },
                geoCoordinates: geoSchema,
              },
              required: [
                "placeName",
                "placeDetails",
                "ticketPricing",
                "timeToSpend",
                "bestTimeToVisit",
              ],
            },
          },
        },
        required: ["day", "theme", "plan"],
      },
    },
  },
  required: ["hotels", "itinerary"],
};

const GENERATION_CONFIG = {
  responseMimeType: "application/json",
  responseSchema: TRIP_SCHEMA,
  temperature: 1,
};

// Tried in order. If one model is overloaded (503) or rate-limited (429),
// we retry it a few times, then fall back to the next one.
const MODEL_FALLBACKS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-flash-latest",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 503 (overloaded / high demand) and 429 (rate limit) are transient — worth retrying.
const isTransient = (err) => {
  const status = err?.status ?? err?.response?.status;
  const msg = (err?.message || "").toLowerCase();
  return (
    status === 503 ||
    status === 429 ||
    msg.includes("503") ||
    msg.includes("429") ||
    msg.includes("overloaded") ||
    msg.includes("high demand") ||
    msg.includes("unavailable") ||
    msg.includes("rate limit") ||
    msg.includes("try again")
  );
};

const MAX_ATTEMPTS_PER_MODEL = 3;

async function generateWithRetry(message) {
  let lastError;

  for (const modelName of MODEL_FALLBACKS) {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: GENERATION_CONFIG,
    });

    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
      try {
        const result = await model.generateContent(message);
        if (modelName !== MODEL_FALLBACKS[0]) {
          console.log(`✅ Generated using fallback model: ${modelName}`);
        }
        return result; // shape: { response } — caller uses result.response.text()
      } catch (error) {
        lastError = error;

        // Non-transient errors (bad key, invalid request, etc.) — fail fast.
        if (!isTransient(error)) throw error;

        if (attempt < MAX_ATTEMPTS_PER_MODEL) {
          // Exponential backoff with jitter: ~1s, ~2s, ~4s
          const delay = 1000 * 2 ** (attempt - 1) + Math.floor(Math.random() * 500);
          console.warn(
            `⚠️ ${modelName} busy (attempt ${attempt}/${MAX_ATTEMPTS_PER_MODEL}). Retrying in ${delay}ms…`
          );
          await sleep(delay);
        } else {
          console.warn(`↪️ ${modelName} still busy — falling back to next model…`);
        }
      }
    }
  }

  // All models exhausted.
  throw lastError;
}

export const testConnection = async () => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const modelsData = await response.json();
    if (response.ok && modelsData.models) {
      console.log("✅ Available models:", modelsData.models.map((m) => m.name));
      return "API OK";
    }
    throw new Error(
      `API key invalid or expired. Response: ${response.status} ${
        modelsData.error?.message || "Unknown error"
      }`
    );
  } catch (error) {
    console.error("❌ Connection test failed:", error);
    throw error;
  }
};

export const chatSession = {
  // Kept the same interface the rest of the app relies on:
  // `const result = await chatSession.sendMessage(prompt); result.response.text()`
  sendMessage: (message) => generateWithRetry(message),
};
