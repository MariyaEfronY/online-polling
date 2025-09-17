// utils/api.ts
import axios, { InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // adjust if backend URL changes
});

// Interceptor for attaching JWT token
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
