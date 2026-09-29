const express = require("express");
const router  = express.Router();

// In-memory history store (replace with a real DB for production)
const detectionHistory = [];

/**
 * GET /api/history
 * Returns recent detection records
 */
router.get("/", (req, res) => {
  const limit  = Math.min(parseInt(req.query.limit || "20"), 100);
  const page   = parseInt(req.query.page || "1");
  const offset = (page - 1) * limit;

  const paginated = detectionHistory.slice(offset, offset + limit);

  res.json({
    total:   detectionHistory.length,
    page,
    limit,
    records: paginated,
  });
});

/**
 * POST /api/history
 * Save a detection result to history (called internally by detection route)
 */
router.post("/", (req, res) => {
  const record = { ...req.body, saved_at: new Date().toISOString() };
  detectionHistory.unshift(record);
  if (detectionHistory.length > 500) detectionHistory.pop(); // cap at 500
  res.status(201).json({ message: "Saved", record });
});

/**
 * DELETE /api/history
 * Clear all history
 */
router.delete("/", (req, res) => {
  detectionHistory.length = 0;
  res.json({ message: "History cleared" });
});

module.exports = router;
