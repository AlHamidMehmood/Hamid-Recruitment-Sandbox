import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GenerationResult {
  jobDescription: string;
  interviewGuide: string[];
}

export async function generateHiringAssets(rawNotes: string): Promise<GenerationResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Transform these raw notes into a professional hiring package:\n\n${rawNotes}`,
    config: {
      systemInstruction: `You are an expert HR Specialist and Recruitment Consultant. 
      Your task is to take raw, often messy notes about a job role and produce two distinct sections:
      1. A polished, high-impact Job Description tailored specifically for LinkedIn. Use professional formatting, clear headings, and engaging language.
      2. An Interview Guide containing exactly 10 behavioral interview questions. These questions should specifically target the soft and hard skills identified in the JD you just created.
      
      Respond in JSON format.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          jobDescription: {
            type: Type.STRING,
            description: "The complete, markdown-formatted job description for LinkedIn.",
          },
          interviewGuide: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
            description: "A list of exactly 10 behavioral interview questions.",
          },
        },
        required: ["jobDescription", "interviewGuide"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text.trim()) as GenerationResult;
}
