
import { GoogleGenAI, Type } from "@google/genai";
import { HistoricalEvent } from "../types";

export const discoverEvents = async (yearStart: number, yearEnd: number): Promise<HistoricalEvent[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const span = yearEnd - yearStart;
  const targetCount = span <= 1 ? 12 : 15;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Act as a historian. List at least ${targetCount} significant and diverse historical events for the period ${yearStart}${span > 1 ? ` to ${yearEnd - 1}` : ''}. 
    Focus on global significance including politics, science, culture, and major shifts.
    Provide them in a structured format suitable for a timeline. Include a unique ID (format: year_event_slug), title, exact date (YYYY-MM-DD), 
    a concise 2-sentence description, and a valid Wikipedia link. 
    Categorize each event into one of these themes: 'politics', 'science', 'space', 'medicine'.
    Assign zoom levels for each: 1 for granular monthly highlights, 2 for decade-defining, 3 for quarter-century, 4 for era-defining shifts. 
    Most events should be level 1, with only the most major ones also being 2, 3, or 4.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            date: { type: Type.STRING },
            description: { type: Type.STRING },
            wikiLink: { type: Type.STRING },
            theme: { type: Type.STRING, description: "Must be 'politics', 'science', 'space', or 'medicine'." },
            zoomLevel: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER }
            }
          },
          required: ["id", "title", "date", "description", "wikiLink", "zoomLevel", "theme"]
        }
      }
    }
  });

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse Gemini response", err);
    return [];
  }
};
