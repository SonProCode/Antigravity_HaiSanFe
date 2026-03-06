import apiClient from './apiClient';
import { productService } from './product.service';
import { orderService } from './order.service';

export const adminService = {
    async getStats() {
        const response = await apiClient.get('/admin/stats');
        return response.data;
    },

    async getRevenue(period: 'day' | 'week' | 'month' = 'month') {
        const response = await apiClient.get('/admin/revenue', { params: { period } });
        return response.data;
    },

    // Products CRUD for Admin
    async getProducts(query: any = {}) {
        const response = await apiClient.get('/products', { params: { ...query, admin: true } });
        return {
            ...response.data,
            data: response.data.data.map((productService as any).mapProduct)
        };
    },

    async createProduct(data: any) {
        const response = await apiClient.post('/products', data);
        return (productService as any).mapProduct(response.data);
    },

    async updateProduct(id: string, data: any) {
        const response = await apiClient.patch(`/products/${id}`, data);
        return (productService as any).mapProduct(response.data);
    },

    async deleteProduct(id: string) {
        const response = await apiClient.delete(`/products/${id}`);
        return response.data;
    },

    // Orders CRUD for Admin
    async getOrders(query: any = {}) {
        const response = await apiClient.get('/orders', { params: query });
        return {
            ...response.data,
            data: response.data.data.map((orderService as any).mapOrder)
        };
    },

    async updateOrderStatus(id: string, status: string, note?: string) {
        const response = await apiClient.patch(`/orders/${id}/status`, { status, note });
        return (orderService as any).mapOrder(response.data);
    },
};
