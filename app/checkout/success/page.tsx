'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (!orderId) {
            router.push('/');
        }
    }, [orderId, router]);

    if (!orderId) return null;

    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Đặt hàng thành công!</h1>
            <p className="text-slate-500 mb-8">Cảm ơn bạn đã lựa chọn Hải Sản Quảng Ninh.</p>

            <div className="bg-white rounded-3xl border border-ocean-100 shadow-xl shadow-ocean-100/20 p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ocean-500 to-teal-500"></div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Mã đơn hàng của bạn</p>
                <p className="text-4xl font-black text-ocean-600 mb-4">{orderId}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-ocean-50 text-ocean-700 rounded-full text-xs font-bold">
                    <Clock className="w-3 h-3" />
                    Đang chờ xác nhận
                </div>
            </div>

            <div className="max-w-md mx-auto aspect-video relative mb-8 rounded-2xl overflow-hidden shadow-lg">
                <Image
                    src="https://images.unsplash.com/photo-1551462147-37885acc3c41?q=80&w=800"
                    alt="Success"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed">
                🎉 Đơn hàng của bạn đã được tiếp nhận. Nhân viên của chúng tôi sẽ liên hệ qua số điện thoại để xác nhận trong <strong>15-30 phút</strong> tới.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={() => router.push(`/order/track?orderId=${orderId}`)}
                    className="px-8 py-4 bg-ocean-600 text-white font-bold rounded-2xl hover:bg-ocean-700 transition-all hover:scale-105 shadow-lg shadow-ocean-600/20"
                >
                    Tra cứu đơn hàng
                </button>
                <button
                    onClick={() => router.push('/products')}
                    className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-ocean-500 hover:text-ocean-600 transition-all"
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
