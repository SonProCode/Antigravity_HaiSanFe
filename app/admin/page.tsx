'use client';
import { useQuery } from '@tanstack/react-query';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { formatCurrency, formatNumber, ORDER_STATUS_LABELS } from '@/lib/utils';
import { TrendingUp, Package, ShoppingBag, Users, ArrowUpRight } from 'lucide-react';
import type { OrderStatus } from '@/types';
import { adminService } from '@/src/services/admin.service';

const PIE_COLORS = ['#0d93e7', '#03a9d7', '#0ea5e9', '#38bdf8', '#7dd3fc'];

export default function AdminDashboard() {
    const { data: stats, isLoading: isStatsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: () => adminService.getStats(),
    });

    const { data: revenueData, isLoading: isRevLoading } = useQuery({
        queryKey: ['admin-revenue'],
        queryFn: () => adminService.getRevenue('month'),
    });

    const { data: recentOrdersData, isLoading: isOrdersLoading } = useQuery({
        queryKey: ['admin-recent-orders'],
        queryFn: () => adminService.getOrders({ pageSize: 6 }),
    });

    const isLoading = isStatsLoading || isRevLoading || isOrdersLoading;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="skeleton h-28 rounded-2xl" />
                    ))}
                </div>
                <div className="skeleton h-72 rounded-2xl" />
            </div>
        );
    }

    const KPI_CARDS = [
        { label: 'Tổng doanh thu', value: formatCurrency(stats?.totalRevenue || 0), icon: TrendingUp, color: 'text-ocean-600 bg-ocean-50', change: '+12%' },
        { label: 'Tổng đơn hàng', value: formatNumber(stats?.totalOrders || 0), icon: ShoppingBag, color: 'text-teal-600 bg-teal-50', change: '+8%' },
        { label: 'Sản phẩm', value: formatNumber(stats?.totalProducts || 0), icon: Package, color: 'text-purple-600 bg-purple-50', change: '+3%' },
        { label: 'Người dùng', value: formatNumber(stats?.totalUsers || 0), icon: Users, color: 'text-green-600 bg-green-50', change: '+5%' },
    ];

    const revenueChartData = (revenueData || []).map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        revenue: Number(item.revenue),
        orders: item.orders,
    }));

    const statusData = [
        { name: 'Hoàn thành', value: stats?.totalOrders || 0 },
        { name: 'Đang xử lý', value: 0 },
    ];

    const recentOrders = recentOrdersData?.data || [];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {KPI_CARDS.map(({ label, value, icon: Icon, color, change }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs text-green-600 font-semibold flex items-center gap-0.5">
                                <ArrowUpRight className="w-3 h-3" />
                                {change}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{value}</p>
                        <p className="text-slate-500 text-xs mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="font-bold text-slate-800 mb-4">Doanh thu 30 ngày qua</h2>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={revenueChartData} margin={{ top: 5, right: 10, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis
                                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                                width={50}
                            />
                            <Tooltip
                                formatter={(v: any) => [formatCurrency(Number(v)), 'Doanh thu']}
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                            />
                            <Line type="monotone" dataKey="revenue" stroke="#0d93e7" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="font-bold text-slate-800 mb-4">Trạng thái đơn hàng</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={statusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={false}>
                                {statusData.map((_, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend iconSize={8} formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>} />
                            <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="font-bold text-slate-800 mb-4">Đơn hàng gần đây</h2>
                <div className="space-y-2">
                    {recentOrders.map((o: any) => (
                        <div key={o.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                            <div>
                                <p className="text-sm font-semibold text-ocean-600">{o.orderId}</p>
                                <p className="text-xs text-slate-500">{o.customerName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-800">{formatCurrency(o.total)}</p>
                                <p className={`text-xs font-medium ${o.status === 'delivered' ? 'text-green-600' :
                                    o.status === 'cancelled' ? 'text-red-500' : 'text-ocean-600'
                                    }`}>{ORDER_STATUS_LABELS[o.status] || o.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Sản phẩm', href: '/admin/products', icon: Package },
                    { label: 'Đơn hàng', href: '/admin/orders', icon: ShoppingBag },
                    { label: 'Người dùng', href: '/admin/users', icon: Users },
                    { label: 'Cấu hình', href: '/admin/settings', icon: TrendingUp },
                ].map(({ label, href, icon: Icon }) => (
                    <a key={label} href={href} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center hover:border-ocean-200 transition-colors flex flex-col items-center gap-2">
                        <Icon className="w-5 h-5 text-ocean-600" />
                        <span className="text-xs font-medium text-slate-600">{label}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
