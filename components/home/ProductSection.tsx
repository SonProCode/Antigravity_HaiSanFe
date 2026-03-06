'use client';
import { useQuery } from '@tanstack/react-query';
import ProductCard, { ProductCardSkeleton } from '@/components/product/ProductCard';
import Link from 'next/link';
import type { Product } from '@/types';

interface ProductSectionProps {
    title: string;
    subtitle?: string;
    queryParams: Record<string, string>;
    viewAllHref?: string;
}

async function fetchProducts(params: Record<string, string>) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`/api/products?${qs}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export default function ProductSection({ title, subtitle, queryParams, viewAllHref }: ProductSectionProps) {
    const { data, isLoading } = useQuery({
        queryKey: ['products', queryParams],
        queryFn: () => fetchProducts(queryParams),
    });

    const products: Product[] = data?.data || [];

    return (
        <section className="py-8">
            {/* Header */}
            <div className="flex items-end justify-between mb-5">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h2>
                    {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
                </div>
                {viewAllHref && (
                    <Link
                        href={viewAllHref}
                        className="text-ocean-600 hover:text-ocean-700 text-sm font-semibold transition-colors whitespace-nowrap"
                    >
                        Xem tất cả →
                    </Link>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {isLoading
                    ? Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)
                    : products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
        </section>
    );
}
