/**
 * axios.js — Configured Axios instance for FinMind API calls
 * 
 * Features:
 *   - Base URL pointed at the Express backend.
 *   - Credentials enabled (sends httpOnly cookies automatically).
 *   - Request interceptor: attaches the Access Token to every request.
 *   - Response interceptor: on 401, silently tries to refresh the token
 *     and retries the original request once.
 */

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create a dedicated Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send cookies with every request
});

// ──────────────────────────────────────────────
// Request Interceptor — Attach Access Token
// ──────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ──────────────────────────────────────────────
// Response Interceptor — Silent Token Refresh
// ──────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 and if we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request until the refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt silent refresh (cookie is sent automatically)
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;
        localStorage.setItem("accessToken", newToken);

        // Retry queued requests
        processQueue(null, newToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed — clear token, user must log in again
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
