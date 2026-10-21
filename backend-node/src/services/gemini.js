const { GoogleGenAI } = require("@google/genai");

const apiKey = (process.env.GEMINI_API_KEY || "").trim();
const ai = new GoogleGenAI({ apiKey });

/**
 * Analyzes a leaf image using Google Gemini 3.8 Flash Vision AI.
 * Includes automatic retry on transient rate-limit or 503 spikes.
 * @param {Buffer} imageBuffer
 * @param {string} mimeType
 */
async function analyzeLeaf(imageBuffer, mimeType) {
  const base64Image = imageBuffer.toString("base64");

  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            inlineData: {
              mimeType: mimeType || "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: `
Analyze this leaf photo with high botanical precision.
Identify the exact plant/tree name (e.g. "Banyan", "Aloe Vera", "Tomato", "Mango", "Neem", "Potato", "Apple", "Peepal", "Rose", etc.) and determine whether it is healthy or has a specific plant disease.

Return ONLY a valid JSON object with this exact structure:
{
  "leaf_name": "Exact Plant Name (e.g. Banyan, Aloe Vera, Tomato, Neem)",
  "disease_name": "Specific Disease Name or Healthy Leaf (e.g. Anthracnose, Leaf Spot, Healthy Leaf)",
  "is_healthy": true,
  "confidence": 0.98,
  "scientific_name": "Botanical/Fungal scientific name",
  "symptoms": ["Symptom 1", "Symptom 2"],
  "medicines": ["Recommended medicine with dosage 1", "Recommended medicine 2"],
  "treatment": ["Treatment step 1", "Treatment step 2"],
  "prevention": ["Prevention tip 1", "Prevention tip 2"]
}

Do not include markdown code fences or any other text outside the JSON.
`,
          },
        ],
      });

      const text = (response.text || "").trim();
      const cleanText = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      return JSON.parse(cleanText);
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini Attempt ${attempt}] Warning:`, err.message || err);
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
      }
    }
  }

  throw lastError;
}

module.exports = { analyzeLeaf };