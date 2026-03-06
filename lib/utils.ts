import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    }).format(amount);
}

export function formatNumber(num: number): string {
    return new Intl.NumberFormat('vi-VN').format(num);
}

export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export function generateOrderId(): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `HAI-${year}-${random}`;
}

export function calculatePercentOff(price: number, salePrice: number): number {
    return Math.round(((price - salePrice) / price) * 100);
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export function formatWeight(kg: number): string {
    if (kg < 1) {
        return `${(kg * 1000).toFixed(0)}g`;
    }
    return `${kg.toFixed(1)}kg`;
}

export const CATEGORY_LABELS: Record<string, string> = {
    tom: 'Tôm',
    ca: 'Cá',
    muc: 'Mực',
    cua: 'Cua',
    premium: 'Cao cấp',
    all: 'Tất cả',
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    packed: 'Đóng gói',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-50',
    confirmed: 'text-blue-600 bg-blue-50',
    packed: 'text-purple-600 bg-purple-50',
    shipped: 'text-orange-600 bg-orange-50',
    delivered: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50',
};
