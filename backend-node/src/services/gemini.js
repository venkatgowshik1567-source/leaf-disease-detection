const { GoogleGenAI } = require("@google/genai");

// Support multiple API keys (comma-separated) for rotation
const apiKeys = (process.env.GEMINI_API_KEY || "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);

console.log(`[Gemini] Loaded ${apiKeys.length} API key(s)`);

// Priority list: gemini-3.5-flash-lite is fastest and rock solid without 503 spikes; gemini-3.8-flash as fallback
const VISION_MODELS = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];

/**
 * Analyzes a leaf image using Google Multimodal Vision AI.
 * Tries the fastest, most reliable models and rotates API keys if needed.
 * @param {Buffer} imageBuffer
 * @param {string} mimeType
 */
async function analyzeLeaf(imageBuffer, mimeType) {
  const base64Image = imageBuffer.toString("base64");

  if (apiKeys.length === 0) {
    throw new Error("No GEMINI_API_KEY configured. Set it in environment variables.");
  }

  const prompt = `
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
`;

  let lastError = null;

  for (let keyIdx = 0; keyIdx < apiKeys.length; keyIdx++) {
    const currentKey = apiKeys[keyIdx];
    const ai = new GoogleGenAI({ apiKey: currentKey });
    const keyLabel = `Key#${keyIdx + 1}`;

    for (const modelName of VISION_MODELS) {
      try {
        console.log(`[Gemini ${keyLabel}] Calling ${modelName}...`);

        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              inlineData: {
                mimeType: mimeType || "image/jpeg",
                data: base64Image,
              },
            },
            { text: prompt },
          ],
        });

        const rawText = (response.text || "").trim();
        // Extract json object even if wrapped in markdown
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("Invalid non-JSON response from Gemini: " + rawText.slice(0, 100));
        }

        const result = JSON.parse(jsonMatch[0]);
        console.log(`[Gemini ${keyLabel} - ${modelName}] SUCCESS: ${result.leaf_name} | ${result.disease_name}`);
        return result;
      } catch (err) {
        lastError = err;
        const msg = err.message || String(err);
        console.warn(`[Gemini ${keyLabel} - ${modelName}] Warning:`, msg.slice(0, 150));

        // If quota exceeded or auth failure, don't try other models on this key, move to next key
        if (
          msg.includes("429") ||
          msg.includes("quota") ||
          msg.includes("RESOURCE_EXHAUSTED") ||
          msg.includes("401") ||
          msg.includes("403") ||
          msg.includes("UNAUTHENTICATED")
        ) {
          console.warn(`[Gemini ${keyLabel}] Quota/Auth issue on key, switching to next key...`);
          break; // break models loop to try next key
        }
        // If 503 or transient error, continue to next model in VISION_MODELS
      }
    }
  }

  throw lastError;
}

module.exports = { analyzeLeaf };