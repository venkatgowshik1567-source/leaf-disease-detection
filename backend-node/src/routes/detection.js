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
    const geminiResult = await analyzeLeaf(
  req.file.buffer,
  req.file.mimetype
);

console.log("Gemini Result:", geminiResult);

    // Forward image to Python ML API
    const formData = new FormData();
    formData.append("image", req.file.buffer, {
      filename:    req.file.originalname,
      contentType: req.file.mimetype,
    });

    const startTime = Date.now();
    const pythonResponse = await axios.post(`${PYTHON_URL}/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
        "X-Request-ID": requestId,
      },
      timeout: 25000,
      maxContentLength: Infinity,
      maxBodyLength:    Infinity,
    });

    const inferenceMs = Date.now() - startTime;
    const result      = pythonResponse.data;

    console.log(`[${requestId}] Prediction: ${result.disease_name} (${Math.round(result.confidence * 100)}%) in ${inferenceMs}ms`);

    res.json({
  ...result,

  // Gemini is the primary result
  leaf_name: geminiResult.leaf_name,
  plant_name: geminiResult.leaf_name,
  disease_name: geminiResult.disease_name,
  symptoms: geminiResult.symptoms,
  treatment: geminiResult.treatment,
  prevention: geminiResult.prevention,

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
