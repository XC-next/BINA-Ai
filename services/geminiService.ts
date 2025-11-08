
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const buildGeminiContent = (history: ChatMessage[]) => {
    return history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));
};

const findProductsFunctionDeclaration: FunctionDeclaration = {
    name: 'findProducts',
    description: 'Get a list of products based on a user query. The model should generate realistic but fictional product data if it does not have access to real-time information.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            products: {
                type: Type.ARRAY,
                description: 'A list of products that match the query.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: 'The name of the product.' },
                        price: { type: Type.STRING, description: 'The price of the product, including currency symbol (e.g., $99.99).' },
                        description: { type: Type.STRING, description: 'A brief description of the product.' },
                        imageUrl: { type: Type.STRING, description: 'A URL for an image of the product. Should be a plausible-looking placeholder image URL.' },
                    },
                    required: ['name', 'price', 'description', 'imageUrl'],
                },
            },
        },
        required: ['products'],
    },
};

export const generateChatResponse = async (history: ChatMessage[], systemInstruction: string): Promise<GenerateContentResponse> => {
  const model = 'gemini-2.5-flash';
  
  const response = await ai.models.generateContent({
    model: model,
    contents: buildGeminiContent(history),
    config: {
      systemInstruction: systemInstruction,
      tools: [{ functionDeclarations: [findProductsFunctionDeclaration] }],
    },
  });

  return response;
};

export const generateCode = async (prompt: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-pro';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert web developer. Your task is to generate the complete HTML, CSS, and JavaScript code for a user's request. You MUST respond with ONLY a JSON object containing three keys: 'html', 'css', and 'js'. Do not include any other text, explanations, or markdown formatting outside of the JSON object.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            html: { type: Type.STRING },
            css: { type: Type.STRING },
            js: { type: Type.STRING },
          },
          required: ['html', 'css', 'js'],
        },
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating code:", error);
    return JSON.stringify({
        html: `<p>Sorry, there was an error generating the code.</p>`,
        css: `p { color: red; font-family: sans-serif; }`,
        js: `console.error("Code generation failed.")`
    });
  }
};
