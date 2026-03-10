import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

// The API key is defined in vite.config.ts via process.env.GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || "";

export const explainTerm = async (term: string) => {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain the stock market term "${term}" for a complete beginner in the context of the Indian Stock Market (NSE/BSE). Use simple analogies, keep it concise, and use Indian Rupees (₹) for any monetary examples.`,
  });
  return response.text;
};

export const generateQuiz = async (topic: string = "general stock market"): Promise<QuizQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 multiple-choice questions about ${topic} for beginners, specifically focused on the Indian Stock Market. Return as a JSON array. Use Indian Rupees (₹) for any monetary values in questions or explanations.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "correctAnswer", "explanation"],
        },
      },
    },
  });
  
  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text);
};

export const getChatResponse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const ai = new GoogleGenAI({ apiKey });
  const activeChat = ai.chats.create({
    model: "gemini-3-flash-preview",
    history: history.slice(0, -1), // All but the last one
    config: {
      systemInstruction: "You are a friendly and expert stock market tutor for beginners, specializing in the Indian Stock Market (NSE/BSE). Explain complex concepts simply. Never give financial advice, always include a disclaimer that this is for educational purposes. Always use Indian Rupees (₹) when referring to money or prices.",
    }
  });

  const lastMessage = history[history.length - 1].parts[0].text;
  const response = await activeChat.sendMessage({ message: lastMessage });
  return response.text;
};
