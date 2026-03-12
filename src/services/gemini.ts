import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

// The API key is defined in vite.config.ts via process.env.GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || "";

const checkApiKey = () => {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please set GEMINI_API_KEY in your environment.");
  }
};

export const explainTerm = async (term: string) => {
  checkApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain the stock market term "${term}" for a complete beginner in the context of the Indian Stock Market (NSE/BSE). Use simple analogies, keep it concise, and use Indian Rupees (₹) for any monetary examples.`,
  });
  return response.text;
};

export const generateQuiz = async (topic: string = "general stock market"): Promise<QuizQuestion[]> => {
  checkApiKey();
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
  checkApiKey();
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

export const getRecommendations = async (balance: number, portfolio: any[]) => {
  checkApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on a user with a virtual balance of ₹${balance.toLocaleString()} and a current portfolio of ${JSON.stringify(portfolio)}, suggest 3 specific Indian stocks (NSE/BSE) they should look into and 2 learning topics they should master next. Provide a brief reason for each. Return as a JSON object with "stocks" (array of {name, symbol, reason}) and "topics" (array of {title, reason}).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          stocks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                symbol: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
              required: ["name", "symbol", "reason"],
            },
          },
          topics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
              required: ["title", "reason"],
            },
          },
        },
        required: ["stocks", "topics"],
      },
    },
  });
  return JSON.parse(response.text);
};

export const analyzePortfolio = async (portfolio: any[], balance: number) => {
  checkApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this stock portfolio: ${JSON.stringify(portfolio)} with a remaining cash balance of ₹${balance.toLocaleString()}. Provide a professional analysis of the diversification, risk level, and potential improvements. Use a friendly but expert tone. Use Markdown for formatting.`,
  });
  return response.text;
};

export const predictStockPrice = async (symbol: string, history: any[]) => {
  checkApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Predict the next 5 intervals for the stock ${symbol} based on this recent price history: ${JSON.stringify(history.slice(-10))}. Provide a technical analysis of the trend (Bullish/Bearish/Neutral) and the predicted prices. Return as a JSON object with "trend" (string), "reasoning" (string), and "predictions" (array of numbers).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trend: { type: Type.STRING },
          reasoning: { type: Type.STRING },
          predictions: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        },
        required: ["trend", "reasoning", "predictions"],
      },
    },
  });
  return JSON.parse(response.text);
};

export const analyzeSentiment = async (news: string[]) => {
  checkApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the sentiment of these financial news headlines: ${JSON.stringify(news)}. For each headline, determine if it's Positive, Negative, or Neutral. Also provide an overall market sentiment score from 0 (Extremely Bearish) to 100 (Extremely Bullish). Return as a JSON object with "headlines" (array of {text, sentiment}) and "overallScore" (number).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headlines: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                sentiment: { type: Type.STRING },
              },
              required: ["text", "sentiment"],
            },
          },
          overallScore: { type: Type.NUMBER },
        },
        required: ["headlines", "overallScore"],
      },
    },
  });
  return JSON.parse(response.text);
};

export const calculatePortfolioRisk = async (portfolio: any[]) => {
  checkApiKey();
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Calculate the risk metrics for this stock portfolio: ${JSON.stringify(portfolio)}. Estimate the Beta, Volatility (Standard Deviation), and Value at Risk (VaR) based on general market knowledge of these symbols. Provide a summary of the risk profile. Return as a JSON object with "beta" (number), "volatility" (string), "var" (string), and "summary" (string).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          beta: { type: Type.NUMBER },
          volatility: { type: Type.STRING },
          var: { type: Type.STRING },
          summary: { type: Type.STRING },
        },
        required: ["beta", "volatility", "var", "summary"],
      },
    },
  });
  return JSON.parse(response.text);
};
