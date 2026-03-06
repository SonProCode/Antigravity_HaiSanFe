import apiClient from './apiClient';
import { User } from '@/types';

export const mapUser = (u: any): User => ({
    id: u.id,
    email: u.email,
    name: u.name || 'Thành viên',
    image: u.image || null,
    role: (u.role as string)?.toLowerCase() as 'user' | 'admin',
    isActive: u.isActive,
    createdAt: u.createdAt,
    phone: u.phone || '',
    address: u.address || '',
});

export const userService = {
    async getAll(query: any = {}) {
        const response = await apiClient.get('/users', { params: query });
        const data = response.data;
        if (data && data.data) {
            data.data = data.data.map(mapUser);
        }
        return data;
    },

    async getById(id: string) {
        const response = await apiClient.get(`/users/${id}`);
        return mapUser(response.data);
    },

    async update(id: string, data: any) {
        const response = await apiClient.patch(`/users/${id}`, data);
        return mapUser(response.data);
    },

    async delete(id: string) {
        const response = await apiClient.delete(`/users/${id}`);
        return response.data;
    },
};
