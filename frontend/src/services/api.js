import axios from "axios";

// Node.js API Gateway base URL
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

// Request interceptor for logging
apiClient.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor for error normalization
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      (error.code === "ECONNABORTED" ? "Request timed out. Please try again." : "Network error. Is the server running?");
    return Promise.reject(new Error(message));
  }
);

/**
 * Sends a leaf image to the Node.js API gateway for disease detection.
 * @param {File} imageFile - The leaf image file
 * @returns {Promise<DetectionResult>}
 */
export async function detectDisease(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  return apiClient.post("/detect", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * Fetches detection history from the server (if persisted server-side).
 * @param {number} limit
 */
export async function getHistory(limit = 20) {
  return apiClient.get(`/history?limit=${limit}`);
}

/**
 * Health check endpoint
 */
export async function healthCheck() {
  return apiClient.get("/health");
}
