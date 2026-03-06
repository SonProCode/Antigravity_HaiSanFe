import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for adding Auth Token
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Add Session ID for Guest Cart
            const sessionId = localStorage.getItem('sessionId');
            if (sessionId) {
                config.headers['x-session-id'] = sessionId;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor for handling Token Expiry and errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Logical for Refresh Token would go here if implemented in frontend state
            // For now, just clear and redirect if unauthorized on sensitive routes
        }

        return Promise.reject(error);
    }
);

export default apiClient;
