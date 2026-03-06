'use client';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Suspense } from 'react';

const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginContent() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: LoginForm) {
        setIsLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (res?.error) {
                setError('Email hoặc mật khẩu không đúng');
                return;
            }

            // Admin redirect
            if (data.email === 'admin@haisan.vn') {
                router.push('/admin');
            } else {
                router.push(callbackUrl);
            }
            router.refresh();
        } catch {
            setError('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleGoogleLogin() {
        await signIn('google', { callbackUrl });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-teal-50 flex items-center justify-center px-4">
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
                    <h1 className="text-2xl font-bold text-slate-800 mb-1">Đăng nhập</h1>
                    <p className="text-slate-500 text-sm mb-6">Chào mừng bạn quay lại!</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="email@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-ocean-500 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-70 transition-opacity shadow-md"
                        >
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-slate-400 text-xs">hoặc</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-3 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Tiếp tục với Google
                    </button>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Chưa có tài khoản?{' '}
                        <Link href="/auth/register" className="text-ocean-600 font-semibold hover:underline">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}
