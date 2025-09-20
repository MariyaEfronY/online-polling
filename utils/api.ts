// utils/api.ts
import axios, { InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // ✅ adjust if backend runs elsewhere
});

// Add interceptor for Authorization header
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      // ✅ Use .set() (Axios v1+) instead of reassigning headers
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
