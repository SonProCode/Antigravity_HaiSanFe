'use client';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import ProductCard, { ProductCardSkeleton } from '@/components/product/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn, CATEGORY_LABELS, debounce } from '@/lib/utils';
import type { Product } from '@/types';

const CATEGORIES = ['all', 'tom', 'ca', 'muc', 'cua', 'premium'] as const;
const SORT_OPTIONS = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price_asc', label: 'Giá tăng dần' },
    { value: 'price_desc', label: 'Giá giảm dần' },
    { value: 'discount', label: 'Giảm giá nhiều nhất' },
];

async function fetchProducts(params: URLSearchParams) {
    const res = await fetch(`/api/products?${params.toString()}`);
    if (!res.ok) throw new Error('Lỗi tải sản phẩm');
    return res.json();
}

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = 12;

    function updateParams(updates: Record<string, string>) {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([k, v]) => {
            if (v) params.set(k, v);
            else params.delete(k);
        });
        router.push(`/products?${params.toString()}`);
    }

    // Debounced search
    const debouncedSearch = debounce((q: string) => {
        updateParams({ q, page: '1' });
    }, 300);

    useEffect(() => {
        debouncedSearch(searchInput);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    const queryParams = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(category !== 'all' && { category }),
        ...(sort && { sort }),
        ...(searchParams.get('q') && { q: searchParams.get('q')! }),
    });

    const { data, isLoading } = useQuery({
        queryKey: ['products-list', queryParams.toString()],
        queryFn: () => fetchProducts(queryParams),
    });

    const products: Product[] = data?.data || [];
    const total: number = data?.total || 0;
    const totalPages: number = data?.totalPages || 1;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Tất cả sản phẩm</h1>
                <p className="text-slate-500 text-sm mt-1">
                    {total > 0 ? `Hiển thị ${total} sản phẩm` : 'Đang tải...'}
                </p>
            </div>

            {/* Search bar */}
            <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-ocean-200 bg-ocean-50/50 focus:bg-white focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm transition-all"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Category chips */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => updateParams({ category: cat === 'all' ? '' : cat, page: '1' })}
                            className={cn(
                                'px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
                                (category === cat || (cat === 'all' && !searchParams.get('category')))
                                    ? 'bg-ocean-500 text-white border-ocean-500 shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-ocean-300 hover:text-ocean-600'
                            )}
                        >
                            {CATEGORY_LABELS[cat] || 'Tất cả'}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2 ml-auto">
                    <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                    <select
                        value={sort}
                        onChange={(e) => updateParams({ sort: e.target.value, page: '1' })}
                        className="border border-ocean-200 rounded-xl px-3 py-1.5 text-sm text-slate-600 bg-white focus:outline-none focus:border-ocean-400"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                {isLoading
                    ? Array.from({ length: pageSize }).map((_, i) => <ProductCardSkeleton key={i} />)
                    : products.length === 0
                        ? (
                            <div className="col-span-full text-center py-20">
                                <p className="text-5xl mb-4">🐠</p>
                                <p className="text-slate-500 font-medium text-lg">Không tìm thấy sản phẩm</p>
                                <p className="text-slate-400 text-sm mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                            </div>
                        )
                        : products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => updateParams({ page: String(page - 1) })}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:border-ocean-300 hover:text-ocean-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        ← Trước
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .reduce<(number | string)[]>((acc, p, i, arr) => {
                            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                            acc.push(p);
                            return acc;
                        }, [])
                        .map((p, i) =>
                            p === '...' ? (
                                <span key={`dots-${i}`} className="px-3 py-2 text-slate-400">•••</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => updateParams({ page: String(p) })}
                                    className={cn(
                                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                        page === p
                                            ? 'bg-ocean-500 text-white'
                                            : 'border border-slate-200 text-slate-600 hover:border-ocean-300 hover:text-ocean-600'
                                    )}
                                >
                                    {p}
                                </button>
                            )
                        )}

                    <button
                        disabled={page >= totalPages}
                        onClick={() => updateParams({ page: String(page + 1) })}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:border-ocean-300 hover:text-ocean-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Tiếp →
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div></div>}>
            <ProductsContent />
        </Suspense>
    );
}
