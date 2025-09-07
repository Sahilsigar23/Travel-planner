// Lazy initializer for Google Generative AI chat session
// This avoids pulling the heavy SDK into the initial bundle

export async function getChatSession() {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
  };
  return model.startChat({ generationConfig, history: [] });
}


