import axios from 'axios';
import type { AxiosInstance } from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Add request interceptor for common headers or tokens
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Add response interceptor for common error handling
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
