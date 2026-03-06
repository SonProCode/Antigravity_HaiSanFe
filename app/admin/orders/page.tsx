'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { formatCurrency, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';
import { Search } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

async function fetchOrders(page = 1) {
    const res = await fetch(`/api/orders?page=${page}&pageSize=15`);
    return res.json();
}

async function updateOrderStatus(id: string, status: OrderStatus, note: string) {
    const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}

export default function AdminOrdersPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-orders', page],
        queryFn: () => fetchOrders(page),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, status, note }: { id: string; status: OrderStatus; note: string }) =>
            updateOrderStatus(id, status, note),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            setSelectedOrder(null);
        },
    });

    const orders: Order[] = data?.data || [];
    const filtered = orders.filter((o) =>
        !search ||
        o.orderId.toLowerCase().includes(search.toLowerCase()) ||
        o.shipping?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.shipping?.phone?.includes(search)
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Quản lý đơn hàng</h1>
                    <p className="text-slate-500 text-sm">{data?.total || 0} đơn hàng</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm theo mã đơn, tên, SĐT..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-ocean-400"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Mã đơn</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Khách hàng</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Tổng tiền</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Ngày đặt</th>
                                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading
                                ? Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 6 }).map((_, j) => (
                                            <td key={j} className="px-4 py-3"><div className="skeleton h-4 w-full" /></td>
                                        ))}
                                    </tr>
                                ))
                                : filtered.map((o) => (
                                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-bold text-ocean-600">{o.orderId}</p>
                                            <p className="text-xs text-slate-400">{o.items.length} sản phẩm</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-slate-800">{o.shipping?.name}</p>
                                            <p className="text-xs text-slate-500">{o.shipping?.phone}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-semibold text-slate-800">{formatCurrency(o.total)}</p>
                                            <p className="text-xs text-slate-400">{o.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[o.status]}`}>
                                                {ORDER_STATUS_LABELS[o.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-500">
                                            {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelectedOrder(o)}
                                                className="px-3 py-1.5 text-xs font-medium text-ocean-600 bg-ocean-50 hover:bg-ocean-100 rounded-lg transition-colors"
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data?.totalPages > 1 && (
                    <div className="flex justify-center gap-2 p-4 border-t border-slate-100">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:border-ocean-300 disabled:opacity-40"
                        >
                            ←
                        </button>
                        <span className="px-3 py-1.5 text-sm text-slate-600">{page} / {data.totalPages}</span>
                        <button
                            disabled={page >= data.totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:border-ocean-300 disabled:opacity-40"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdateStatus={(status, note) => updateMutation.mutate({ id: selectedOrder.id, status, note })}
                    isUpdating={updateMutation.isPending}
                />
            )}
        </div>
    );
}

function OrderDetailModal({
    order,
    onClose,
    onUpdateStatus,
    isUpdating,
}: {
    order: Order;
    onClose: () => void;
    onUpdateStatus: (status: OrderStatus, note: string) => void;
    isUpdating: boolean;
}) {
    const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
    const [note, setNote] = useState('');

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <div>
                        <h2 className="font-bold text-slate-800">Chi tiết đơn hàng</h2>
                        <p className="text-ocean-600 font-semibold">{order.orderId}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full">✕</button>
                </div>

                <div className="p-5 space-y-5">
                    {/* Items */}
                    <div>
                        <h3 className="font-semibold text-slate-700 mb-2 text-sm">Sản phẩm</h3>
                        <div className="space-y-2">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm py-1.5 border-b border-slate-50">
                                    <span className="text-slate-700">{item.productName} × {item.weight}kg</span>
                                    <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between text-sm font-bold pt-1">
                                <span>Tổng cộng</span>
                                <span className="text-ocean-600">{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="bg-ocean-50 rounded-xl p-3 text-sm">
                        <p className="font-semibold mb-1">Giao hàng</p>
                        <p>{order.shipping.name} — {order.shipping.phone}</p>
                        <p className="text-slate-500">{order.shipping.address}, {order.shipping.district}, {order.shipping.province}</p>
                        {order.shipping.note && <p className="text-slate-400 italic mt-1">"{order.shipping.note}"</p>}
                    </div>

                    {/* Change status */}
                    <div>
                        <h3 className="font-semibold text-slate-700 mb-2 text-sm">Cập nhật trạng thái</h3>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:border-ocean-400 outline-none mb-2"
                        >
                            {ALL_STATUSES.map((s) => (
                                <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ghi chú (tùy chọn)"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-ocean-400 outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-3 p-5 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => onUpdateStatus(newStatus, note)}
                        disabled={isUpdating || newStatus === order.status}
                        className="flex-1 py-2.5 bg-ocean-500 text-white rounded-xl text-sm font-semibold hover:bg-ocean-600 disabled:opacity-70"
                    >
                        {isUpdating ? 'Đang cập nhật...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
}
