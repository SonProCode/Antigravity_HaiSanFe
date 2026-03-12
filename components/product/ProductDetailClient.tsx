'use client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Star, Shield, RotateCcw, Truck, Zap, ShoppingCart, ChevronLeft, ChevronRight, CheckSquare, Square } from 'lucide-react';
import type { Product } from '@/types';
import { ProductCardSkeleton } from '@/components/product/ProductCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { productService } from '@/src/services/product.service';

export default function ProductDetailClient({ slug }: { slug: string }) {
    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => productService.getBySlug(slug),
    });

    const addItem = useCartStore((s) => s.addItem);
    const setOpen = useCartStore((s) => s.setOpen);
    const router = useRouter();

    const [selectedImage, setSelectedImage] = useState(0);
    const [weight, setWeight] = useState(1);
    const [addedUpsell, setAddedUpsell] = useState<Record<string, boolean>>({});
    const [adding, setAdding] = useState(false);

    if (isLoading) return <ProductDetailSkeleton />;
    if (error || !product) return (
        <div className="min-h-96 flex flex-col items-center justify-center text-center px-4">
            <p className="text-5xl mb-4">🐠</p>
            <h2 className="text-xl font-bold text-slate-700">Không tìm thấy sản phẩm</h2>
            <Link href="/products" className="mt-4 px-6 py-2 bg-ocean-500 text-white rounded-full text-sm font-semibold hover:bg-ocean-600">
                Xem sản phẩm khác
            </Link>
        </div>
    );

    const displayPrice = product.salePrice || product.price;
    const totalPrice = Math.round(displayPrice * weight * 100) / 100;
    const maxWeight = product.inventoryKg;

    function handleWeightChange(val: number) {
        const clamped = Math.min(Math.max(Math.round(val * 10) / 10, 0.1), maxWeight);
        setWeight(clamped);
    }

    function handleAddToCart() {
        if (!product) return;
        if (weight <= 0 || weight > maxWeight) return;
        setAdding(true);
        addItem({
            productId: product.id,
            productName: product.name,
            productImage: product.images[0],
            slug: product.slug,
            weight,
            pricePerKg: displayPrice,
            totalPrice: Math.round(displayPrice * weight),
        });

        // Also add checked upsell products
        if (product.relatedProducts?.length) {
            product.relatedProducts.slice(0, 6).forEach((p: Product) => {
                if (addedUpsell[p.id]) {
                    addItem({
                        productId: p.id,
                        productName: (p as unknown as { name: string }).name,
                        productImage: (p as unknown as { images: string[] }).images[0],
                        slug: (p as unknown as { slug: string }).slug,
                        weight: 0.5,
                        pricePerKg: (p as unknown as { salePrice: number; price: number }).salePrice || (p as unknown as { price: number }).price,
                        totalPrice: Math.round(((p as unknown as { salePrice: number; price: number }).salePrice || (p as unknown as { price: number }).price) * 0.5),
                    });
                }
            });
        }

        setTimeout(() => { setAdding(false); setOpen(true); }, 500);
    }

    function handleBuyNow() {
        handleAddToCart();
        router.push('/checkout');
    }

    const images = product.images || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link href="/" className="hover:text-ocean-600 transition-colors">Trang chủ</Link>
                <span>/</span>
                <Link href="/products" className="hover:text-ocean-600 transition-colors">Sản phẩm</Link>
                <span>/</span>
                <span className="text-slate-800 font-medium line-clamp-1">{product.name}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* LEFT: Gallery */}
                <div>
                    {/* Main Image */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-ocean-50 mb-3">
                        <Image
                            src={images[selectedImage] || '/placeholder.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Nav arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setSelectedImage((i) => (i - 1 + images.length) % images.length)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setSelectedImage((i) => (i + 1) % images.length)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-all"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}

                        {/* BAO RẺ badge */}
                        {product.isBaoRe && (
                            <div className="absolute bottom-3 left-3">
                                <span className="px-3 py-1.5 bg-ocean-600 text-white text-sm font-bold rounded-lg">BAO RẺ 🔥</span>
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {images.map((img: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${selectedImage === i ? 'border-ocean-500' : 'border-transparent hover:border-ocean-300'
                                    }`}
                            >
                                <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Info */}
                <div>
                    {/* Title & ID */}
                    <div className="mb-4">
                        <div className="flex gap-2 flex-wrap mb-2">
                            {product.isNew && <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">NEW</span>}
                            {product.bestSeller && <span className="px-2 py-0.5 bg-ocean-500 text-white text-xs font-bold rounded-full">Bán chạy</span>}
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 leading-tight">{product.name}</h1>
                        <p className="text-slate-400 text-sm mt-1">Mã SP: {product.id}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                            ))}
                        </div>
                        <span className="text-sm text-slate-600 font-medium">{product.rating}</span>
                        <span className="text-slate-400 text-sm">({formatNumber(product.reviewCount)} đánh giá)</span>
                        <span className="text-slate-400 text-sm">•</span>
                        <span className="text-slate-500 text-sm">Đã bán {formatNumber(product.soldCount)}</span>
                    </div>

                    {/* Specs */}
                    <div className="bg-ocean-50 rounded-xl p-4 mb-5 text-sm space-y-2">
                        <div className="flex gap-2"><span className="text-slate-500 w-28">Trạng thái:</span><span className="font-medium text-green-600">Còn hàng ({product.inventoryKg}kg)</span></div>
                        <div className="flex gap-2"><span className="text-slate-500 w-28">Xuất xứ:</span><span className="font-medium">{product.origin}</span></div>
                        <div className="flex gap-2"><span className="text-slate-500 w-28">Bảo quản:</span><span className="font-medium">{product.preservation}</span></div>
                        <div className="flex gap-2"><span className="text-slate-500 w-28">Quy cách:</span><span className="font-medium">{product.specification}</span></div>
                    </div>

                    {/* Price */}
                    <div className="mb-5">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-ocean-600">{formatCurrency(displayPrice)}</span>
                            <span className="text-slate-500 text-base">/ kg</span>
                            {product.salePrice && (
                                <span className="text-slate-400 text-lg line-through">{formatCurrency(product.price)}</span>
                            )}
                            {product.percentOff && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-sm font-bold rounded">-{product.percentOff}%</span>
                            )}
                        </div>
                    </div>

                    {/* Weight input */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Khối lượng mong muốn (kg):
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-ocean-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => handleWeightChange(weight - 0.1)}
                                    className="px-4 py-2.5 bg-ocean-50 hover:bg-ocean-100 text-slate-600 font-bold transition-colors text-lg"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    max={maxWeight}
                                    value={weight}
                                    onChange={(e) => handleWeightChange(parseFloat(e.target.value))}
                                    className="w-20 text-center py-2.5 font-semibold text-slate-800 outline-none border-none text-base"
                                />
                                <button
                                    onClick={() => handleWeightChange(weight + 0.1)}
                                    className="px-4 py-2.5 bg-ocean-50 hover:bg-ocean-100 text-slate-600 font-bold transition-colors text-lg"
                                >
                                    +
                                </button>
                            </div>
                            <span className="text-sm text-slate-500">kg (tối đa {maxWeight}kg)</span>
                        </div>

                        {/* Total price */}
                        <div className="mt-3 p-3 bg-ocean-50 rounded-xl">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Tổng tiền ({weight}kg × {formatCurrency(displayPrice)}/kg):</span>
                                <span className="text-xl font-bold text-ocean-600">{formatCurrency(totalPrice)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={handleAddToCart}
                            disabled={adding}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-ocean-50 hover:bg-ocean-100 border-2 border-ocean-400 text-ocean-700 font-bold rounded-xl transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {adding ? 'Đã thêm ✓' : 'Thêm vào giỏ'}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-ocean-500 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md"
                        >
                            <Zap className="w-5 h-5" />
                            Mua ngay
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {[
                            { icon: Shield, text: 'Thanh toán an toàn' },
                            { icon: RotateCcw, text: 'Đổi trả nhà FREE' },
                            { icon: Truck, text: 'Giao hàng 2H' },
                            { icon: Star, text: 'Nguồn gốc rõ ràng' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg p-2">
                                <Icon className="w-4 h-4 text-ocean-500 shrink-0" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="font-bold text-slate-800 mb-2">Mô tả sản phẩm</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Upsell */}
                    {(product.relatedProducts?.length ?? 0) > 0 && (
                        <div className="border border-ocean-100 rounded-xl p-4">
                            <h3 className="font-bold text-slate-800 mb-3">THƯỜNG ĐƯỢC MUA CÙNG</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {product.relatedProducts!.slice(0, 6).map((p: any) => (
                                    <label key={p.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-ocean-50 transition-colors">
                                        <button
                                            onClick={() => setAddedUpsell((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
                                            className="shrink-0"
                                        >
                                            {addedUpsell[p.id]
                                                ? <CheckSquare className="w-4 h-4 text-ocean-500" />
                                                : <Square className="w-4 h-4 text-slate-400" />}
                                        </button>
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                            <Image src={p.images[0]} alt={(p as unknown as { name: string }).name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-700 line-clamp-1">{(p as unknown as { name: string }).name}</p>
                                            <p className="text-xs text-ocean-600 font-semibold">{formatCurrency(p.salePrice || (p as unknown as { price: number }).price)}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-ocean-100">
                                <span className="text-sm text-slate-600">
                                    Tổng tiền: <strong className="text-ocean-600">
                                        {formatCurrency(Object.entries(addedUpsell)
                                            .filter(([, v]) => v)
                                            .reduce((sum, [id]) => {
                                                const p = product.relatedProducts?.find((p: { id: string }) => p.id === id) as { salePrice?: number; price: number };
                                                return sum + (p?.salePrice || p?.price || 0) * 0.5;
                                            }, 0))}
                                    </strong>
                                </span>
                                <button
                                    onClick={handleAddToCart}
                                    className="px-4 py-2 bg-ocean-500 text-white text-sm font-semibold rounded-lg hover:bg-ocean-600 transition-colors"
                                >
                                    Thêm {Object.values(addedUpsell).filter(Boolean).length}sp mua cùng
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews section */}
            {(product.reviews?.length ?? 0) > 0 && (
                <div className="mt-12 border-t border-ocean-100 pt-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">
                        Đánh giá sản phẩm ({product.reviews!.length})
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {product.reviews!.slice(0, 6).map((review: { id: string; userName: string; rating: number; comment: string; createdAt: string }) => (
                            <div key={review.id} className="bg-ocean-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-ocean-200 flex items-center justify-center text-ocean-700 font-bold text-sm">
                                        {review.userName?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{review.userName}</p>
                                        <div className="flex">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">{review.comment}</p>
                                <p className="text-xs text-slate-400 mt-2">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ProductDetailSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-8">
            <div>
                <div className="aspect-square skeleton rounded-2xl mb-3" />
                <div className="flex gap-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="w-16 h-16 skeleton rounded-xl" />)}</div>
            </div>
            <div className="space-y-4">
                <div className="skeleton h-8 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-24 w-full rounded-xl" />
                <div className="skeleton h-12 w-1/3" />
                <div className="skeleton h-16 w-full rounded-xl" />
                <div className="flex gap-3"><div className="skeleton h-12 flex-1 rounded-xl" /><div className="skeleton h-12 flex-1 rounded-xl" /></div>
            </div>
        </div>
    );
}
