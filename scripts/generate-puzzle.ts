import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY in environment variables.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PUZZLES_FILE_PATH = path.join(__dirname, "../src/data/puzzles.json");

// Helper to get tomorrow's date based on the latest puzzle
function getNextDate(latestDateStr: string): string {
  const date = new Date(latestDateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

async function generatePuzzle() {
  console.log("Reading existing puzzles...");
  const puzzlesRaw = fs.readFileSync(PUZZLES_FILE_PATH, "utf-8");
  const puzzles = JSON.parse(puzzlesRaw);

  const latestPuzzle = puzzles[puzzles.length - 1];
  const nextDate = getNextDate(latestPuzzle.date);
  const nextId = (parseInt(latestPuzzle.id) + 1).toString();

  console.log(`Generating puzzle for ${nextDate} (ID: ${nextId})...`);

  const prompt = `
You are an expert trivia puzzle generator. Generate a puzzle where the player must order 5 items according to a specific criterion. 

Categories could be: History, Geography, Science, Pop Culture, Literature, Music, Movies, Sports. Pick a random, interesting topic.

CRITICAL REQUIREMENTS:
- Produce EXACTLY 5 items.
- Provide a clear 'question' (e.g. "Put these events in chronological order, oldest to newest").
- Provide an 'order' field which must be either "asc" (if the correct answer is lowest-to-highest/oldest-to-newest) or "desc" (highest-to-lowest).
- For each item, provide a 'name', a 'value' (string representation of the truth, e.g. "1969" or "4,500 km"), and a 'numericValue' (a pure number used to sort them behind the scenes). 
- Ensure all numericValues are correct and can be sorted uniquely! Do not use duplicate numeric values.

Return ONLY valid JSON matching this TypeScript interface. Do not wrap in markdown \`\`\`json blocks.
{
  "id": "${nextId}",
  "date": "${nextDate}",
  "category": "string",
  "question": "string",
  "order": "asc" | "desc",
  "difficulty": "Easy" | "Medium" | "Hard",
  "items": [
    {
      "id": "p${nextId}-i1",
      "name": "string",
      "value": "string",
      "numericValue": number
    }
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const responseText = response.text();
    if (!responseText) throw new Error("Empty response from AI");

    const newPuzzle = JSON.parse(responseText);

    // Minor validation
    if (!newPuzzle.items || newPuzzle.items.length !== 5) {
      throw new Error("AI did not return exactly 5 items.");
    }

    console.log("Successfully generated puzzle:");
    console.log(JSON.stringify(newPuzzle, null, 2));

    puzzles.push(newPuzzle);

    fs.writeFileSync(PUZZLES_FILE_PATH, JSON.stringify(puzzles, null, 2));
    console.log(`Appended new puzzle to ${PUZZLES_FILE_PATH}`);

  } catch (error) {
    console.error("Failed to generate or save puzzle:", error);
    process.exit(1);
  }
}

generatePuzzle();
