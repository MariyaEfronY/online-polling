import axios from "axios";

// Dynamically set API base URL
const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const API = axios.create({
  baseURL,
});

// Attach token to every request if available
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
