'use client';
import { useQuery } from '@tanstack/react-query';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { formatCurrency, formatNumber, ORDER_STATUS_LABELS } from '@/lib/utils';
import { TrendingUp, Package, ShoppingBag, Users, ArrowUpRight } from 'lucide-react';
import type { Order } from '@/types';

async function fetchAdminData() {
    const [ordersRes, productsRes, usersRes] = await Promise.all([
        fetch('/api/orders?pageSize=1000'),
        fetch('/api/products?pageSize=1000'),
        fetch('/api/users?pageSize=1000'),
    ]);

    const [orders, products, users] = await Promise.all([
        ordersRes.json(),
        productsRes.json(),
        usersRes.json(),
    ]);

    return { orders: orders.data || [], products: products.data || [], users: users.data || [] };
}

const CATEGORY_LABELS: Record<string, string> = {
    tom: 'Tôm', ca: 'Cá', muc: 'Mực', cua: 'Cua', premium: 'Cao cấp',
};

const PIE_COLORS = ['#0d93e7', '#03a9d7', '#0ea5e9', '#38bdf8', '#7dd3fc'];

export default function AdminDashboard() {
    const { data, isLoading } = useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: fetchAdminData,
    });

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

    const orders: Order[] = data?.orders || [];
    const products = data?.products || [];
    const users = data?.users || [];

    // KPIs
    const totalRevenue = orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const conversionRate = totalOrders > 0 ? (delivered / totalOrders) * 100 : 0;

    // Revenue by day (last 14 days)
    const revenueByDay: Record<string, { revenue: number; orders: number }> = {};
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        revenueByDay[key] = { revenue: 0, orders: 0 };
    }
    orders.forEach((o) => {
        if (o.status !== 'cancelled') {
            const d = new Date(o.createdAt);
            const key = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
            if (revenueByDay[key]) {
                revenueByDay[key].revenue += o.total;
                revenueByDay[key].orders += 1;
            }
        }
    });
    const revenueChartData = Object.entries(revenueByDay).map(([date, v]) => ({ date, ...v }));

    // Order status breakdown
    const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {});
    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        name: ORDER_STATUS_LABELS[status] || status,
        value: count,
    }));

    // Category breakdown
    const categoryRevenue: Record<string, number> = {};
    orders.forEach((o) => {
        if (o.status !== 'cancelled') {
            o.items.forEach((item) => {
                const product = products.find((p: { id: string; category: string }) => p.id === item.productId);
                if (product) {
                    categoryRevenue[product.category] = (categoryRevenue[product.category] || 0) + item.totalPrice;
                }
            });
        }
    });
    const categoryData = Object.entries(categoryRevenue).map(([category, revenue]) => ({
        name: CATEGORY_LABELS[category] || category,
        revenue,
    }));

    const KPI_CARDS = [
        { label: 'Tổng doanh thu', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-ocean-600 bg-ocean-50', change: '+12%' },
        { label: 'Tổng đơn hàng', value: formatNumber(totalOrders), icon: ShoppingBag, color: 'text-teal-600 bg-teal-50', change: '+8%' },
        { label: 'Giá trị TB đơn', value: formatCurrency(aov), icon: Package, color: 'text-purple-600 bg-purple-50', change: '+3%' },
        { label: 'Tỷ lệ hoàn thành', value: `${conversionRate.toFixed(1)}%`, icon: Users, color: 'text-green-600 bg-green-50', change: '+5%' },
    ];

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
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="font-bold text-slate-800 mb-4">Doanh thu 14 ngày qua</h2>
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

                {/* Order Status Pie */}
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

            {/* Charts Row 2 */}
            <div className="grid lg:grid-cols-2 gap-4">
                {/* Category Revenue */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="font-bold text-slate-800 mb-4">Doanh thu theo danh mục</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={categoryData} margin={{ top: 5, right: 10, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 11 }} width={50} />
                            <Tooltip formatter={(v: any) => [formatCurrency(Number(v)), 'Doanh thu']} contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                            <Bar dataKey="revenue" fill="#0d93e7" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent orders */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h2 className="font-bold text-slate-800 mb-4">Đơn hàng gần đây</h2>
                    <div className="space-y-2">
                        {orders.slice(0, 6).map((o) => (
                            <div key={o.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                <div>
                                    <p className="text-sm font-semibold text-ocean-600">{o.orderId}</p>
                                    <p className="text-xs text-slate-500">{o.shipping?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-800">{formatCurrency(o.total)}</p>
                                    <p className={`text-xs font-medium ${o.status === 'delivered' ? 'text-green-600' :
                                        o.status === 'cancelled' ? 'text-red-500' : 'text-ocean-600'
                                        }`}>{ORDER_STATUS_LABELS[o.status]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Sản phẩm hoạt động', value: products.length, href: '/admin/products' },
                    { label: 'Người dùng đăng ký', value: users.length, href: '/admin/users' },
                    { label: 'Sắp hết kho (<5kg)', value: products.filter((p: { inventoryKg: number }) => p.inventoryKg < 5).length, href: '/admin/products?lowStock=1' },
                ].map(({ label, value, href }) => (
                    <a key={label} href={href} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center hover:border-ocean-200 transition-colors block">
                        <p className="text-2xl font-bold text-ocean-600">{value}</p>
                        <p className="text-slate-500 text-xs mt-1">{label}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}
