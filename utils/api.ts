// utils/api.ts
import axios, { AxiosRequestHeaders } from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // ✅ point to your Next.js API routes
});

// ✅ Interceptor to attach token if available
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = {
          ...(config.headers as AxiosRequestHeaders),
          Authorization: `Bearer ${token}`,
        };
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
