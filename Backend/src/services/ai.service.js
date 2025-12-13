import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";


const ai = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY
});

export async function generateCaption(file) {
  try {
    // Validate API key
    if (!config.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured')
    }

    const base64Image = Buffer.from(file.buffer).toString('base64');
    const contents = [
      {
        inlineData: {
          mimeType: file.mimetype,
          data: base64Image,
        },
      },
      { text: "Caption this image." }
    ]
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
      config: {
        systemInstruction: `
You are an Instagram caption generator. Analyze the content of the image and write one caption.

The caption MUST adhere to these five rules:
1.  **Style:** The text must be simple, clear, and easy to read. Use only common, straightforward words.
2.  **Length:** The final text must be descriptive and slightly longer, using a maximum of **2 to 3 simple sentences.** Do not use any complex quotes or fancy phrases.
3.  **Formatting:** Use standard, simple text format.
4.  **Engagement:** Include a mix of relevant emojis and 3-4 highly relevant hashtags at the end.
5.  **Output Rule:** **The output must contain ONLY the caption text.** Do not include any introductory phrases like "Here is your caption" or "I wrote this for you."

           `
      }
    });

    return response.text
  } catch (error) {
    console.error('Gemini AI error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response
    })
    throw error
  }
}


