// src/services/api.js
import axios from "axios";

// Get API URL from environment variable or use default
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Interceptor thêm token cho mọi request (trừ endpoint auth công khai)
api.interceptors.request.use(
  (config) => {
    const noAuthUrls = [
      "token/",
      "register/",
    ];

    // Các endpoint chỉ cần auth cho POST/PUT/PATCH/DELETE, GET thì không cần
    const readOnlyEndpoints = [
      "categories/",
      "genders/", 
      "brands/",
      "sizes/",
      "colors/",
      "products/"
    ];
    
    // Nếu là GET request đến read-only endpoints thì không cần token
    const isReadOnlyGet = config.method === 'get' && 
      readOnlyEndpoints.some(endpoint => config.url.includes(endpoint));

    // Nếu url không thuộc danh sách công khai và không phải GET read-only => thêm token
    if (!noAuthUrls.some((url) => config.url.includes(url)) && !isReadOnlyGet) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;