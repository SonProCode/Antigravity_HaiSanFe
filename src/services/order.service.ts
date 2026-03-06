import apiClient from './apiClient';
import { Order } from '@/types';

const mapOrder = (o: any): Order => ({
    id: o.id,
    orderId: o.orderCode,
    userId: o.userId,
    items: o.items?.map((item: any) => ({
        productId: item.productId,
        productName: item.product?.name || 'Sản phẩm',
        productImage: item.product?.images?.[0]?.url || '',
        weight: Number(item.weightKg),
        pricePerKg: Number(item.pricePerKg),
        totalPrice: Number(item.totalPrice),
    })) || [],
    shipping: {
        name: o.customerName,
        phone: o.customerPhone,
        ...(typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : o.shippingAddress),
        note: o.note,
    },
    paymentMethod: o.paymentMethod?.toLowerCase() || 'cod',
    subtotal: Number(o.subtotal),
    shippingFee: Number(o.shippingFee),
    total: Number(o.total),
    status: (o.status?.toLowerCase() as any) || 'pending',
    statusTimeline: o.statusTimeline || [],
    createdAt: o.createdAt,
});

export const orderService = {
    async create(orderData: any): Promise<Order> {
        const response = await apiClient.post('/orders', orderData);
        return mapOrder(response.data);
    },

    async getMyOrders(): Promise<Order[]> {
        const response = await apiClient.get('/orders/me');
        return response.data.map(mapOrder);
    },

    async track(orderCode: string): Promise<Order> {
        const response = await apiClient.get(`/orders/track/${orderCode}`);
        return mapOrder(response.data);
    },

    mapOrder
};
