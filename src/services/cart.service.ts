import apiClient from './apiClient';
import { CartItem } from '@/types';

export const mapCartItem = (item: any): CartItem => ({
    id: item.id,
    productId: item.productId,
    productName: item.product?.name || 'Sản phẩm',
    productImage: item.product?.images?.[0]?.url || '/placeholder.jpg',
    slug: item.product?.slug || '',
    weight: Number(item.weightKg),
    pricePerKg: Number(item.pricePerKg),
    totalPrice: Number(item.totalPrice),
});

export const cartService = {
    async getCart() {
        const response = await apiClient.get('/carts');
        const cart = response.data;
        if (cart && cart.items) {
            cart.items = cart.items.map(mapCartItem);
        }
        return cart;
    },

    async addToCart(productId: string, weightKg: number) {
        const response = await apiClient.post('/carts', { productId, weightKg });
        const cart = response.data;
        if (cart && cart.items) {
            cart.items = cart.items.map(mapCartItem);
        }
        return cart;
    },

    async updateItem(itemId: string, weightKg: number) {
        const response = await apiClient.patch(`/carts/${itemId}`, { weightKg });
        const cart = response.data;
        if (cart && cart.items) {
            cart.items = cart.items.map(mapCartItem);
        }
        return cart;
    },

    async removeItem(itemId: string) {
        const response = await apiClient.delete(`/carts/${itemId}`);
        return response.data;
    },

    async clearCart() {
        const response = await apiClient.delete('/carts');
        return response.data;
    }
};
