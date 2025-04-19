import axios from "axios";

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for handling requests
api.interceptors.request.use(
  (config) => {
    // You can add authentication tokens or other request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for handling responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here (e.g., 401 Unauthorized, 500 Server Error)
    return Promise.reject(error);
  },
);

export default api;
