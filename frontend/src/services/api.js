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
    // Nếu đang gửi FormData (multipart/form-data), xóa Content-Type header
    // để axios tự động set với boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    const noAuthUrls = [
      "token/",
      "register/",
    ];

    // Các endpoint THỰC SỰ chỉ cần auth cho POST/PUT/PATCH/DELETE, GET thì không cần
    const readOnlyEndpoints = [
      "categories/",
      "genders/", 
      "brands/",
      "sizes/",
      "colors/",
      "products/",
      "promotions/"
      // BỎ "orders/" và "notifications/" vì cần auth cho cả GET
      // BỎ "cart-items/" và "carts/" vì cần auth cho cả GET
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

// Interceptor xử lý response và refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem("access_token", newAccessToken);

          // Retry request với token mới
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token cũng hết hạn, redirect về login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;