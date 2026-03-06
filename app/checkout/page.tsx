'use client';
import { useCartStore } from '@/store/cart';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { CheckCircle, MapPin, Phone, User, FileText, Clock } from 'lucide-react';

const checkoutSchema = z.object({
    name: z.string().min(2, 'Vui lòng nhập họ tên'),
    phone: z.string().min(10, 'Số điện thoại không hợp lệ').max(11),
    province: z.string().min(1, 'Vui lòng chọn tỉnh/thành'),
    district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
    ward: z.string().min(1, 'Vui lòng nhập phường/xã'),
    address: z.string().min(5, 'Vui lòng nhập địa chỉ cụ thể'),
    note: z.string().optional(),
    paymentMethod: z.enum(['cod', 'transfer']),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const PROVINCES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Quảng Ninh', 'Hải Phòng', 'Đà Nẵng', 'Bình Dương', 'Đồng Nai', 'Cần Thơ'];
const DISTRICTS: Record<string, string[]> = {
    'Hà Nội': ['Quận Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Cầu Giấy', 'Thanh Xuân'],
    'TP. Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Bình Thạnh', 'Tân Bình', 'Thủ Đức'],
    'Quảng Ninh': ['TP. Hạ Long', 'TP. Cẩm Phả', 'TP. Móng Cái', 'Huyện Vân Đồn'],
    'Hải Phòng': ['Quận Lê Chân', 'Quận Hải Châu', 'Quận Đồ Sơn', 'Quận Kiến An'],
};

import { orderService } from '@/src/services/order.service';

function CheckoutPage() {
    const { items, getTotal, clearCart } = useCartStore();
    const { data: session } = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState<{ orderId: string } | null>(null);

    const total = getTotal();
    const shippingFee = total >= 1000000 ? 0 : 50000; // Match backend logic
    const grandTotal = total + shippingFee;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CheckoutForm>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            name: session?.user?.name || '',
            paymentMethod: 'cod',
        },
    });

    const selectedProvince = watch('province');

    async function onSubmit(data: CheckoutForm) {
        if (items.length === 0) return;
        setIsSubmitting(true);

        try {
            const result = await orderService.create({
                customerName: data.name,
                customerPhone: data.phone,
                shippingAddress: {
                    province: data.province,
                    district: data.district,
                    ward: data.ward,
                    address: data.address,
                },
                paymentMethod: data.paymentMethod.toUpperCase(), // Backend expects uppercase enum
                note: data.note,
                sessionId: localStorage.getItem('sessionId'),
            });

            if (result && result.orderId) {
                await clearCart();
                setSuccess({ orderId: result.orderId });
            }
        } catch (err) {
            console.error('Checkout error:', err);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (success) {
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
                    <p className="text-4xl font-black text-ocean-600 mb-4">{success.orderId}</p>
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
                        onClick={() => router.push(`/order/track?orderId=${success.orderId}`)}
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

    if (items.length === 0) {
        router.push('/cart');
        return null;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Thanh toán</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Shipping Form */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Shipping info */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-ocean-500" />
                                Thông tin giao hàng
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            {...register('name')}
                                            placeholder="Nguyễn Văn A"
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm"
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            {...register('phone')}
                                            placeholder="0901234567"
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tỉnh/Thành phố *</label>
                                    <select
                                        {...register('province')}
                                        className="w-full py-2.5 px-4 border border-slate-200 rounded-xl focus:border-ocean-400 outline-none text-sm bg-white"
                                    >
                                        <option value="">Chọn tỉnh/thành</option>
                                        {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Quận/Huyện *</label>
                                    <select
                                        {...register('district')}
                                        className="w-full py-2.5 px-4 border border-slate-200 rounded-xl focus:border-ocean-400 outline-none text-sm bg-white"
                                    >
                                        <option value="">Chọn quận/huyện</option>
                                        {(DISTRICTS[selectedProvince] || []).map((d) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phường/Xã *</label>
                                    <input
                                        {...register('ward')}
                                        placeholder="Phường Hồng Gai"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm"
                                    />
                                    {errors.ward && <p className="text-red-500 text-xs mt-1">{errors.ward.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ cụ thể *</label>
                                    <input
                                        {...register('address')}
                                        placeholder="Số nhà, tên đường..."
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm"
                                    />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <textarea
                                            {...register('note')}
                                            placeholder="Gọi trước khi giao, giao buổi chiều..."
                                            rows={2}
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment method */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <h2 className="font-bold text-slate-800 mb-4">Phương thức thanh toán</h2>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-3 border border-ocean-100 rounded-xl cursor-pointer has-[:checked]:border-ocean-500 has-[:checked]:bg-ocean-50 transition-colors">
                                    <input type="radio" {...register('paymentMethod')} value="cod" className="w-4 h-4 text-ocean-500" />
                                    <div>
                                        <p className="font-medium text-sm text-slate-800">💵 Thanh toán khi nhận hàng (COD)</p>
                                        <p className="text-xs text-slate-500">Nhân viên thu tiền khi giao hàng</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl cursor-pointer has-[:checked]:border-ocean-500 has-[:checked]:bg-ocean-50 transition-colors">
                                    <input type="radio" {...register('paymentMethod')} value="transfer" className="w-4 h-4 text-ocean-500" />
                                    <div>
                                        <p className="font-medium text-sm text-slate-800">🏦 Chuyển khoản ngân hàng</p>
                                        <p className="text-xs text-slate-500">Nhân viên gửi thông tin tài khoản sau xác nhận</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-fit sticky top-20">
                        <h2 className="font-bold text-slate-800 mb-4">Đơn hàng của bạn</h2>

                        <div className="space-y-3 mb-4">
                            {items.map((item) => (
                                <div key={item.productId} className="flex gap-2">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                        <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-slate-800 line-clamp-1">{item.productName}</p>
                                        <p className="text-xs text-slate-500">{item.weight}kg × {formatCurrency(item.pricePerKg)}</p>
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 shrink-0">{formatCurrency(item.totalPrice)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
                            <div className="flex justify-between text-slate-600"><span>Tạm tính</span><span>{formatCurrency(total)}</span></div>
                            <div className="flex justify-between text-slate-600">
                                <span>Phí vận chuyển</span>
                                <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                                    {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-800 border-t border-slate-100 pt-2 mt-2">
                                <span>Tổng cộng</span>
                                <span className="text-ocean-600 text-base">{formatCurrency(grandTotal)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-4 w-full py-3.5 bg-gradient-to-r from-ocean-500 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-70 transition-opacity shadow-md"
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đơn hàng'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CheckoutPage;
