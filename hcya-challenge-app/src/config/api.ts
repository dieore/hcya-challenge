import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import { store } from '../store/store';
import { showSnackbar } from '../store/snackbar/snackbarSlice';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000
});

// Add request interceptor for common headers or tokens
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Add response interceptor for common error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const errorMessage = (error.response?.data as { message?: string })?.message || error.message || 'An error occurred';
    store.dispatch(showSnackbar({
      message: errorMessage,
      severity: 'error',
    }));
    return Promise.reject(error);
  }
);

export default api;
