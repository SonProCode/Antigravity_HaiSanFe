import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    withCredentials: true,
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

            // Only redirect if we are in the browser
            if (typeof window !== 'undefined') {
                // Remove local tokens just in case
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                // Dynamically import signOut to avoid SSR/Server Component issues in apiClient
                import('next-auth/react').then(({ signOut }) => {
                    signOut({ callbackUrl: '/auth/login?expired=true' });
                });
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
