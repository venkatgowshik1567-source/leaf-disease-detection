"""
Utility for training the MobileNetV2 leaf disease model on the PlantVillage dataset.

Usage:
    python model/train_model.py --data_dir /path/to/PlantVillage --epochs 20

Dataset: https://www.kaggle.com/datasets/emmarex/plantdisease
"""

import os
import argparse
import logging
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

IMG_SIZE    = (224, 224)
BATCH_SIZE  = 32
NUM_CLASSES = 38


def build_model(num_classes: int = NUM_CLASSES):
    base = tf.keras.applications.MobileNetV2(
        input_shape=(*IMG_SIZE, 3),
        include_top=False,
        weights="imagenet",
    )
    base.trainable = False

    model = tf.keras.Sequential([
        base,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dense(256, activation="relu"),
        tf.keras.layers.Dropout(0.4),
        tf.keras.layers.Dense(num_classes, activation="softmax"),
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-4),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def train(data_dir: str, output_path: str, epochs: int, fine_tune_epochs: int):
    # ── Data Augmentation ────────────────────────────────────────────────────
    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        validation_split=0.2,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode="nearest",
    )

    train_gen = train_datagen.flow_from_directory(
        data_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="training",
        shuffle=True,
    )
    val_gen = train_datagen.flow_from_directory(
        data_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="validation",
        shuffle=False,
    )

    logger.info(f"Train samples: {train_gen.samples} | Val samples: {val_gen.samples}")
    logger.info(f"Classes detected: {len(train_gen.class_indices)}")

    model = build_model(num_classes=len(train_gen.class_indices))

    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            output_path, save_best_only=True, monitor="val_accuracy", verbose=1
        ),
        tf.keras.callbacks.EarlyStopping(
            patience=5, restore_best_weights=True, monitor="val_accuracy"
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            factor=0.5, patience=3, min_lr=1e-7, verbose=1
        ),
    ]

    # ── Phase 1: Train classifier head ───────────────────────────────────────
    logger.info("Phase 1: Training classifier head (base frozen)...")
    model.fit(train_gen, validation_data=val_gen, epochs=epochs, callbacks=callbacks)

    # ── Phase 2: Fine-tune last 30 layers of base ─────────────────────────
    logger.info("Phase 2: Fine-tuning last 30 base layers...")
    model.layers[0].trainable = True
    for layer in model.layers[0].layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-5),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.fit(train_gen, validation_data=val_gen, epochs=fine_tune_epochs, callbacks=callbacks)

    logger.info(f"✅  Training complete. Model saved to: {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train leaf disease MobileNetV2 model")
    parser.add_argument("--data_dir",         type=str, required=True, help="Path to PlantVillage dataset directory")
    parser.add_argument("--output",           type=str, default="model/plant_disease_model.h5")
    parser.add_argument("--epochs",           type=int, default=15)
    parser.add_argument("--fine_tune_epochs", type=int, default=10)
    args = parser.parse_args()

    train(args.data_dir, args.output, args.epochs, args.fine_tune_epochs)
