'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, CheckCircle, Truck, Box, XCircle, Clock } from 'lucide-react';
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

    const [query, setQuery] = useState(initialOrderId);
    const [queryType, setQueryType] = useState<'orderId' | 'phone'>('orderId');
    const [order, setOrder] = useState<any | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setOrder(null);
        setOrders([]);
        setSearched(true);

        try {
            if (queryType === 'phone') {
                // Backend doesn't have a direct "find orders by phone" for guests yet
                // But we can implement it or just focus on orderCode as requested
                setError('Hiện tại hệ thống chỉ hỗ trợ tra cứu qua Mã đơn hàng');
                return;
            }

            const result = await orderService.track(query);
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
                <div className="flex gap-2 mb-4">
                    {[{ value: 'orderId', label: 'Mã đơn hàng' }, { value: 'phone', label: 'Số điện thoại' }].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setQueryType(opt.value as 'orderId' | 'phone')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${queryType === opt.value
                                ? 'bg-ocean-500 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={queryType === 'orderId' ? 'VD: HAI-2026-XXXXX' : 'VD: 0901234567'}
                            className="w-full pl-10 pr-4 py-3 border border-ocean-200 rounded-xl focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-3 bg-ocean-500 text-white font-semibold rounded-xl hover:bg-ocean-600 disabled:opacity-70 transition-colors"
                    >
                        {loading ? '...' : 'Tìm'}
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
            {searched && !loading && !error && !order && orders.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                    <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p>Không tìm thấy đơn hàng</p>
                </div>
            )}

            {/* Single order detail */}
            {order && <OrderDetail order={order} />}

            {/* Multiple orders by phone */}
            {orders.length > 0 && (
                <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-600">Tìm thấy {orders.length} đơn hàng:</p>
                    {orders.map((o) => (
                        <button
                            key={o.id}
                            onClick={() => setOrder(o)}
                            className="w-full text-left bg-white rounded-xl border border-ocean-100 shadow-sm p-4 hover:border-ocean-300 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-ocean-600">{o.orderId}</p>
                                    <p className="text-sm text-slate-500">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ORDER_STATUS_COLORS[o.status as OrderStatus]}`}>
                                    {ORDER_STATUS_LABELS[o.status as OrderStatus]}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
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
