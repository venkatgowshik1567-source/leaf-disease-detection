/**
 * Global error handler middleware for Express.
 * Must be registered LAST, after all routes.
 */
function errorHandler(err, req, res, next) {  // eslint-disable-line no-unused-vars
  const status  = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  }

  res.status(status).json({
    error:   message,
    path:    req.path,
    method:  req.method,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
