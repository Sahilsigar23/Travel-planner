import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
if (!apiKey) throw new Error("API key missing");

const genAI = new GoogleGenerativeAI(apiKey);

// Working model - will be updated dynamically
let workingModel = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash",
});

export const testConnection = async () => {
  try {
    console.log("🔍 Testing API Key:", apiKey.substring(0, 20) + "...");
    
    // First, let's see what models are actually available
    console.log("🔍 Listing available models...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const modelsData = await response.json();
    
    if (response.ok && modelsData.models) {
      console.log("✅ Available models:", modelsData.models.map(m => m.name));
      
      // Try the first available model that supports generateContent
      const bestModel = modelsData.models.find(m => 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent')
      );
      
      if (bestModel) {
        console.log("🎯 Using working model:", bestModel.name);
        const testModel = genAI.getGenerativeModel({ model: bestModel.name });
        const result = await testModel.generateContent("Reply with: API OK");
        const text = await result.response.text();
        console.log("✅ Success:", text);
        
        // Update the global model for chat session
        workingModel = testModel;
        return text;
      } else {
        throw new Error("No models support generateContent");
      }
    } else {
      console.error("❌ Failed to list models:", modelsData);
      throw new Error(`API key invalid or expired. Response: ${response.status} ${modelsData.error?.message || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.error("❌ Connection test failed:", error);
    throw error;
  }
};

let chat = null;

export const chatSession = {
  sendMessage: async (message) => {
    if (!chat) chat = workingModel.startChat();
    return chat.sendMessage(message);
  },
};
