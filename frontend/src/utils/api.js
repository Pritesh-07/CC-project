import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, clear user data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/faculty-login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;