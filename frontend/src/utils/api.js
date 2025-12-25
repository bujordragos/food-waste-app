import axios from 'axios';

const api = axios.create({
    // use env var or fallback for dev
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

// add token to requests if we have one
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
