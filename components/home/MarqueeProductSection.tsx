'use client';
import { useQuery } from '@tanstack/react-query';
import ProductCard, { ProductCardSkeleton } from '@/components/product/ProductCard';
import Link from 'next/link';
import type { Product } from '@/types';
import { productService } from '@/src/services/product.service';

interface MarqueeProductSectionProps {
    title: string;
    subtitle?: string;
    queryParams: any;
    viewAllHref?: string;
}

export default function MarqueeProductSection({ title, subtitle, queryParams, viewAllHref }: MarqueeProductSectionProps) {
    const { data, isLoading } = useQuery({
        queryKey: ['products-marquee', queryParams],
        queryFn: () => productService.getAll(queryParams),
    });

    const products: Product[] = data?.data || [];

    // Duplicate products to ensure they fill the screen at least twice for small arrays
    const list = products.length > 0 && products.length < 6
        ? [...products, ...products, ...products]
        : products;

    return (
        <section className="py-8 overflow-hidden">
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

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden rounded-2xl">
                {isLoading ? (
                    <div className="flex gap-4 min-w-max">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="w-[200px] sm:w-[240px] shrink-0">
                                <ProductCardSkeleton />
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="flex w-max hover:[animation-play-state:paused] pb-4 pt-2" style={{ animation: 'marquee 35s linear infinite' }}>
                        {/* First set */}
                        <div className="flex gap-4 pr-4">
                            {list.map((p, index) => (
                                <div key={`set1-${p.id}-${index}`} className="w-[200px] sm:w-[240px] shrink-0">
                                    <ProductCard product={p} />
                                </div>
                            ))}
                        </div>
                        {/* Second set (perfect clone for seamless loop) */}
                        <div className="flex gap-4 pr-4">
                            {list.map((p, index) => (
                                <div key={`set2-${p.id}-${index}`} className="w-[200px] sm:w-[240px] shrink-0">
                                    <ProductCard product={p} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-500 text-center py-8">Chưa có sản phẩm nổi bật</p>
                )}
            </div>
        </section>
    );
}
