'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const errorMessages: Record<string, string> = {
        Configuration: 'Có lỗi trong cấu hình máy chủ. Vui lòng liên hệ hỗ trợ.',
        AccessDenied: 'Bạn không có quyền truy cập vào trang này.',
        Verification: 'Liên kết xác thực đã hết hạn hoặc đã được sử dụng.',
        Default: 'Đã xảy ra lỗi không xác định trong quá trình đăng nhập.',
    };

    const message = errorMessages[error as string] || errorMessages.Default;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Lỗi xác thực</h1>
                <p className="text-slate-500 mb-8">{message}</p>

                <div className="space-y-3">
                    <Link
                        href="/auth/login"
                        className="block w-full py-3 bg-ocean-500 text-white font-bold rounded-xl hover:bg-ocean-600 transition-colors shadow-md"
                    >
                        Thử lại
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full py-3 text-slate-600 font-medium hover:text-ocean-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense>
            <ErrorContent />
        </Suspense>
    );
}
