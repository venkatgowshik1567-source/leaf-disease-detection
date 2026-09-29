"""
Image preprocessing utilities for the leaf disease detection pipeline.
"""

import io
import logging
import numpy as np
from PIL import Image, UnidentifiedImageError

logger = logging.getLogger(__name__)

ALLOWED_MODES = {"RGB", "RGBA", "L"}


def validate_image(image_bytes: bytes, max_size_mb: float = 10.0):
    """
    Validates raw image bytes.

    Returns:
        (True, None) if valid
        (False, error_message) if invalid
    """
    # Size check
    size_mb = len(image_bytes) / (1024 * 1024)
    if size_mb > max_size_mb:
        return False, f"Image too large ({size_mb:.1f}MB). Max allowed: {max_size_mb}MB."

    # Format check
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()  # checks for corruption
    except UnidentifiedImageError:
        return False, "File is not a valid image."
    except Exception as e:
        return False, f"Image validation failed: {str(e)}"

    return True, None


def preprocess_image(image_bytes: bytes, target_size: tuple = (224, 224)) -> np.ndarray:
    """
    Loads image bytes, resizes, converts to RGB, normalizes to [0, 1].

    Args:
        image_bytes: raw bytes of the image file
        target_size: (width, height) tuple for resizing

    Returns:
        np.ndarray of shape (1, H, W, 3), dtype float32, values in [0, 1]
    """
    img = Image.open(io.BytesIO(image_bytes))

    # Handle all common modes
    if img.mode == "RGBA":
        # Composite onto white background
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    elif img.mode != "RGB":
        img = img.convert("RGB")

    # Resize with high-quality resampling
    img = img.resize(target_size, Image.LANCZOS)

    # Convert to float32 numpy array and normalize
    img_array = np.array(img, dtype=np.float32) / 255.0

    # Add batch dimension: (H, W, 3) → (1, H, W, 3)
    img_array = np.expand_dims(img_array, axis=0)

    logger.debug(f"Preprocessed image: shape={img_array.shape}, min={img_array.min():.3f}, max={img_array.max():.3f}")
    return img_array
