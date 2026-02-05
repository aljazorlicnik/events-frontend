import axios from 'axios';
import { storage } from '../utils/storage';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for attaching the Bearer token
apiClient.interceptors.request.use(
    (config) => {
        const token = storage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling 401 Unauthorized
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
            // Clear token and redirect to login
            storage.clearToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
