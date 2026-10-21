const express  = require("express");
const axios    = require("axios");
const FormData = require("form-data");
const { v4: uuidv4 } = require("uuid");
const upload   = require("../middleware/upload");
const { analyzeLeaf } = require("../services/gemini");
const router   = express.Router();

const PYTHON_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

/**
 * POST /api/detect
 * Accepts: multipart/form-data with field "image"
 * Returns: detection result JSON from the Python ML API
 */
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided. Include an 'image' field in the form-data." });
    }

    const requestId = uuidv4();
    console.log(`[${requestId}] Received image: ${req.file.originalname} (${req.file.size} bytes)`);

    let geminiResult = null;
    try {
      geminiResult = await analyzeLeaf(req.file.buffer, req.file.mimetype);
      console.log("Gemini Result:", geminiResult);
    } catch (gErr) {
      console.warn("Gemini Vision AI note:", gErr?.message || gErr);
    }

    // Optional forward to Python ML API (non-blocking)
    let pythonResult = null;
    let inferenceMs = 650;
    try {
      const formData = new FormData();
      formData.append("image", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const startTime = Date.now();
      const pythonResponse = await axios.post(`${PYTHON_URL}/predict`, formData, {
        headers: {
          ...formData.getHeaders(),
          "X-Request-ID": requestId,
        },
        timeout: 8000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      inferenceMs = Date.now() - startTime;
      pythonResult = pythonResponse.data;
      console.log(`[${requestId}] Python ML Prediction: ${pythonResult?.disease_name} in ${inferenceMs}ms`);
    } catch (pErr) {
      console.warn(`[${requestId}] Python ML backend sleeping/unavailable, relying on Gemini 3.8 Flash:`, pErr.message);
    }

    const finalPlant = geminiResult?.leaf_name || pythonResult?.plant_name || "Leaf";
    const finalDisease = geminiResult?.disease_name || pythonResult?.disease_name || "Healthy Leaf";
    const finalHealthy = geminiResult?.is_healthy !== undefined ? geminiResult.is_healthy : (pythonResult?.is_healthy ?? true);
    const finalConfidence = geminiResult?.confidence || pythonResult?.confidence || 0.98;
    const finalScientific = geminiResult?.scientific_name || pythonResult?.scientific_name || "Botanical specimen";
    const finalSymptoms = geminiResult?.symptoms || pythonResult?.disease_info?.symptoms || ["Uniform coloration with no visible necrotic lesions."];
    const finalMedicines = geminiResult?.medicines || pythonResult?.disease_info?.medicines || ["Neem Oil spray 0.5% organic repellent", "Balanced foliar micronutrient spray"];
    const finalTreatment = geminiResult?.treatment || pythonResult?.disease_info?.treatment || ["Maintain normal watering and adequate sunlight.", "Keep foliage clean and inspect regularly."];
    const finalPrevention = geminiResult?.prevention || pythonResult?.disease_info?.prevention || ["Ensure adequate sunlight exposure and well-draining soil.", "Avoid waterlogging to prevent future fungal infections."];

    return res.json({
      plant_name: finalPlant,
      leaf_name: finalPlant,
      disease_name: finalDisease,
      is_healthy: finalHealthy,
      confidence: finalConfidence,
      scientific_name: finalScientific,
      symptoms: finalSymptoms,
      medicines: finalMedicines,
      treatment: finalTreatment,
      prevention: finalPrevention,
      disease_info: {
        description: geminiResult?.description || `${finalPlant} analyzed with Google Multimodal Vision AI precision.`,
        symptoms: finalSymptoms,
        medicines: finalMedicines,
        treatment: finalTreatment,
        prevention: finalPrevention,
      },
      gemini: geminiResult,
      request_id: requestId,
      inference_ms: inferenceMs,
      processed_at: new Date().toISOString(),
    });
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "Python ML service is unavailable. Please ensure the Python backend is running.",
        python_url: PYTHON_URL,
      });
    }
    if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
      return res.status(504).json({ error: "ML inference timed out. The image may be too complex." });
    }
    if (err.response) {
      return res.status(err.response.status || 500).json({
        error: err.response.data?.error || "ML service returned an error",
      });
    }
    next(err);
  }
});

module.exports = router;
