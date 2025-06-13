import axios from 'axios'
import { useAuth } from './contexts/AuthContext'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 10000,
})

// Intercepteur pour ajouter le token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Intercepteur pour rafraîchir le token
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post('/api/auth/token/refresh/', { refresh: refreshToken });
                
                localStorage.setItem('access_token', response.data.access);
                api.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch (err) {
                console.error('Refresh token failed', err);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;