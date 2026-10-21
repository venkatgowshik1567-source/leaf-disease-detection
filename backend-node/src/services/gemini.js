const { GoogleGenAI } = require("@google/genai");

// Support multiple API keys (comma-separated) for rotation when quota runs out
const apiKeys = (process.env.GEMINI_API_KEY || "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);

console.log(`[Gemini] Loaded ${apiKeys.length} API key(s)`);

/**
 * Analyzes a leaf image using Google Gemini 3.8 Flash Vision AI.
 * Tries each API key in rotation. Skips retry on quota/auth errors.
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

  // Try each API key
  for (let keyIdx = 0; keyIdx < apiKeys.length; keyIdx++) {
    const currentKey = apiKeys[keyIdx];
    const ai = new GoogleGenAI({ apiKey: currentKey });
    const keyLabel = `Key#${keyIdx + 1}`;

    // Up to 2 retries per key (only for transient errors)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini ${keyLabel} Attempt ${attempt}] Calling gemini-3.8-flash...`);
        
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
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

        const text = (response.text || "").trim();
        const cleanText = text
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        const result = JSON.parse(cleanText);
        console.log(`[Gemini ${keyLabel}] SUCCESS: ${result.leaf_name} / ${result.disease_name}`);
        return result;
      } catch (err) {
        lastError = err;
        const msg = err.message || String(err);
        console.warn(`[Gemini ${keyLabel} Attempt ${attempt}] Error:`, msg);

        // If quota exceeded (429) or auth failed (401/403), skip to next key immediately
        if (msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED") ||
            msg.includes("401") || msg.includes("403") || msg.includes("UNAUTHENTICATED") ||
            msg.includes("PERMISSION_DENIED")) {
          console.warn(`[Gemini ${keyLabel}] Quota/Auth error — trying next key...`);
          break; // break inner loop, try next key
        }

        // For transient errors (500, 503, network), wait and retry
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
  }

  // All keys exhausted
  const errMsg = lastError?.message || String(lastError);
  if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
    throw new Error("QUOTA_EXHAUSTED: All Gemini API keys have exceeded their daily quota. Add a new key or wait for reset.");
  }
  throw lastError;
}

module.exports = { analyzeLeaf };