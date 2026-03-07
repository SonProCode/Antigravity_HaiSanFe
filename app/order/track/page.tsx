'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, CheckCircle, Truck, Box, XCircle, Clock, Phone } from 'lucide-react';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

function getStatusIcon(status: OrderStatus) {
    const icons: Record<OrderStatus, React.ReactNode> = {
        pending: <Clock className="w-5 h-5" />,
        confirmed: <CheckCircle className="w-5 h-5" />,
        packed: <Box className="w-5 h-5" />,
        shipped: <Truck className="w-5 h-5" />,
        delivered: <CheckCircle className="w-5 h-5" />,
        cancelled: <XCircle className="w-5 h-5" />,
    };
    return icons[status];
}


const STATUS_ORDER: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

import { orderService } from '@/src/services/order.service';

function OrderTrackingContent() {
    const searchParams = useSearchParams();
    const initialOrderId = searchParams.get('orderId') || '';

    const [orderCode, setOrderCode] = useState(initialOrderId);
    const [phone, setPhone] = useState('');
    const [order, setOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!orderCode.trim() || !phone.trim()) {
            setError('Vui lòng nhập mã đơn hàng và số điện thoại');
            return;
        }

        setLoading(true);
        setError('');
        setOrder(null);
        setSearched(true);

        try {
            const result = await orderService.track(orderCode, phone);
            if (result) {
                setOrder(result);
            } else {
                setError('Không tìm thấy đơn hàng');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không tìm thấy đơn hàng');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-ocean-100 flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-ocean-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Tra cứu đơn hàng</h1>
                <p className="text-slate-500 mt-2 text-sm">Nhập mã đơn hàng hoặc số điện thoại để kiểm tra trạng thái</p>
            </div>

            {/* Search form */}
            <div className="bg-white rounded-2xl border border-ocean-100 shadow-sm p-5 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col gap-3">
                    <div className="relative">
                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={orderCode}
                            onChange={(e) => setOrderCode(e.target.value)}
                            placeholder="Mã đơn hàng (VD: HAI-2026-XXXXX)"
                            className="w-full pl-10 pr-4 py-3 border border-ocean-200 rounded-xl focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm"
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Số điện thoại đặt hàng"
                            className="w-full pl-10 pr-4 py-3 border border-ocean-200 rounded-xl focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-ocean-500 text-white font-semibold rounded-xl hover:bg-ocean-600 disabled:opacity-70 transition-colors"
                    >
                        {loading ? 'Đang tìm kiếm...' : 'Tra cứu đơn hàng'}
                    </button>
                </form>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center text-red-600 text-sm mb-4">
                    {error}
                </div>
            )}

            {/* No results */}
            {searched && !loading && !error && !order && (
                <div className="text-center py-8 text-slate-500">
                    <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p>Không tìm thấy đơn hàng</p>
                </div>
            )}

            {/* Single order detail */}
            {order && <OrderDetail order={order} />}
        </div>
    );
}

function OrderDetail({ order }: { order: Order }) {
    const isCancelled = order.status === 'cancelled';
    const currentIndex = isCancelled ? -1 : STATUS_ORDER.indexOf(order.status);

    return (
        <div className="bg-white rounded-2xl border border-ocean-100 shadow-sm p-5">
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
                <div>
                    <p className="text-sm text-slate-500">Mã đơn hàng</p>
                    <p className="text-xl font-bold text-ocean-600">{order.orderId}</p>
                </div>
                <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                </span>
            </div>

            {/* Timeline */}
            {!isCancelled && (
                <div className="mb-6">
                    <div className="flex items-center gap-1 mb-4">
                        {STATUS_ORDER.map((s, i) => (
                            <div key={s} className="flex items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${i <= currentIndex ? ORDER_STATUS_COLORS[s] : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {getStatusIcon(s)}
                                </div>
                                {i < STATUS_ORDER.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-1 ${i < currentIndex ? 'bg-ocean-400' : 'bg-slate-200'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between">
                        {STATUS_ORDER.map((s) => (
                            <span key={s} className="text-[10px] text-slate-500 text-center flex-1">{ORDER_STATUS_LABELS[s]}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Status Timeline */}
            <div className="mb-5">
                <h3 className="font-semibold text-slate-800 mb-3 text-sm">Lịch sử trạng thái</h3>
                <div className="space-y-3">
                    {[...order.statusTimeline].reverse().map((entry, i) => (
                        <div key={i} className="flex gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${i === 0 ? 'bg-ocean-500' : 'bg-slate-300'}`} />
                            <div>
                                <p className="text-sm font-medium text-slate-800">{ORDER_STATUS_LABELS[entry.status]}</p>
                                {entry.note && <p className="text-xs text-slate-500">{entry.note}</p>}
                                <p className="text-xs text-slate-400">{new Date(entry.timestamp).toLocaleString('vi-VN')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping info */}
            <div className="bg-ocean-50 rounded-xl p-3 text-sm">
                <p className="font-semibold text-slate-800 mb-1">Thông tin giao hàng</p>
                <p className="text-slate-600">{order.shipping.name} — {order.shipping.phone}</p>
                <p className="text-slate-500">{order.shipping.address}, {order.shipping.district}, {order.shipping.province}</p>
            </div>
        </div>
    );
}

export default function OrderTrackPage() {
    return (
        <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-10 text-center text-slate-500">Đang tải...</div>}>
            <OrderTrackingContent />
        </Suspense>
    );
}
