'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
    product: Product;
    className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem);
    const [adding, setAdding] = useState(false);

    const [imgError, setImgError] = useState(false);
    const fallbackImage = 'https://images.unsplash.com/photo-1551462147-37885acc3c41?q=80&w=800'; // Reliable seafood placeholder

    const displayPrice = product.salePrice || product.price;
    const hasDiscount = !!product.salePrice && product.salePrice < product.price;

    async function handleAddToCart(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setAdding(true);
        try {
            await addItem({
                productId: product.id,
                productName: product.name,
                productImage: product.images[0] || fallbackImage,
                slug: product.slug,
                weight: 1,
                pricePerKg: displayPrice,
                totalPrice: displayPrice,
            });
            toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
        } finally {
            setAdding(false);
        }
    }

    return (
        <Link
            href={`/products/${product.slug}`}
            className={cn('product-card group bg-white rounded-2xl overflow-hidden border border-slate-100 block', className)}
        >
            {/* Image container */}
            <div className="relative aspect-square bg-ocean-50 overflow-hidden">
                <Image
                    src={imgError ? fallbackImage : (product.images[0] || fallbackImage)}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    onError={() => {
                        console.log(`Image failed for ${product.name}: ${product.images[0]}`);
                        setImgError(true);
                    }}
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                            NEW
                        </span>
                    )}
                    {product.bestSeller && (
                        <span className="px-2 py-0.5 bg-ocean-500 text-white text-[10px] font-bold rounded-full">
                            Bán chạy
                        </span>
                    )}
                </div>

                {hasDiscount && product.percentOff && (
                    <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                            -{product.percentOff}%
                        </span>
                    </div>
                )}

                {/* BAO RẺ badge */}
                {product.isBaoRe && (
                    <div className="absolute bottom-2 left-2">
                        <span className="px-2 py-1 bg-ocean-600 text-white text-[11px] font-bold rounded flex items-center gap-1">
                            BAO RẺ 🔥
                        </span>
                    </div>
                )}

                {/* Quick add to cart */}
                <button
                    onClick={handleAddToCart}
                    className={cn(
                        'absolute bottom-2 right-2 w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-all duration-200',
                        adding
                            ? 'bg-green-500 scale-90'
                            : 'bg-orange-500 hover:bg-orange-600 hover:scale-110'
                    )}
                    aria-label="Thêm vào giỏ"
                >
                    <ShoppingCart className="w-4 h-4 text-white" />
                </button>
            </div>

            {/* Content */}
            <div className="p-3">
                <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2 min-h-[2.5rem]">
                    {product.name}
                </h3>

                {/* Price */}
                <div className="mb-1.5">
                    <span className="text-ocean-600 font-bold text-base">
                        {formatCurrency(displayPrice)}
                    </span>
                    <span className="text-slate-400 text-xs ml-1">/ kg</span>
                </div>

                {hasDiscount && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-slate-400 text-xs line-through">
                            {formatCurrency(product.price)}
                        </span>
                    </div>
                )}

                {/* Rating & Sold */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                    </div>
                    <span>•</span>
                    <span>Đã bán {formatNumber(product.soldCount)}</span>
                </div>
            </div>
        </Link>
    );
}

// Skeleton loader
export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
            <div className="aspect-square skeleton" />
            <div className="p-3 space-y-2">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-5 w-1/2" />
                <div className="skeleton h-3 w-2/3" />
            </div>
        </div>
    );
}
