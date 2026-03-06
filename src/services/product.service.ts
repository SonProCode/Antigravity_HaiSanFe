import apiClient from './apiClient';
import { Product, PaginatedResponse } from '@/types';

export interface ProductQuery {
    page?: number;
    pageSize?: number;
    category?: string;
    q?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
}

const mapProduct = (p: any): Product => ({
    ...p,
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category?.toLowerCase() || 'other',
    description: p.description || '',
    shortDescription: p.description?.substring(0, 100) || '',
    images: p.images?.map((img: any) => img.url) || [],
    price: Number(p.price),
    salePrice: p.originalPrice ? Number(p.price) : null,
    percentOff: p.percentOff,
    inventoryKg: Number(p.inventoryKg),
    soldCount: p.soldCount || 0,
    bestSeller: p.isBestSeller || false,
    rating: Number(p.ratingAvg) || 0,
    reviewCount: p.reviews?.length || 0,
    origin: 'Quảng Ninh',
    preservation: 'Cấp đông / Tươi sống',
    specification: 'Đóng khay / Hút chân không',
    createdAt: p.createdAt,
});

export const productService = {
    async getAll(query: ProductQuery = {}): Promise<PaginatedResponse<Product>> {
        const response = await apiClient.get('/products', { params: query });
        return {
            ...response.data,
            data: response.data.data.map(mapProduct)
        };
    },

    async getBySlug(slug: string): Promise<Product> {
        const response = await apiClient.get(`/products/${slug}`);
        return mapProduct(response.data);
    },

    async getCategories() {
        return ['tom', 'ca', 'muc', 'cua', 'premium'];
    },

    async getBestSellers() {
        return this.getAll({ sortBy: 'soldCount', order: 'desc', pageSize: 4 });
    },

    mapProduct // Export for use in other services if needed
};
