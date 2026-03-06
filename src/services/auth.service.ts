import apiClient from './apiClient';

export const authService = {
    async login(credentials: any) {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data;
    },

    async register(data: any) {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    async logout() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            await apiClient.post('/auth/logout', { refreshToken });
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    },

    async getMe() {
        const response = await apiClient.get('/users/me');
        return response.data;
    },
};
