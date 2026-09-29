# 🌿 LeafGuard AI — Plant Leaf Disease Detection System

An end-to-end AI-powered web application for detecting plant leaf diseases from photos.

## 🏗️ Architecture

```
┌───────────────────┐     ┌──────────────────────┐     ┌───────────────────────────┐
│   React.js UI     │────▶│  Node.js API Gateway  │────▶│  Python Flask ML API      │
│   Port 3000       │     │  Port 5000            │     │  Port 8000                │
│                   │     │  • File upload        │     │  • TensorFlow MobileNetV2 │
│  • Upload image   │     │  • Rate limiting      │     │  • 38 disease classes     │
│  • View results   │     │  • CORS / Helmet      │     │  • Image preprocessing    │
│  • History        │     │  • Request logging    │     │  • Treatment advice DB    │
└───────────────────┘     └──────────────────────┘     └───────────────────────────┘
```

## 📁 Project Structure

```
leaf-disease-detection/
├── frontend/                      # React.js application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Responsive navigation bar
│   │   │   ├── ImageUpload.jsx    # Drag-and-drop image uploader
│   │   │   ├── ResultCard.jsx     # Prediction result display
│   │   │   └── DiseaseInfo.jsx    # Accordion disease details
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Detect.jsx         # Main detection page
│   │   │   ├── History.jsx        # Detection history
│   │   │   └── About.jsx          # About & tech stack
│   │   ├── services/
│   │   │   └── api.js             # Axios API client
│   │   └── App.jsx                # Router & layout
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── backend-node/                  # Node.js API Gateway
│   ├── src/
│   │   ├── routes/
│   │   │   ├── detection.js       # POST /api/detect
│   │   │   └── history.js         # GET/POST/DELETE /api/history
│   │   ├── middleware/
│   │   │   ├── upload.js          # Multer (memory storage)
│   │   │   └── errorHandler.js    # Global error middleware
│   │   └── server.js              # Express entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── backend-python/                # Python ML Backend
│   ├── app.py                     # Flask REST API
│   ├── model/
│   │   ├── predictor.py           # LeafDiseasePredictor class
│   │   └── train_model.py         # Training script
│   ├── utils/
│   │   ├── image_processor.py     # Preprocessing pipeline
│   │   └── disease_info.py        # Disease information DB
│   ├── Dockerfile
│   ├── .env.example
│   └── requirements.txt
│
└── docker-compose.yml             # Full stack orchestration
```

---

## 🚀 Quick Start

### Option A — Run Manually (Development)

#### 1. Python ML Backend

```bash
cd backend-python

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Copy env file
copy .env.example .env

# Start Flask server
python app.py
# ✅ Running on http://localhost:8000
```

#### 2. Node.js API Gateway

```bash
cd backend-node

# Install dependencies
npm install

# Copy env file
copy .env.example .env

# Start server (development with auto-reload)
npm run dev
# ✅ Running on http://localhost:5000
```

#### 3. React Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
# ✅ Opens http://localhost:3000
```

---

### Option B — Docker Compose (All services at once)

```bash
# Build and start all services
docker-compose up --build

# Access:
# Frontend  → http://localhost:3000
# Node API  → http://localhost:5000
# Python API→ http://localhost:8000
```

---

## 🤖 AI Model

### About the Model
- **Architecture:** MobileNetV2 (transfer learning from ImageNet)
- **Dataset:** PlantVillage (54,000+ leaf images)
- **Classes:** 38 (37 diseases + healthy across 14 plant species)
- **Input:** 224×224 RGB images, normalized to [0, 1]

### Getting a Pre-trained Model

**Option 1 — Download from Kaggle:**
1. Download the PlantVillage dataset from [Kaggle](https://www.kaggle.com/datasets/emmarex/plantdisease)
2. Run training:
   ```bash
   cd backend-python
   python model/train_model.py --data_dir /path/to/PlantVillage --epochs 15
   ```
3. Model saves to `model/plant_disease_model.h5`

**Option 2 — Use a community pre-trained model:**
- Search Kaggle/HuggingFace for `mobilenetv2 plant disease .h5`
- Place it at `backend-python/model/plant_disease_model.h5`

> **Note:** Without a trained `.h5` file, the app still runs but predictions will be random (uses ImageNet pretrained weights as a scaffold).

---

## 🌿 Supported Plants & Diseases

| Plant      | Diseases Detected                                      |
|------------|--------------------------------------------------------|
| Tomato     | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria, Spider Mites, Target Spot, TYLCV, Mosaic Virus, Healthy |
| Potato     | Early Blight, Late Blight, Healthy                     |
| Apple      | Apple Scab, Black Rot, Cedar Apple Rust, Healthy       |
| Corn/Maize | Gray Leaf Spot, Common Rust, Northern Leaf Blight, Healthy |
| Grape      | Black Rot, Esca, Leaf Blight, Healthy                  |
| Pepper     | Bacterial Spot, Healthy                                |
| Peach      | Bacterial Spot, Healthy                                |
| Cherry     | Powdery Mildew, Healthy                                |
| Strawberry | Leaf Scorch, Healthy                                   |
| Others     | Blueberry, Orange, Raspberry, Soybean, Squash          |

---

## 🔌 API Reference

### Node.js Gateway (Port 5000)

| Method | Endpoint       | Description                        |
|--------|---------------|------------------------------------|
| GET    | /api/health   | Server health check                |
| POST   | /api/detect   | Upload image for disease detection |
| GET    | /api/history  | Get detection history (paginated)  |
| DELETE | /api/history  | Clear all history                  |

**POST /api/detect**
```
Content-Type: multipart/form-data
Body: image=<file>
```

**Response:**
```json
{
  "disease_name": "Early Blight",
  "plant_name": "Tomato",
  "is_healthy": false,
  "confidence": 0.9234,
  "severity": "high",
  "scientific_name": "Alternaria solani",
  "top_predictions": [
    { "label": "Tomato___Early_blight", "confidence": 0.9234 },
    { "label": "Tomato___Late_blight",  "confidence": 0.0521 }
  ],
  "disease_info": {
    "description": "...",
    "symptoms": ["..."],
    "treatment": ["..."],
    "prevention": ["..."],
    "urgency": "soon"
  },
  "inference_ms": 187,
  "request_id": "uuid-here"
}
```

### Python ML API (Port 8000)

| Method | Endpoint  | Description           |
|--------|-----------|-----------------------|
| GET    | /health   | Model status check    |
| POST   | /predict  | Run inference on image|

---

## 🛠️ Tech Stack

| Layer         | Technology                            |
|---------------|---------------------------------------|
| Frontend      | React 18, TailwindCSS, Recharts, Framer Motion |
| API Gateway   | Node.js 18, Express, Multer, Helmet   |
| ML Backend    | Python 3.10, Flask, TensorFlow 2.13   |
| ML Model      | MobileNetV2 (transfer learning)       |
| Dataset       | PlantVillage (54K images, 38 classes) |
| Deployment    | Docker, Docker Compose, Nginx         |

---

## ⚠️ Disclaimer

This tool is for educational purposes only. Always consult a certified agronomist for critical crop disease management decisions.

---

## 📄 License

MIT License — Free to use, modify, and distribute.
