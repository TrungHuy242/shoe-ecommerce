// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor thêm token cho mọi request (trừ endpoint auth công khai)
api.interceptors.request.use(
  (config) => {
    const noAuthUrls = [
      "token/",
      "register/",
      "categories/",
      "genders/",
      "brands/",
      "products/",
    ];

    // Nếu url không thuộc danh sách công khai => thêm token
    if (!noAuthUrls.some((url) => config.url.includes(url))) {
      const token = localStorage.getItem("access_token"); // 🔥 đổi key cho đồng nhất
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;