'use client';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { orderService } from '@/src/services/order.service';
import { Package, Clock, ChevronRight } from 'lucide-react';
import { formatCurrency, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';


export default function UserOrdersPage() {
    const { data: session, status } = useSession();

    const { data: orders, isLoading } = useQuery({
        queryKey: ['user-orders'],
        queryFn: () => orderService.getMyOrders(),
        enabled: !!session,
    });

    if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!session) redirect('/auth/login');

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Đơn hàng của tôi</h1>

            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
                            <div className="h-4 bg-slate-100 rounded w-1/4 mb-4"></div>
                            <div className="h-12 bg-slate-50 rounded mb-2"></div>
                        </div>
                    ))
                ) : orders?.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">Bạn chưa có đơn hàng nào.</p>
                    </div>
                ) : (
                    orders?.map((order: any) => (
                        <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-ocean-200 transition-colors group">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-ocean-50 rounded-xl">
                                        <Package className="w-5 h-5 text-ocean-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{order.orderId}</p>
                                        <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
                                    {ORDER_STATUS_LABELS[order.status] || order.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-sm">
                                        <p className="text-slate-500">Tổng thanh toán</p>
                                        <p className="text-lg font-bold text-ocean-600">{formatCurrency(order.total)}</p>
                                    </div>
                                </div>
                                <Link
                                    href={`/order/track?orderId=${order.orderId}`}
                                    className="flex items-center gap-1 text-sm font-semibold text-slate-400 group-hover:text-ocean-600 transition-colors"
                                >
                                    Chi tiết <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
