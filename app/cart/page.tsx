'use client';
import { useCartStore } from '@/store/cart';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Package, ShoppingCart, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function CartPage() {
    const { items, removeItem, updateItemWeight, getTotal, clearCart } = useCartStore();
    const total = getTotal();
    const shippingFee = total >= 500000 ? 0 : 30000;
    const grandTotal = total + shippingFee;

    if (items.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <Package className="w-16 h-16 text-ocean-200 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-slate-700 mb-2">Giỏ hàng trống</h1>
                <p className="text-slate-500 mb-6">Hãy thêm sản phẩm vào giỏ để tiếp tục mua sắm</p>
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-ocean-500 text-white font-semibold rounded-full hover:bg-ocean-600 transition-colors"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Mua sắm ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Giỏ hàng ({items.length} sản phẩm)</h1>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Items */}
                <div className="lg:col-span-2 space-y-3">
                    {items.map((item) => (
                        <CartItemRow
                            key={item.productId}
                            item={item}
                            onRemove={() => removeItem(item.productId)}
                            onUpdateWeight={(w) => updateItemWeight(item.productId, w)}
                        />
                    ))}

                    <button
                        onClick={clearCart}
                        className="text-sm text-red-500 hover:text-red-600 transition-colors mt-2"
                    >
                        Xóa tất cả
                    </button>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-2xl border border-ocean-100 p-5 h-fit sticky top-20">
                    <h2 className="font-bold text-slate-800 mb-4">Tóm tắt đơn hàng</h2>

                    <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between text-slate-600">
                            <span>Tạm tính</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Phí vận chuyển</span>
                            <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                                {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                            </span>
                        </div>
                    </div>

                    {total < 500000 && (
                        <div className="bg-ocean-50 rounded-xl p-3 mb-4 text-xs text-ocean-700">
                            🚚 Mua thêm <strong>{formatCurrency(500000 - total)}</strong> để được miễn phí vận chuyển
                        </div>
                    )}

                    <div className="flex justify-between font-bold text-slate-800 border-t border-ocean-100 pt-4 mb-4">
                        <span>Tổng cộng</span>
                        <span className="text-ocean-600 text-lg">{formatCurrency(grandTotal)}</span>
                    </div>

                    <Link
                        href="/checkout"
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-ocean-500 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md"
                    >
                        Thanh toán
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link href="/products" className="block text-center text-sm text-slate-500 hover:text-ocean-600 mt-3 transition-colors">
                        ← Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        </div>
    );
}

function CartItemRow({
    item,
    onRemove,
    onUpdateWeight,
}: {
    item: { productId: string; productName: string; productImage: string; weight: number; pricePerKg: number; totalPrice: number };
    onRemove: () => void;
    onUpdateWeight: (w: number) => void;
}) {
    const [weight, setWeight] = useState(item.weight);

    function handleChange(newW: number) {
        if (newW < 0.1) return;
        const rounded = Math.round(newW * 10) / 10;
        setWeight(rounded);
        onUpdateWeight(rounded);
    }

    return (
        <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-1">{item.productName}</h3>
                <p className="text-xs text-slate-500 mb-2">{formatCurrency(item.pricePerKg)}/kg</p>

                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-ocean-200 rounded-lg">
                        <button onClick={() => handleChange(weight - 0.1)} className="px-3 py-1.5 hover:bg-ocean-50 text-slate-600 font-medium">-</button>
                        <input
                            type="number"
                            value={weight}
                            step="0.1"
                            min="0.1"
                            onChange={(e) => handleChange(parseFloat(e.target.value))}
                            className="w-16 text-center text-sm font-semibold outline-none py-1.5"
                        />
                        <button onClick={() => handleChange(weight + 0.1)} className="px-3 py-1.5 hover:bg-ocean-50 text-slate-600 font-medium">+</button>
                    </div>
                    <span className="text-xs text-slate-400">kg</span>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between">
                <button onClick={onRemove} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
                <span className="font-bold text-ocean-600 text-sm">{formatCurrency(item.totalPrice)}</span>
            </div>
        </div>
    );
}
