import { GoogleGenAI, SchemaType } from "@google/genai";
import { GroupData, ScheduleEntry, DayOfWeek, TimeSlot } from "./types";
import { TIME_SLOTS, normalizeCohortID } from "./constants";

// 👇 THIS WAS THE BUG. WE CHANGED IT TO 'import.meta.env' 👇
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("CRITICAL ERROR: Google Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file or Vercel Settings.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "dummy_key_to_prevent_crash" });

export const parseSchedulePDF = async (file: File, filename: string): Promise<GroupData> => {
  const base64Data = await fileToBase64(file);
  
  const prompt = `
    Extract the schedule data from this PDF file.
    
    RULES:
    1. Group Name: Attempt to extract from filename "${filename}". If generic, find "Groupe" in PDF (e.g., DIA_DEV_TS_104) and simplify to "[Sector][Number]" (e.g., DEV104).
    2. MANDATORY: The Group Name must NOT have any spaces between the prefix and the code (e.g., DEV101, not DEV 101).
    3. Time Slots: Map all entries into exactly these four slots: ${TIME_SLOTS.join(", ")}. Ignore slots starting at 18:30 or later.
    4. Days: Identify the day for each entry (Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi).
    5. Room: Extract the Salle name (e.g., DIA-SN 7).
    6. Professor: Extract the Formateur name.
    7. Revision Date: Extract the "Semaine du" or revision date if present.

    Return only valid JSON.
  `;

  // Note: 'gemini-2.0-flash' is the current stable standard, but 'gemini-1.5-flash' is also fine.
  // If 'gemini-3-flash-preview' fails, switch to 'gemini-1.5-flash'.
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash", 
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Data
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          groupName: { type: SchemaType.STRING },
          revisionDate: { type: SchemaType.STRING },
          entries: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                day: { type: SchemaType.STRING },
                timeSlot: { type: SchemaType.STRING },
                room: { type: SchemaType.STRING },
                professor: { type: SchemaType.STRING }
              },
              required: ["day", "timeSlot", "room", "professor"]
            }
          }
        },
        required: ["groupName", "entries"]
      }
    }
  });

  const rawJson = JSON.parse(response.text() || "{}");
  
  // Apply normalization as a strict safety measure
  const normalizedGroupName = normalizeCohortID(rawJson.groupName || "");

  // Map day strings to DayOfWeek enum
  const dayMap: Record<string, DayOfWeek> = {
    'Lundi': DayOfWeek.Monday,
    'Mardi': DayOfWeek.Tuesday,
    'Mercredi': DayOfWeek.Wednesday,
    'Jeudi': DayOfWeek.Thursday,
    'Vendredi': DayOfWeek.Friday,
    'Samedi': DayOfWeek.Saturday
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
    revisionDate: rawJson.revisionDate,
    mondaySummary: formattedEntries
      .filter((e: ScheduleEntry) => e.day === DayOfWeek.Monday)
      .map((e: ScheduleEntry) => ({
        timeSlot: e.timeSlot,
        room: e.room,
        professor: e.professor
      }))
  };
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
};
