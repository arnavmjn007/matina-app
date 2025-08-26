import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
});

// This is an interceptor. It runs before every request.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Add the token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;