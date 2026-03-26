
import { GoogleGenAI, Type } from "@google/genai";
import type { Slide } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const presentationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "The title of the slide. Should be concise and engaging.",
      },
      content: {
        type: Type.STRING,
        description: "The main content of the slide. Use newline characters (\\n) to separate bullet points or paragraphs. Keep content informative but not overly dense.",
      },
    },
    required: ["title", "content"],
  },
};

export const generatePresentationContent = async (topic: string, contentInfo: string = ''): Promise<Slide[]> => {
  const additionalContext = contentInfo ? `
    
    ADDITIONAL CONTENT INFORMATION PROVIDED BY USER:
    ${contentInfo}
    
    Please incorporate this information into the presentation where relevant.
  ` : '';
  
  const prompt = `
    Generate a professional presentation about "${topic}".${additionalContext}
    The presentation should have a clear structure:
    1. A short, catchy title slide.
    2. An introduction slide explaining the topic's importance.
    3. Three to five key content slides, each focusing on a specific aspect.
    4. A conclusion slide summarizing the main points and offering a final thought.

    IMPORTANT FORMATTING REQUIREMENTS:
    - For slide content, use bullet points with dashes (-) at the beginning of each line
    - Each bullet point should be on a separate line
    - Example format:
      - First key point here
      - Second key point here
      - Third key point here
    - Keep each bullet point concise and informative
    - Do not use paragraphs - always use bullet points for content slides

    Ensure the content is well-structured and follows the requested JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: presentationSchema,
      },
    });

    const jsonText = response.text.trim();
    const presentationData = JSON.parse(jsonText) as Slide[];
    
    if (!Array.isArray(presentationData) || presentationData.length === 0) {
      throw new Error("API returned invalid or empty data.");
    }

    return presentationData;

  } catch (error) {
    console.error("Error generating presentation content:", error);
    throw new Error("Failed to generate content from Gemini API.");
  }
};

export const generatePresentationContentFromContent = async (content: string): Promise<Slide[]> => {
  const prompt = `
    Generate a professional PowerPoint presentation based on the following content/report.
    
    CONTENT/REPORT:
    ${content}
    
    Create a well-structured presentation with 10 to 20 slides including:
    1. A short, catchy title slide (create an appropriate title based on the content)
    2. An introduction slide explaining the topic's importance
    3. Multiple key content slides covering all main points from the content in detail
    4. Several slides for subtopics, examples, and supporting information
    5. A conclusion slide summarizing the main points
    
    IMPORTANT FORMATTING REQUIREMENTS:
    - For slide content, use bullet points with dashes (-) at the beginning of each line
    - Each bullet point should be on a separate line
    - Example format:
      - First key point here
      - Second key point here
      - Third key point here
    - Keep each bullet point concise and informative
    - Do not use paragraphs - always use bullet points for content slides
    - Extract and organize the key information from the provided content
    - Create enough slides to cover the content thoroughly (aim for 10-20 slides)

    Ensure the content is well-structured and follows the requested JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: presentationSchema,
      },
    });

    const jsonText = response.text.trim();
    const presentationData = JSON.parse(jsonText) as Slide[];
    
    if (!Array.isArray(presentationData) || presentationData.length === 0) {
      throw new Error("API returned invalid or empty data.");
    }

    return presentationData;

  } catch (error) {
    console.error("Error generating presentation from content:", error);
    throw new Error("Failed to generate content from Gemini API.");
  }
};
