'use client';
import { useCartStore } from '@/store/cart';
import { X, ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, formatWeight } from '@/lib/utils';
import { useState } from 'react';

export default function CartDrawer() {
    const { items, isOpen, setOpen, removeItem, updateItemWeight, getTotal, clearCart } = useCartStore();
    const total = getTotal();
    const shippingFee = total >= 500000 ? 0 : 30000;

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-ocean-100">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-ocean-600" />
                        <h2 className="font-bold text-slate-800 text-lg">Giỏ hàng</h2>
                        <span className="px-2 py-0.5 bg-ocean-100 text-ocean-700 text-xs font-semibold rounded-full">
                            {items.length}
                        </span>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <Package className="w-16 h-16 text-ocean-200 mb-4" />
                            <p className="text-slate-500 font-medium">Giỏ hàng trống</p>
                            <p className="text-slate-400 text-sm mt-1">Thêm sản phẩm để bắt đầu mua sắm</p>
                            <Link
                                href="/products"
                                onClick={() => setOpen(false)}
                                className="mt-4 px-6 py-2.5 bg-ocean-500 text-white rounded-full text-sm font-semibold hover:bg-ocean-600 transition-colors"
                            >
                                Xem sản phẩm
                            </Link>
                        </div>
                    ) : (
                        items.map((item) => (
                            <CartItem
                                key={item.productId}
                                item={item}
                                onRemove={() => removeItem(item.productId)}
                                onUpdateWeight={(w) => updateItemWeight(item.productId, w)}
                            />
                        ))
                    )}
                </div>

                {/* Summary */}
                {items.length > 0 && (
                    <div className="border-t border-ocean-100 p-4 space-y-3">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Tạm tính</span>
                            <span className="font-medium">{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Phí vận chuyển</span>
                            <span className={shippingFee === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                                {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                            </span>
                        </div>
                        {total < 500000 && (
                            <p className="text-xs text-ocean-600 bg-ocean-50 rounded-lg px-3 py-2">
                                🚚 Mua thêm <strong>{formatCurrency(500000 - total)}</strong> để được miễn phí ship
                            </p>
                        )}
                        <div className="flex justify-between font-bold text-slate-800 border-t border-ocean-100 pt-3">
                            <span>Tổng cộng</span>
                            <span className="text-ocean-600 text-lg">{formatCurrency(total + shippingFee)}</span>
                        </div>

                        <Link
                            href="/checkout"
                            onClick={() => setOpen(false)}
                            className="block w-full py-3 bg-gradient-to-r from-ocean-500 to-teal-600 text-white text-center font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md"
                        >
                            Thanh toán →
                        </Link>

                        <button
                            onClick={() => clearCart()}
                            className="block w-full py-2.5 text-slate-500 hover:text-red-500 text-sm text-center transition-colors"
                        >
                            Xóa giỏ hàng
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

function CartItem({
    item,
    onRemove,
    onUpdateWeight,
}: {
    item: { productId: string; productName: string; productImage: string; weight: number; pricePerKg: number; totalPrice: number; slug: string };
    onRemove: () => void;
    onUpdateWeight: (w: number) => void;
}) {
    const [weight, setWeight] = useState(item.weight);

    function handleWeightChange(newWeight: number) {
        if (newWeight < 0.1) return;
        const rounded = Math.round(newWeight * 10) / 10;
        setWeight(rounded);
        onUpdateWeight(rounded);
    }

    return (
        <div className="flex gap-3 p-3 bg-ocean-50 rounded-xl">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 line-clamp-2 mb-1">{item.productName}</p>
                <p className="text-xs text-slate-500 mb-2">{formatCurrency(item.pricePerKg)}/kg</p>

                {/* Weight control */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white rounded-lg border border-ocean-200">
                        <button
                            onClick={() => handleWeightChange(weight - 0.1)}
                            className="p-1 hover:bg-ocean-50 rounded-l-lg transition-colors"
                        >
                            <Minus className="w-3 h-3 text-slate-600" />
                        </button>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0.1)}
                            className="w-14 text-center text-xs font-medium outline-none py-1"
                            step="0.1"
                            min="0.1"
                        />
                        <button
                            onClick={() => handleWeightChange(weight + 0.1)}
                            className="p-1 hover:bg-ocean-50 rounded-r-lg transition-colors"
                        >
                            <Plus className="w-3 h-3 text-slate-600" />
                        </button>
                    </div>
                    <span className="text-xs text-slate-400">kg</span>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between">
                <button onClick={onRemove} className="p-1 hover:text-red-500 text-slate-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-ocean-600">{formatCurrency(item.totalPrice)}</span>
            </div>
        </div>
    );
}
