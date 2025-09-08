import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Chỉ thêm token cho các endpoint cần xác thực (tránh /token/, /register/, /products/, /categories/, /genders/, /sizes/, /colors/)
    if (config.url.includes('token') || config.url.includes('register') || config.url.includes('products') || config.url.includes('categories') || config.url.includes('genders') || config.url.includes('sizes') || config.url.includes('colors')) {
      return config;
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;