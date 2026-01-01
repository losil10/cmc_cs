import { GoogleGenAI, Type } from "@google/genai";
import { GroupData, ScheduleEntry, DayOfWeek, TimeSlot } from "./types";
import { TIME_SLOTS, normalizeCohortID } from "./constants";

// Get the key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Debugging: Check if key exists (Check your browser console to see this!)
console.log("DEBUG: API Key status:", apiKey ? "Loaded ✅" : "Missing ❌");

// Initialize AI
const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_KEY" });

export const parseSchedulePDF = async (file: File, filename: string): Promise<GroupData> => {
  try {
    const base64Data = await fileToBase64(file);
    
    const prompt = `
      Extract schedule data from this OFPPT schedule.
      Group Name: Extract from filename "${filename}" or content. Simplify to format like DEV101.
      Entries: Map to days (Lundi-Samedi) and slots (${TIME_SLOTS.join(", ")}).
      Return JSON.
    `;

    console.log("DEBUG: Sending request to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "application/pdf", data: base64Data } }
          ]
        }
      ],
      // 👇 THIS FIXES THE "BLOCKING" ISSUE 👇
      config: {
        responseMimeType: "application/json",
        safetySettings: [
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" }
        ],
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            groupName: { type: Type.STRING },
            entries: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  timeSlot: { type: Type.STRING },
                  room: { type: Type.STRING },
                  professor: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    console.log("DEBUG: Response received!");
    
    const responseText = response.text();
    if (!responseText) throw new Error("Empty response from AI");

    const rawJson = JSON.parse(responseText);
    const normalizedGroupName = normalizeCohortID(rawJson.groupName || "");

    const dayMap: Record<string, DayOfWeek> = {
      'Lundi': DayOfWeek.Monday, 'Mardi': DayOfWeek.Tuesday, 'Mercredi': DayOfWeek.Wednesday,
      'Jeudi': DayOfWeek.Thursday, 'Vendredi': DayOfWeek.Friday, 'Samedi': DayOfWeek.Saturday
    };

    const formattedEntries: ScheduleEntry[] = (rawJson.entries || []).map((e: any) => ({
      groupName: normalizedGroupName,
      day: dayMap[e.day] || e.day,
      timeSlot: e.timeSlot as TimeSlot,
      room: e.room,
      professor: e.professor
    }));

    return {
      name: normalizedGroupName,
      lastUpdated: Date.now(),
      entries: formattedEntries,
      status: 'OK',
      mondaySummary: []
    };

  } catch (error) {
    // 👇 THIS LOGS THE REAL ERROR TO YOUR CONSOLE 👇
    console.error("FULL AI ERROR DETAILS:", error);
    throw error;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};
