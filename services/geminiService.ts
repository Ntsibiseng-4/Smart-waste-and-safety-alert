
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    // Clean base64 string if it contains the data URL prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: cleanBase64
                }
            },
            {
                text: `Analyze this surveillance frame for a Smart Waste Security System.
                CRITICAL TASK: Detect if a person is CURRENTLY in the act of dumping waste illegally.
                
                1. Look for a human subject throwing trash, bags, or debris onto the ground or an overflowing area.
                2. Illegal Dumping is DIFFERENT from a full bin. It requires an ACTOR (Person).
                3. Estimate waste level (0-100).
                4. Identify other hazards (fire, blocked road).
                5. Provide a safety score.
                `
            }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wasteLevel: { type: Type.NUMBER, description: "0 to 100 representing how full trash bins or dumping areas are." },
            isDumpingDetected: { type: Type.BOOLEAN, description: "Set to TRUE only if a person is visible in the act of dumping waste." },
            hazards: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "List of detected hazards e.g., 'Illegal Dumping In Progress', 'Fire', 'Blocked Road', 'None'" 
            },
            safetyScore: { type: Type.NUMBER, description: "0 to 100 representing safety of the scene." },
            description: { type: Type.STRING, description: "A concise summary of the scene. Mention if a person was caught dumping." }
          },
          required: ["wasteLevel", "isDumpingDetected", "hazards", "safetyScore", "description"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        ...data,
        timestamp: new Date().toLocaleTimeString()
      };
    }
    
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback for demo purposes
    return {
      wasteLevel: 0,
      isDumpingDetected: false,
      hazards: ["Analysis Error"],
      safetyScore: 50,
      description: "Could not analyze image. Please try again.",
      timestamp: new Date().toLocaleTimeString()
    };
  }
};
