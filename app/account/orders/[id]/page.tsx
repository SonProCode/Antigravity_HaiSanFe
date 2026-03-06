'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { notFound, redirect } from 'next/navigation';
import { orderService } from '@/src/services/order.service';
import { Package, Clock, MapPin, ChevronLeft, CreditCard, CheckCircle } from 'lucide-react';
import { formatCurrency, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function UserOrderDetailPage() {
    const { data: session, status } = useSession();
    const params = useParams();
    const orderId = params.id as string;

    const { data: orders, isLoading } = useQuery({
        queryKey: ['user-orders'],
        queryFn: () => orderService.getMyOrders(),
        enabled: !!session,
    });

    if (status === 'loading' || isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session) redirect('/auth/login');

    const order = orders?.find((o: any) => o.orderId === orderId);

    if (!order) {
        return notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-ocean-600 transition-colors mb-6">
                <ChevronLeft className="w-4 h-4" />
                Quay lại danh sách đơn hàng
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        Chi tiết đơn hàng
                        <span className={`px-3 py-1 text-xs rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                            {ORDER_STATUS_LABELS[order.status] || order.status}
                        </span>
                    </h1>
                    <p className="text-slate-500 mt-1">Mã đơn: <span className="font-semibold text-slate-700">{order.orderId}</span></p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500 mb-1">Ngày đặt hàng</p>
                    <p className="font-semibold text-slate-800">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-ocean-500" />
                            Sản phẩm ({order.items?.length || 0})
                        </h2>

                        <div className="space-y-4">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                        {item.productImage ? (
                                            <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                                <Package className="text-slate-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-800 line-clamp-2">{item.productName}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm">
                                            <p className="text-slate-500">Trọng lượng: <span className="font-semibold text-slate-700">{item.weight}kg</span></p>
                                            <p className="text-slate-500">Đơn giá: <span className="font-semibold text-slate-700">{formatCurrency(item.pricePerKg)}</span></p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-ocean-600">{formatCurrency(item.totalPrice)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 border-l-4 border-l-ocean-500">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-ocean-500" />
                            Tổng thanh toán
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Tạm tính</span>
                                <span className="font-medium text-slate-800">{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Phí vận chuyển</span>
                                <span className="font-medium text-slate-800">{formatCurrency(order.shippingFee)}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-100 pt-3 mt-3">
                                <span className="font-bold text-slate-800">Tổng cộng</span>
                                <span className="font-black text-xl text-ocean-600">{formatCurrency(order.total)}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-slate-500">Phương thức</span>
                                <span className="font-medium text-slate-700 uppercase">{order.paymentMethod}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-ocean-500" />
                            Thông tin nhận hàng
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-slate-500 mb-1">Người nhận</p>
                                <p className="font-semibold text-slate-800">{order.shipping?.name}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 mb-1">Số điện thoại</p>
                                <p className="font-semibold text-slate-800">{order.shipping?.phone}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 mb-1">Địa chỉ giao hàng</p>
                                <p className="font-medium text-slate-700 leading-relaxed">
                                    {order.shipping?.address}<br />
                                    {order.shipping?.ward}, {order.shipping?.district}, {order.shipping?.province}
                                </p>
                            </div>
                            {order.shipping?.note && (
                                <div className="mt-4 p-3 bg-ocean-50 rounded-xl border border-ocean-100">
                                    <p className="text-xs font-bold text-ocean-800 uppercase mb-1">Ghi chú</p>
                                    <p className="text-slate-700 italic">"{order.shipping.note}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-ocean-500" />
                            Trạng thái
                        </h2>
                        {/* A simple timeline representation */}
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-ocean-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <Clock className="w-4 h-4 text-white" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                        <div className="font-bold text-slate-900 text-sm">Đã đặt hàng</div>
                                        <time className="font-medium text-ocean-500 text-xs">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</time>
                                    </div>
                                    <div className="text-slate-500 text-xs">Đơn hàng đang chờ xác nhận từ cửa hàng</div>
                                </div>
                            </div>
                            {order.status !== 'pending' && (
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-ocean-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-900 text-sm">Cập nhật</div>
                                        </div>
                                        <div className="text-slate-500 text-xs">
                                            Đơn hàng đã được chuyển trạng thái: {ORDER_STATUS_LABELS[order.status] || order.status}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
