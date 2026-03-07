'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { User, Mail, Phone, MapPin, Package, LogOut, Lock, Loader2, Check } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import apiClient from '@/src/services/apiClient';
import toast from 'react-hot-toast';

export default function AccountPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!session) redirect('/auth/login');

    const user = session?.user;

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu mới không khớp');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        setIsChangingPassword(true);
        try {
            await apiClient.patch('/auth/change-password', {
                oldPassword,
                newPassword
            });
            toast.success('Đổi mật khẩu thành công!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
        } finally {
            setIsChangingPassword(false);
        }
    };

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

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mt-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-50 pb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-ocean-600" />
                            Đổi mật khẩu
                        </h3>

                        <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-ocean-600 text-white font-semibold rounded-xl hover:bg-ocean-700 transition-colors disabled:opacity-70"
                            >
                                {isChangingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                Cập nhật mật khẩu
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
