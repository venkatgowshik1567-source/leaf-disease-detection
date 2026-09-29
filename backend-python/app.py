"""
Flask REST API for Leaf Disease Detection.
Receives an image, runs it through the TensorFlow model, returns predictions.
"""

import os
import time
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.exceptions import HTTPException

from model.predictor import LeafDiseasePredictor
from utils.image_processor import preprocess_image, validate_image
from utils.disease_info import get_disease_info

# ─── Setup ────────────────────────────────────────────────────────────────────
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ─── Load Model Once at Startup ───────────────────────────────────────────────
MODEL_PATH = os.getenv("MODEL_PATH", "model/plant_disease_model.h5")
MIN_CONFIDENCE = float(os.getenv("MIN_CONFIDENCE_THRESHOLD", "0.3"))

predictor = LeafDiseasePredictor(MODEL_PATH)
logger.info(f"✅  Model loaded from: {MODEL_PATH}")


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "service": "LeafGuard Python ML API",
        "model_loaded": predictor.is_loaded,
        "num_classes": predictor.num_classes,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    })


@app.route("/predict", methods=["POST"])
def predict():
    """
    POST /predict
    Accepts: multipart/form-data with 'image' field
    Returns: JSON with disease prediction, confidence, and treatment info
    """
    # ── Validate request ──────────────────────────────────────────────────────
    if "image" not in request.files:
        return jsonify({"error": "No 'image' field in form-data."}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename. Please select an image."}), 400

    # ── Read & validate image ─────────────────────────────────────────────────
    image_bytes = file.read()
    max_size_mb = float(os.getenv("MAX_IMAGE_SIZE_MB", "10"))
    is_valid, err_msg = validate_image(image_bytes, max_size_mb=max_size_mb)
    if not is_valid:
        return jsonify({"error": err_msg}), 400

    # ── Preprocess ────────────────────────────────────────────────────────────
    try:
        img_array = preprocess_image(image_bytes, target_size=(224, 224))
    except Exception as e:
        logger.error(f"Image preprocessing failed: {e}")
        return jsonify({"error": f"Could not process image: {str(e)}"}), 422

    # ── Run Inference ─────────────────────────────────────────────────────────
    start_time = time.time()
    try:
        top_predictions = predictor.predict(img_array, top_k=5)
    except Exception as e:
        logger.error(f"Model inference failed: {e}")
        return jsonify({"error": f"Inference failed: {str(e)}"}), 500

    inference_ms = round((time.time() - start_time) * 1000)

    # ── Build Response ────────────────────────────────────────────────────────
    best = top_predictions[0]

    if best["confidence"] < MIN_CONFIDENCE:
        return jsonify({
            "error": (
                f"Low confidence ({best['confidence']:.1%}). "
                "Please use a clearer, well-lit photo of a single leaf."
            ),
            "top_predictions": top_predictions,
        }), 422

    plant_name, disease_name, is_healthy = parse_label(best["label"])
    disease_info = get_disease_info(best["label"])

    response = {
        "disease_name":    disease_name,
        "plant_name":      plant_name,
        "is_healthy":      is_healthy,
        "confidence":      round(best["confidence"], 4),
        "severity":        compute_severity(is_healthy, best["confidence"]),
        "scientific_name": disease_info.get("scientific_name"),
        "top_predictions": top_predictions,
        "disease_info":    disease_info,
        "inference_ms":    inference_ms,
        "model_version":   predictor.version,
    }

    logger.info(
        f"Predicted: {disease_name} | {best['confidence']:.1%} confidence | {inference_ms}ms"
    )
    return jsonify(response), 200


# ─── Helpers ──────────────────────────────────────────────────────────────────

def parse_label(label: str):
    """
    Parses PlantVillage-style labels like 'Tomato___Early_blight'
    Returns (plant_name, disease_name, is_healthy)
    """
    parts = label.replace("___", "|").split("|")
    plant   = parts[0].replace("_", " ").strip() if len(parts) > 0 else "Unknown"
    disease = parts[1].replace("_", " ").strip() if len(parts) > 1 else label

    is_healthy = "healthy" in disease.lower()
    display_disease = "Healthy" if is_healthy else disease.title()
    return plant, display_disease, is_healthy


def compute_severity(is_healthy: bool, confidence: float) -> str:
    """Derives a severity string based on health status and confidence."""
    if is_healthy:
        return "healthy"
    if confidence > 0.85:
        return "high"
    if confidence > 0.60:
        return "moderate"
    return "low"


# ─── Error Handlers ───────────────────────────────────────────────────────────

@app.errorhandler(HTTPException)
def handle_http_error(e):
    return jsonify({"error": e.description}), e.code


@app.errorhandler(Exception)
def handle_generic_error(e):
    logger.exception("Unhandled exception")
    return jsonify({"error": "Internal server error", "detail": str(e)}), 500


# ─── Entry Point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 8000))
    debug = os.getenv("FLASK_ENV", "development") == "development"
    logger.info(f"🌿  Starting LeafGuard ML API on port {port} (debug={debug})")
    app.run(host="0.0.0.0", port=port, debug=debug)
