'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { User, Mail, Phone, MapPin, Package, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AccountPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!session) redirect('/auth/login');

    const user = session.user;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Tài khoản của tôi</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="space-y-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-600 text-2xl font-bold mb-4">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                        <h2 className="font-bold text-slate-800">{user.name}</h2>
                        <p className="text-sm text-slate-500 mb-4">{user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</p>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <button className="w-full flex items-center gap-3 px-6 py-4 text-sm font-medium text-ocean-600 bg-ocean-50 border-r-4 border-ocean-500">
                            <User className="w-4 h-4" />
                            Thông tin cá nhân
                        </button>
                        <button className="w-full flex items-center gap-3 px-6 py-4 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                            <Package className="w-4 h-4" />
                            Đơn hàng của tôi
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-50 pb-4">Thông tin cá nhân</h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Họ và tên</p>
                                    <p className="text-slate-700 font-semibold">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <Mail className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Email</p>
                                    <p className="text-slate-700 font-semibold">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
