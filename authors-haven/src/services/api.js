import axios from 'axios';
import { auth } from '../firebase'; // Import firebase auth

const api = axios.create({
    baseURL: '/api', // Vite proxy handles the rest
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;
        if (user) {
            // Get the Firebase ID token
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
