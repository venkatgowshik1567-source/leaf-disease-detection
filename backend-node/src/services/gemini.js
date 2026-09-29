const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeLeaf(imageBuffer, mimeType) {
  const base64Image = imageBuffer.toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
  
    contents: [
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
      {
        text: `
Analyze this leaf image.

Return ONLY valid JSON:

{
  "leaf_name": "",
  "disease_name": "",
  "symptoms": "",
  "treatment": "",
  "prevention": ""
}

Identify the leaf and possible disease.
Give simple treatment and prevention suggestions.
Do not include markdown or extra text.
`,
      },
    ],
  });

  const text = response.text.trim();

  // Remove markdown code fences if Gemini adds them
  const cleanText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleanText);
}

module.exports = { analyzeLeaf };