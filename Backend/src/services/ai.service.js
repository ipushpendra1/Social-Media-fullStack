import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";


const ai = new GoogleGenAI({
    apiKey: config.GEMINI_API_KEY
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "tell about narendra modi",
  });
  console.log(response.text);
}

main(); 
  
