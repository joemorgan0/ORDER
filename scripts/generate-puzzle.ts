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

const CATEGORIES = ["Movies", "Video Games", "Geography", "Music", "Science", "Sports"];

async function generatePuzzle() {
  console.log("Reading existing puzzles...");
  const puzzlesRaw = fs.readFileSync(PUZZLES_FILE_PATH, "utf-8");
  const puzzles = JSON.parse(puzzlesRaw);

  const latestPuzzle = puzzles[puzzles.length - 1];
  const nextDate = getNextDate(latestPuzzle.date);
  let nextId = parseInt(latestPuzzle.id) + 1;

  console.log(`Generating puzzles for ${nextDate}...`);

  for (const category of CATEGORIES) {
    console.log(`Generating puzzle for ${category} (ID: ${nextId})...`);
    
    const prompt = `
You are an expert trivia puzzle generator for the game "ORDER". Generate a puzzle where the player must order 5 items according to a specific criterion. 

The category MUST be strictly about: ${category}.

CRITICAL REQUIREMENTS FOR QUESTION DIVERSITY:
- ORDER is an ordering game, but the fun comes from varied knowledge!
- DO NOT repeatedly default to "release year", "chronological order", "sales figures", or "dates". 
- Instead, use highly diverse criteria: e.g., population density, career goals, boiling points, runtime, Academy Award wins, GDP, Grand Slam titles, distance from Earth, highest elevation, album lengths, atomic numbers, etc.
- If you generated a date-based question yesterday, do NOT generate one today. Surprise the player!
- In Sports, DO NOT make it just about football (soccer). Mix it up with Tennis, Formula 1, Rugby, Cricket, Golf, Basketball, Olympics, etc.

FACTUAL RELIABILITY:
- All five values must be objectively correct and use the exact same definition.
- AVOID TIES. No two items should have the exact same value. If unavoidable, use a clear secondary ordering criterion.
- Do not mix definitions (e.g., "worldwide sales" vs "copies shipped").

JSON FORMAT REQUIREMENTS:
- Produce EXACTLY 5 items.
- Provide a clear, explicit 'question' (e.g. "Order these countries by population density, lowest to highest.").
- The player should never have to guess what the criterion means.
- Provide an 'order' field which must be either "asc" (if the correct answer is lowest-to-highest/oldest-to-newest) or "desc" (highest-to-lowest).
- For each item, provide a 'name', a 'value' (string representation of the truth, e.g. "1969" or "4,500 km"), and a 'numericValue' (a pure number used to sort them behind the scenes). 
- Ensure all numericValues are correct and can be sorted uniquely! Do not use duplicate numeric values.

Return ONLY valid JSON matching this TypeScript interface. Do not wrap in markdown \`\`\`json blocks.
{
  "id": "${nextId}",
  "date": "${nextDate}",
  "category": "${category}",
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
    const candidateModels = [
      "gemini-3.6-flash"
    ];

    let responseText: string | undefined;

    for (const model of candidateModels) {
      const maxRetries = 3;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Trying model: ${model} (Attempt ${attempt}/${maxRetries})...`);
          const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.7,
            },
          });
          responseText = response.text;
          if (responseText) {
            console.log(`Successfully generated using ${model}`);
            break;
          }
        } catch (e: any) {
          console.log(`Failed with model ${model} (Attempt ${attempt}): ${e.message}`);
          if (attempt < maxRetries) {
            console.log(`Waiting 5 seconds before retrying...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }
      }
      
      if (responseText) break;
    }

      if (!responseText) {
        throw new Error(`All candidate models failed for ${category}.`);
      }

      const newPuzzle = JSON.parse(responseText);

      if (!newPuzzle.items || newPuzzle.items.length !== 5) {
        throw new Error("AI did not return exactly 5 items.");
      }

      console.log(`Successfully generated ${category} puzzle!`);
      puzzles.push(newPuzzle);
      
      // Increment ID for the next category
      nextId++;

    } catch (error) {
      console.error(`Failed to generate or save puzzle for ${category}:`, error);
      // We don't exit(1) here so that we can at least try the other categories
    }
  }

  // Save all successfully generated puzzles
  fs.writeFileSync(PUZZLES_FILE_PATH, JSON.stringify(puzzles, null, 2));
  console.log(`Saved new puzzles to ${PUZZLES_FILE_PATH}`);
}

generatePuzzle();
