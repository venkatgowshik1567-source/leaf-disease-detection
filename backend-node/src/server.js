require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const morgan     = require("morgan");
const rateLimit  = require("express-rate-limit");
const path       = require("path");

const detectionRoutes = require("./routes/detection");
const historyRoutes   = require("./routes/history");
const { errorHandler } = require("./middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Security ─────────────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
}));

// ─── Rate Limiting ────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),  // 15 min
  max:      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message:  { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders:   false,
});
app.use("/api/", limiter);

// Stricter limit for detect endpoint
const detectLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 10,
  message: { error: "Too many detection requests. Please wait a minute." },
});
app.use("/api/detect", detectLimiter);

// ─── Parsing & Logging ────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── Static Uploads (optional) ───────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const chatbotRoutes   = require("./routes/chatbot");

// ─── Routes ───────────────────────────────────────────────
app.use("/api/detect",  detectionRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/chat",    chatbotRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status:      "ok",
    service:     "LeafGuard Node.js API Gateway",
    version:     "1.0.0",
    timestamp:   new Date().toISOString(),
    pythonApi:   process.env.PYTHON_API_URL,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  LeafGuard API Gateway running on http://localhost:${PORT}`);
  console.log(`🐍  Python ML Backend: ${process.env.PYTHON_API_URL || "http://localhost:8000"}`);
  console.log(`🌿  Environment: ${process.env.NODE_ENV || "development"}\n`);
});

module.exports = app;
