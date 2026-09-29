"""
LeafDiseasePredictor — works in two modes:
  1. MOCK MODE (no TensorFlow needed) — returns realistic demo predictions
  2. REAL MODE (TensorFlow installed) — loads .h5 model and runs real inference

By default runs in MOCK MODE so you can test the full app without heavy ML dependencies.
Set USE_REAL_MODEL=true in .env to switch to real inference.
"""

import os
import random
import logging
import numpy as np

logger = logging.getLogger(__name__)

# 38 PlantVillage class labels
CLASS_LABELS = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
]


class LeafDiseasePredictor:
    """
    Wraps either a real TensorFlow model or a mock predictor for demo/testing.
    """

    def __init__(self, model_path: str):
        self.model_path  = model_path
        self.model       = None
        self.num_classes = len(CLASS_LABELS)
        self.version     = "1.0.0"
        self.use_real    = os.getenv("USE_REAL_MODEL", "false").lower() == "true"
        self.is_loaded   = False
        self._load()

    def _load(self):
        if self.use_real:
            self._load_tf_model()
        else:
            logger.warning(
                "🟡 Running in MOCK MODE — predictions are demo data.\n"
                "   To use real AI: install tensorflow, train a model,\n"
                "   then set USE_REAL_MODEL=true in backend-python/.env"
            )
            self.is_loaded = True

    def _load_tf_model(self):
        """Try to load real TensorFlow model."""
        try:
            import tensorflow as tf
            if os.path.exists(self.model_path):
                logger.info(f"Loading TensorFlow model from {self.model_path} ...")
                self.model = tf.keras.models.load_model(self.model_path)
                self.is_loaded = True
                logger.info("✅ Real model loaded successfully.")
            else:
                logger.warning(
                    f"⚠️  Model file not found at '{self.model_path}'.\n"
                    "   Falling back to MOCK MODE."
                )
                self.use_real  = False
                self.is_loaded = True
        except ImportError:
            logger.warning("TensorFlow not installed — falling back to MOCK MODE.")
            self.use_real  = False
            self.is_loaded = True
        except Exception as e:
            logger.error(f"Model load failed: {e} — falling back to MOCK MODE.")
            self.use_real  = False
            self.is_loaded = True

    # ──────────────────────────────────────────────────────────────────────────

    def predict(self, img_array: np.ndarray, top_k: int = 5):
        """
        Run prediction on preprocessed image array.
        Returns list of {"label": str, "confidence": float}
        """
        if self.use_real and self.model is not None:
            return self._real_predict(img_array, top_k)
        return self._mock_predict(top_k)

    # ── Real inference ────────────────────────────────────────────────────────

    def _real_predict(self, img_array: np.ndarray, top_k: int):
        probs       = self.model.predict(img_array, verbose=0)[0]
        top_indices = np.argsort(probs)[::-1][:top_k]
        return [
            {"label": CLASS_LABELS[i], "confidence": float(round(float(probs[i]), 4))}
            for i in top_indices
        ]

    # ── Mock / Demo inference ─────────────────────────────────────────────────

    def _mock_predict(self, top_k: int):
        """
        Returns realistic-looking demo predictions.
        Picks one disease as the top prediction with high confidence,
        and fills in the rest with decreasing scores.
        """
        # Pick a random class as the "winner"
        winner_idx  = random.randint(0, self.num_classes - 1)
        top_conf    = round(random.uniform(0.72, 0.97), 4)

        # Distribute remaining probability across other classes
        remaining   = round(1.0 - top_conf, 4)
        others_idx  = random.sample(
            [i for i in range(self.num_classes) if i != winner_idx],
            min(top_k - 1, self.num_classes - 1)
        )

        # Give decreasing shares to the rest
        other_confs = sorted(
            [round(random.uniform(0.01, remaining / 2), 4) for _ in others_idx],
            reverse=True
        )

        results = [{"label": CLASS_LABELS[winner_idx], "confidence": top_conf}]
        for idx, conf in zip(others_idx, other_confs):
            results.append({"label": CLASS_LABELS[idx], "confidence": conf})

        return results[:top_k]
