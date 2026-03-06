'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(2, 'Họ tên ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().min(10, 'Số điện thoại không hợp lệ').max(11),
    password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

import { authService } from '@/src/services/auth.service';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    async function onSubmit(data: RegisterForm) {
        setIsLoading(true);
        setError('');

        try {
            await authService.register({
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
            });

            router.push('/auth/login?registered=true');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-teal-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ocean-500 to-teal-600 flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold">HS</span>
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-ocean-800 text-lg">Hải Sản Quảng Ninh</div>
                            <div className="text-ocean-500 text-xs">Tươi ngon từ biển</div>
                        </div>
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-ocean-100 p-8">
                    <h1 className="text-2xl font-bold text-slate-800 mb-1">Đăng ký tài khoản</h1>
                    <p className="text-slate-500 text-sm mb-6">Trở thành thành viên để nhận ưu đãi hấp dẫn!</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
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
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="email@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
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
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu</label>
                            <input
                                {...register('confirmPassword')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-ocean-500 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-70 transition-opacity shadow-md mt-2"
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Đã có tài khoản?{' '}
                        <Link href="/auth/login" className="text-ocean-600 font-semibold hover:underline">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
