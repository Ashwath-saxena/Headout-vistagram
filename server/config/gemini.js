// server/config/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });

export const generateSeedData = async () => {
  const prompt = `
  Generate 20 realistic social media posts for a travel/POI sharing app called Vistagram. 
  Return a JSON array where each object has:
  - username: creative, varied usernames
  - caption: engaging captions about visiting places/points of interest
  - location: specific place names (cities, landmarks, restaurants)
  
  Make it diverse - include different types of POIs: landmarks, restaurants, parks, museums, beaches, etc.
  Keep captions authentic and varied in length (10-100 words).
  
  Return only valid JSON, no markdown formatting.
  `;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse the JSON response
    const cleanedText = text.replace(/``````/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error generating seed data:', error);
    throw error;
  }
};
