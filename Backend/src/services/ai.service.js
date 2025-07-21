import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";


const ai = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY
});

export async function generateCaption(file) {
  const base64Image = new Buffer.from(file.buffer).toString('base64');
  const contents = [
    {
      inlineData: {
        mimeType: file.mimeType,
        data: base64Image,
      },
    },
    { text: "Caption this image." }
  ]
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: contents,
  });

  return response.text

}


